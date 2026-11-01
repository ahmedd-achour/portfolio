# Local AI assistant

This is the backend for the "Ask my AI" section of the portfolio. Everything runs on this PC:

```
browser ──HTTPS──> Cloudflare Tunnel ──> server.mjs (127.0.0.1:8787) ──> Ollama (127.0.0.1:11434, qwen2.5:3b)
```

- `server.mjs` is a Node.js proxy with no dependencies. It exposes only `GET /health` and `POST /chat`, adds the system prompt (`profile.md`), limits each IP to 20 messages per 10 minutes, caps the answer length, allows CORS only from achour.pages.dev, and streams the answer back. The raw Ollama API is never exposed.
- `profile.md` holds the facts the assistant may use. Edit it when your CV changes; restart the server afterwards.
- The site finds the address through the gist (see `findPublicEndpoint` in `src/app/ai-chat/ai-chat.component.ts`).

## One-time setup

```powershell
winget install Ollama.Ollama
winget install Cloudflare.cloudflared
ollama pull qwen2.5:3b

# (no domain needed: start.ps1 uses a free quick tunnel and publishes its address in a gist)
```

## Start (each time the PC boots)

```powershell
.\start.ps1
```

This starts the proxy and a Cloudflare quick tunnel (https://….trycloudflare.com) and publishes the address in the public gist file `portfolio-ai-endpoint.json`; the site reads it from there. Requires `gh auth login`. When the PC is off, the chat shows "Offline" with a WhatsApp link.

## Changing the model

`$env:MODEL="qwen2.5:7b"; node server.mjs`. The 7B model gives better answers but is slower on a 6 GB GPU.
