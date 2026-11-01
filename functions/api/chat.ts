import { MODEL, PROFILE } from './_profile';

// POST /api/chat { messages: [{ role, content }] } -> the answer streamed as plain text.
// Runs on Cloudflare Workers AI: nothing depends on a personal computer.
const MAX_TURNS = 10;
const MAX_CHARS = 600;
const RATE_LIMIT = 20;            // messages per IP...
const RATE_WINDOW_MS = 10 * 60e3; // ...per 10 minutes (best effort, per Cloudflare isolate)

const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function cleanMessages(input: unknown) {
  if (!Array.isArray(input)) return null;
  const msgs = input
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_TURNS)
    .map(m => ({ role: m.role as string, content: (m.content as string).slice(0, MAX_CHARS) }));
  return msgs.length && msgs[msgs.length - 1].role === 'user' ? msgs : null;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: { AI: any } }) => {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (rateLimited(ip)) return Response.json({ error: 'Too many questions, please wait a few minutes.' }, { status: 429 });

  let messages = null;
  try {
    messages = cleanMessages(((await request.json()) as { messages?: unknown }).messages);
  } catch {}
  if (!messages) return Response.json({ error: 'Invalid request.' }, { status: 400 });

  let stream: ReadableStream<Uint8Array>;
  try {
    stream = await env.AI.run(MODEL, {
      messages: [{ role: 'system', content: PROFILE }, ...messages],
      stream: true,
      max_tokens: 400,
      temperature: 0.4
    });
  } catch (e) {
    console.error('Workers AI error:', e);
    return Response.json({ error: 'The assistant is unavailable, please retry later.' }, { status: 502 });
  }

  // Workers AI streams server-sent events ("data: {"response":"..."}"); forward only the text.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';
  const text = stream.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const data = line.startsWith('data:') ? line.slice(5).trim() : '';
        if (!data || data === '[DONE]') continue;
        try {
          const part = JSON.parse(data).response;
          if (part) controller.enqueue(encoder.encode(part));
        } catch {}
      }
    }
  }));

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } });
};
