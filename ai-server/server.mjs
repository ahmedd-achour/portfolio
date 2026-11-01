// Local AI proxy for the portfolio chat.
// Exposes only GET /health and POST /chat on 127.0.0.1, in front of Ollama.
// Published to the internet through a Cloudflare Tunnel (see README.md).
import http from 'node:http';
import { readFileSync } from 'node:fs';

const PORT = Number(process.env.PORT || 8787);
const OLLAMA = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const MODEL = process.env.MODEL || 'qwen2.5:3b';
const ALLOWED_ORIGINS = [
  'https://achour.pages.dev',
  /^https:\/\/[a-z0-9-]+\.achour\.pages\.dev$/,
  /^http:\/\/localhost:\d+$/
];
const RATE_LIMIT = 20;              // messages per IP...
const RATE_WINDOW_MS = 10 * 60e3;   // ...per 10 minutes
const MAX_CONCURRENT = 2;
const MAX_TURNS = 10;
const MAX_CHARS = 600;

const SYSTEM_PROMPT = readFileSync(new URL('./profile.md', import.meta.url), 'utf8');

const hits = new Map();
let active = 0;

function corsHeaders(origin) {
  const ok = origin && ALLOWED_ORIGINS.some(o => (typeof o === 'string' ? o === origin : o.test(origin)));
  return ok
    ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' }
    : {};
}

function json(res, status, body, headers) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(JSON.stringify(body));
}

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 20_000) { reject(new Error('Body too large')); req.destroy(); }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function cleanMessages(input) {
  if (!Array.isArray(input)) return null;
  const msgs = input
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_TURNS)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  return msgs.length && msgs[msgs.length - 1].role === 'user' ? msgs : null;
}

async function health(res, cors) {
  try {
    const r = await fetch(`${OLLAMA}/api/tags`, { signal: AbortSignal.timeout(3000) });
    const { models = [] } = await r.json();
    const ok = models.some(m => m.name === MODEL || m.model === MODEL);
    json(res, ok ? 200 : 503, { ok, model: MODEL }, cors);
  } catch {
    json(res, 503, { ok: false, model: MODEL }, cors);
  }
}

async function chat(req, res, cors) {
  const ip = req.headers['cf-connecting-ip'] || req.socket.remoteAddress;
  if (rateLimited(ip)) return json(res, 429, { error: 'Too many questions, please wait a few minutes.' }, cors);
  if (active >= MAX_CONCURRENT) return json(res, 503, { error: 'The assistant is busy, please retry in a few seconds.' }, cors);

  let messages;
  try {
    messages = cleanMessages(JSON.parse(await readBody(req)).messages);
  } catch {
    messages = null;
  }
  if (!messages) return json(res, 400, { error: 'Invalid request.' }, cors);

  active++;
  const abort = new AbortController();
  res.on('close', () => abort.abort());
  try {
    const upstream = await fetch(`${OLLAMA}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abort.signal,
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        keep_alive: '30m',
        options: { temperature: 0.4, num_predict: 400, num_ctx: 4096 },
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]
      })
    });
    if (!upstream.ok) throw new Error(`Ollama HTTP ${upstream.status}`);

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no', ...cors });
    const decoder = new TextDecoder();
    let buffer = '';
    for await (const chunk of upstream.body) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        const part = JSON.parse(line);
        if (part.message?.content) res.write(part.message.content);
      }
    }
    res.end();
  } catch (e) {
    if (abort.signal.aborted) return;
    console.error('chat error:', e.message);
    if (!res.headersSent) json(res, 502, { error: 'The local model did not respond.' }, cors);
    else res.end();
  } finally {
    active--;
  }
}

http.createServer(async (req, res) => {
  const cors = corsHeaders(req.headers.origin);
  const path = new URL(req.url, 'http://x').pathname;
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  if (req.method === 'GET' && path === '/health') return health(res, cors);
  if (req.method === 'POST' && path === '/chat') return chat(req, res, cors);
  json(res, 404, { error: 'Not found' }, cors);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`AI proxy on http://127.0.0.1:${PORT} → ${OLLAMA} (${MODEL})`);
});

// Forget old rate-limit entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of hits) if (times.every(t => now - t >= RATE_WINDOW_MS)) hits.delete(ip);
}, RATE_WINDOW_MS).unref();
