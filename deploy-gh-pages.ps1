# GitHub Pages deploy script
# for lira-watch-public

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "lira-watch GitHub Pages Deploy" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Sync data files from original lira-watch
Write-Host "[Step 1] Syncing data files..." -ForegroundColor Yellow

$sourceDataDir = "..\lira-watch\public\data"
$destDataDir = ".\public\data"

if (Test-Path $sourceDataDir) {
    Copy-Item "$sourceDataDir\*" $destDataDir -Force -Recurse
    Write-Host "[OK] Data files synced" -ForegroundColor Green
}
else {
    Write-Host "[WARN] $sourceDataDir not found" -ForegroundColor Yellow
}

# Sync providers_config.json
$sourceConfig = "..\lira-watch\public\providers_config.json"
$destConfig = ".\public\providers_config.json"

if (Test-Path $sourceConfig) {
    Copy-Item $sourceConfig $destConfig -Force
    Write-Host "[OK] providers_config.json synced" -ForegroundColor Green
}

Write-Host ""

# Build
Write-Host "[Step 2] Building Next.js application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Build complete" -ForegroundColor Green
Write-Host ""

# Deploy to gh-pages branch
Write-Host "[Step 3] Deploying to GitHub Pages..." -ForegroundColor Yellow
npm run deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Deploy failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "[OK] Deploy complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Site URL: https://lira-watch.sbs/" -ForegroundColor White
Write-Host "(Active after DNS settings are applied)" -ForegroundColor Gray
Write-Host ""
