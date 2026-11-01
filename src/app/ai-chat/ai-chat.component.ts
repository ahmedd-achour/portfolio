import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

// The local proxy (ai-server/) is exposed through a Cloudflare quick tunnel whose address
// changes on every restart. ai-server/start.ps1 publishes the current address in a public
// gist file, which the site looks up here. On localhost, talk to the proxy directly.
const GITHUB_USER = 'ahmedd-achour';
const ENDPOINT_FILE = 'portfolio-ai-endpoint.json';
const LOCAL_AI_ENDPOINT = 'http://127.0.0.1:8787';

async function findPublicEndpoint(): Promise<string> {
  const gists = await (await fetch(`https://api.github.com/users/${GITHUB_USER}/gists?per_page=50`, { signal: AbortSignal.timeout(6000) })).json();
  const file = gists.find((g: any) => g.files?.[ENDPOINT_FILE])?.files[ENDPOINT_FILE];
  if (!file) throw new Error('no endpoint published');
  // raw_url is pinned to the latest revision, so it is never a stale cached copy.
  const { url } = await (await fetch(file.raw_url, { signal: AbortSignal.timeout(6000) })).json();
  return url;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type Status = 'checking' | 'online' | 'offline';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.css'
})
export class AiChatComponent implements OnInit {
  @ViewChild('thread') thread?: ElementRef<HTMLDivElement>;

  status: Status = 'checking';
  model = '';
  messages: ChatMessage[] = [];
  draft = '';
  busy = false;
  endpoint = '';

  suggestions = [
    'Who is Ahmed and what does he build?',
    'Tell me about the DADA Rent Car project',
    'What is his experience with Flutter?',
    'Pourquoi devrais-je recruter Ahmed ?'
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (location.hostname === 'localhost') this.endpoint = LOCAL_AI_ENDPOINT;
    this.checkHealth();
  }

  async checkHealth() {
    this.status = 'checking';
    try {
      if (!this.endpoint) this.endpoint = await findPublicEndpoint();
      const res = await fetch(`${this.endpoint}/health`, { signal: AbortSignal.timeout(6000) });
      const body = await res.json();
      this.model = body.model || '';
      this.status = res.ok && body.ok ? 'online' : 'offline';
    } catch {
      this.status = 'offline';
      // Look the address up again on the next try: the tunnel may have restarted.
      if (this.endpoint !== LOCAL_AI_ENDPOINT) this.endpoint = '';
    }
  }

  ask(question: string) {
    this.draft = question;
    this.send();
  }

  reset() {
    if (this.busy) return;
    this.messages = [];
  }

  async send() {
    const text = this.draft.trim();
    if (!text || this.busy) return;
    this.draft = '';
    this.busy = true;
    this.messages.push({ role: 'user', content: text });
    const reply: ChatMessage = { role: 'assistant', content: '' };
    this.messages.push(reply);
    this.scrollDown();

    try {
      const res = await fetch(`${this.endpoint}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: this.messages.slice(0, -1).slice(-10) })
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      this.status = 'online';
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply.content += decoder.decode(value, { stream: true });
        this.scrollDown();
      }
      if (!reply.content.trim()) reply.content = 'Sorry, I could not produce an answer. Please try again.';
    } catch (e: any) {
      if (e instanceof TypeError) this.status = 'offline';
      reply.content = this.status === 'offline'
        ? 'The assistant is offline right now: it runs on Ahmed\'s own PC, which is switched off. You can reach Ahmed directly on WhatsApp (+216 94 190 332).'
        : `Something went wrong (${e.message}). Please try again in a moment.`;
    } finally {
      this.busy = false;
      this.scrollDown();
    }
  }

  onKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private scrollDown() {
    setTimeout(() => {
      const el = this.thread?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
