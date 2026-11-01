# Starts Ollama, the AI proxy and a Cloudflare quick tunnel, then publishes the tunnel
# address in a public gist (portfolio-ai-endpoint.json) so the live site can find it.
# Needs: Ollama, Node.js, cloudflared, and the GitHub CLI logged in (gh auth login).
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

# Proxy: start it only if nothing answers on 8787 yet.
try { Invoke-RestMethod http://127.0.0.1:8787/health -TimeoutSec 3 | Out-Null }
catch {
  Start-Process node -ArgumentList "`"$here\server.mjs`"" -WindowStyle Hidden `
    -RedirectStandardOutput "$logs\server.log" -RedirectStandardError "$logs\server.err.log"
}

# Quick tunnel: no domain or Cloudflare account needed, but a new address on every start.
Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force
$tunnelLog = "$logs\tunnel.log"
Remove-Item $tunnelLog -ErrorAction SilentlyContinue
Start-Process $cloudflared -ArgumentList 'tunnel', '--no-autoupdate', '--url', 'http://127.0.0.1:8787' -WindowStyle Hidden `
  -RedirectStandardOutput "$logs\tunnel.out.log" -RedirectStandardError $tunnelLog

$url = $null
for ($i = 0; $i -lt 60 -and -not $url; $i++) {
  Start-Sleep -Seconds 1
  $m = Select-String -Path $tunnelLog -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($m) { $url = $m.Matches[0].Value }
}
if (-not $url) { Write-Host "Tunnel did not start. See $tunnelLog"; exit 1 }

# Publish the address.
$file = Join-Path $logs 'portfolio-ai-endpoint.json'
$json = '{"url":"' + $url + '","updated":"' + (Get-Date).ToUniversalTime().ToString('s') + 'Z"}'
[IO.File]::WriteAllText($file, $json)
$gist = ((gh api /gists | ConvertFrom-Json) | Where-Object { $_.files.'portfolio-ai-endpoint.json' } | Select-Object -First 1).id
if ($gist) {
  gh gist edit $gist --filename portfolio-ai-endpoint.json $file
} else {
  gh gist create --public -d "Current address of Achour Ahmed's local AI (portfolio chat). Updated automatically." $file
}

Write-Host "AI online at $url (published to the gist). Logs in $logs"
