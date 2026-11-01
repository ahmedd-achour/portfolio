# Keeps the AI reachable: every 2 minutes, checks the published tunnel address from the
# internet side and runs start.ps1 again (new tunnel + new gist address) when it is down.
# Quick tunnels can be dropped by Cloudflare at any time, so this is what keeps the chat online.
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$file = Join-Path $here 'logs\portfolio-ai-endpoint.json'
$log = Join-Path $here 'logs\keepalive.log'

function Test-Public {
  try {
    $url = (Get-Content $file -Raw | ConvertFrom-Json).url
    return (Invoke-RestMethod "$url/health" -TimeoutSec 15).ok -eq $true
  } catch { return $false }
}

while ($true) {
  if (-not (Test-Public)) {
    Add-Content $log "$(Get-Date -Format s) public endpoint down, restarting tunnel"
    & (Join-Path $here 'start.ps1') *>> $log
  }
  Start-Sleep -Seconds 120
}
