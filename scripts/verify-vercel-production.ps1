# Verify Vercel Production deployment for a given Git SHA (token from secrets repo).
param(
  [Parameter(Mandatory = $true)][string]$Sha,
  [string]$TokenFile = '',
  [string]$ProjectId = 'prj_glwmkGsIb8roOdVMEGC4QuDvWd3F',
  [int]$MaxWaitSeconds = 180,
  [int]$PollSeconds = 5
)
$ErrorActionPreference = 'Stop'
if (-not $TokenFile) {
  $scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
  $TokenFile = (Resolve-Path (Join-Path $scriptDir '..\..\lira-watch-secrets\.env.vercel')).Path
}
$token = (Get-Content -LiteralPath $TokenFile -Raw).Trim()
$headers = @{ Authorization = "Bearer $token"; Accept = 'application/json' }
$deadline = (Get-Date).AddSeconds($MaxWaitSeconds)
while ((Get-Date) -lt $deadline) {
  $uri = "https://api.vercel.com/v6/deployments?projectId=$ProjectId&sha=$Sha&limit=10"
  $resp = Invoke-RestMethod -Method Get -Uri $uri -Headers $headers
  $list = @($resp.deployments)
  $prodReady = $list | Where-Object { $_.target -eq 'production' -and $_.readyState -eq 'READY' } | Select-Object -First 1
  if ($prodReady) {
    Write-Host "[OK] Production READY uid=$($prodReady.uid) url=$($prodReady.url)"
    exit 0
  }
  $states = ($list | ForEach-Object { "$($_.readyState)/$($_.target)" }) -join ', '
  Write-Host "[wait] $(Get-Date -Format 'HH:mm:ss') deployments: $states"
  Start-Sleep -Seconds $PollSeconds
}
Write-Host "[NG] timeout waiting for Production READY for sha=$Sha"
exit 1
