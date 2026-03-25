@echo off
chcp 65001 > nul
title TheoDoiTienDo - Launcher

echo ========================================
echo   Khoi dong ung dung TheoDoiTienDo
echo ========================================
echo.

:: Khởi động Backend trong cửa sổ riêng
echo [1/3] Dang khoi dong Backend...
start "TheoDoiTienDo - Backend" cmd /k "cd /d %~dp0backend && node server.js"

:: Khởi động Frontend trong cửa sổ riêng
echo [2/3] Dang khoi dong Frontend...
start "TheoDoiTienDo - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

:: Chờ backend kết nối MongoDB (đủ thời gian cho retry)
echo [3/3] Dang cho Backend ket noi Database (15 giay)...
timeout /t 15 /nobreak > nul

:: Kiểm tra database
echo Dang kiem tra Database...
cd /d %~dp0frontend
node seed.js

echo.
echo ========================================
echo   Hoan thanh! Ca hai server dang chay.
echo ========================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo.
echo Luu y: Ban co the nhan Ctrl+C hoac tat
echo cua so nay de dung ca hai Server.
echo ========================================
pause > nul
