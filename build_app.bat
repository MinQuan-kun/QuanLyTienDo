@echo off
chcp 65001 > nul
title TheoDoiTienDo - Build Tool

echo ========================================
echo   Bat dau qua trinh build ung dung
echo ========================================
echo.

:: 1. Build Frontend
echo [1/3] Dang build Frontend...
cd /d %~dp0frontend
call npm run build
if %errorlevel% neq 0 (
    echo [LOI] Build Frontend that bai!
    pause
    exit /b %errorlevel%
)

:: 2. Build Backend to EXE
echo.
echo [2/3] Dang build Backend va dong goi thanh EXE...
cd /d %~dp0backend
call npm run build:exe
if %errorlevel% neq 0 (
    echo [LOI] Build EXE that bai!
    pause
    exit /b %errorlevel%
)

:: 3. Hoan thanh
echo.
echo ========================================
echo   Build hoan tat!
echo   File EXE moi: TheoDoiTienDo.exe
echo ========================================
echo.
pause
