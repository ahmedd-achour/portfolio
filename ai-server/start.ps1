# Starts Ollama, the AI proxy and the Cloudflare Tunnel in the background.
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$logs = Join-Path $here 'logs'
New-Item -ItemType Directory -Force $logs | Out-Null

function Find-Exe($name, $fallback) {
  $cmd = Get-Command $name -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  return $fallback
}
$ollama = Find-Exe 'ollama' "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe"
$cloudflared = Find-Exe 'cloudflared' "$env:USERPROFILE\tools\cloudflared.exe"

if (-not (Get-Process ollama -ErrorAction SilentlyContinue)) {
  Start-Process $ollama -ArgumentList 'serve' -WindowStyle Hidden
}

Start-Process node -ArgumentList "`"$here\server.mjs`"" -WindowStyle Hidden `
  -RedirectStandardOutput "$logs\server.log" -RedirectStandardError "$logs\server.err.log"

Start-Process $cloudflared -ArgumentList 'tunnel', '--no-autoupdate', 'run', '--url', 'http://127.0.0.1:8787', 'portfolio-ai' -WindowStyle Hidden `
  -RedirectStandardOutput "$logs\tunnel.log" -RedirectStandardError "$logs\tunnel.err.log"

Write-Host 'AI proxy + tunnel started. Logs in' $logs
