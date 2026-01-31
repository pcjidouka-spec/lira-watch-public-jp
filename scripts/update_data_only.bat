@echo off
REM データのみを更新するスクリプト（ビルドなし）
REM 開発中にデータを更新したい場合に使用

cd /d "%~dp0\.."

echo ========================================
echo データ更新スクリプト（ビルドなし）
echo ========================================
echo 実行日時: %date% %time%
echo.

REM 1. union_data_managerでmaster_history.csvを更新
echo [1/2] master_history.csvを更新中...
cd guicatch
python union_data_manager.py
if errorlevel 1 (
    echo エラー: master_history.csvの更新に失敗しました
    pause
    exit /b 1
)
cd ..

REM 2. lira-watch/public/data/master_history.csvにコピー
echo.
echo [2/2] HP用データファイルを更新中...
copy /Y tryuniondata\master_history.csv lira-watch\public\data\master_history.csv
if errorlevel 1 (
    echo エラー: データファイルのコピーに失敗しました
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ データ更新が完了しました！
echo ========================================
echo.
echo 開発サーバーをリロードすると、新しいデータが反映されます。
echo.
pause




