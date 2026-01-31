# GitHub Pages デプロイスクリプト
# lira-watch-public 用

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "lira-watch GitHub Pages デプロイ" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 元のlira-watchからデータファイルを同期
Write-Host "📋 Step 1: データファイルを同期中..." -ForegroundColor Yellow

$sourceDataDir = "..\lira-watch\public\data"
$destDataDir = ".\public\data"

if (Test-Path $sourceDataDir) {
    Copy-Item "$sourceDataDir\*" $destDataDir -Force -Recurse
    Write-Host "✅ データファイルを同期しました" -ForegroundColor Green
}
else {
    Write-Host "⚠️  警告: $sourceDataDir が見つかりません" -ForegroundColor Yellow
}

# providers_config.jsonも同期
$sourceConfig = "..\lira-watch\public\providers_config.json"
$destConfig = ".\public\providers_config.json"

if (Test-Path $sourceConfig) {
    Copy-Item $sourceConfig $destConfig -Force
    Write-Host "✅ providers_config.jsonを同期しました" -ForegroundColor Green
}

Write-Host ""

# ビルド
Write-Host "📦 Step 2: Next.jsアプリケーションをビルド中..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ビルドに失敗しました" -ForegroundColor Red
    exit 1
}

Write-Host "✅ ビルド完了" -ForegroundColor Green
Write-Host ""

# gh-pagesブランチにデプロイ
Write-Host "🚀 Step 3: GitHub Pagesにデプロイ中..." -ForegroundColor Yellow
npm run deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ デプロイに失敗しました" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ デプロイ完了!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "サイトURL: https://lira-watch.sbs/" -ForegroundColor White
Write-Host "(DNS設定変更後に有効になります)" -ForegroundColor Gray
Write-Host ""
