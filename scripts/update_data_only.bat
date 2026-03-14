@echo off
REM データのみを更新するスクリプト（ビルドなし）
REM 開発中にデータを更新したい場合に使用

cd /d "%~dp0\.."

echo ========================================
echo データ更新スクリプト（ビルドなし）
echo ========================================
echo 実行日時: %date% %time%
echo.

REM 1. union_data_managerでmaster_history_try.csvを更新
echo [1/2] master_history_try.csvを更新中...
cd guicatch
python union_data_manager.py
if errorlevel 1 (
    echo エラー: master_history_try.csvの更新に失敗しました
    pause
    exit /b 1
)
cd ..

REM 2. lira-watch/public/data/master_history_try.csvにコピー
echo.
echo [2/2] HP用データファイルを更新中...
copy /Y tryuniondata_try\master_history_try.csv lira-watch\public\data\master_history_try.csv
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




