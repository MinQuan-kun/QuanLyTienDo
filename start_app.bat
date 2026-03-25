@echo off
chcp 65001 > nul

echo Đang khởi động tất cả trong một cửa sổ...

start /B cmd /c "cd backend && node server.js"
start /B cmd /c "cd frontend && npm run dev"

echo Đang chờ Backend khởi động để kiểm tra CSDL (chờ 5 giây)...
timeout /t 5 /nobreak > nul

echo Đang kiểm tra Database...
cd frontend
node seed.js

echo.
echo Hoàn thành! Cả hai server đang chạy ngầm trong chính cửa sổ này.
echo Nhấn Ctrl+C để dừng tất cả, hoặc đóng cửa sổ này.
echo Để cửa sổ không tắt, vui lòng không bấm phím bất kỳ ở đây.
pause > nul
