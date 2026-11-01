# Local AI assistant

This is the backend for the "Ask my AI" section of the portfolio. Everything runs on this PC:

```
browser ──HTTPS──> Cloudflare Tunnel ──> server.mjs (127.0.0.1:8787) ──> Ollama (127.0.0.1:11434, qwen2.5:3b)
```

- `server.mjs` is a Node.js proxy with no dependencies. It exposes only `GET /health` and `POST /chat`, adds the system prompt (`profile.md`), limits each IP to 20 messages per 10 minutes, caps the answer length, allows CORS only from achour.pages.dev, and streams the answer back. The raw Ollama API is never exposed.
- `profile.md` holds the facts the assistant may use. Edit it when your CV changes; restart the server afterwards.
- The site calls `AI_ENDPOINT` in `src/app/ai-chat/ai-chat.component.ts`.

## One-time setup

```powershell
winget install Ollama.Ollama
winget install Cloudflare.cloudflared
ollama pull qwen2.5:3b

cloudflared tunnel login                       # opens the browser, pick the domain (e.g. shnell.tn)
cloudflared tunnel create portfolio-ai
cloudflared tunnel route dns portfolio-ai ai.shnell.tn
```

## Start (each time the PC boots)

```powershell
.\start.ps1
```

This starts the proxy and the named tunnel in the background. When the PC is off, the chat shows "Offline" with a WhatsApp link.

## Changing the model

`$env:MODEL="qwen2.5:7b"; node server.mjs`. The 7B model gives better answers but is slower on a 6 GB GPU.
