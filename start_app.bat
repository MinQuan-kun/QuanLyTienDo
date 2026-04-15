@echo off
chcp 65001 > nul
title TheoDoiTienDo - Launcher

echo ========================================
echo   Đang khởi động TheoDoiTienDo
echo ========================================
echo.

if not exist "TheoDoiTienDo.exe" (
    echo [LỖI] Không tìm thấy file TheoDoiTienDo.exe. 
    echo Vui lòng chạy build_app.bat trước.
    pause
    exit /b 1
)

:: Kiểm tra file .env
if not exist ".env" (
    if exist "backend\.env" (
        echo [INFO] Đang sao chép file .env từ thư mục backend...
        copy "backend\.env" ".env" > nul
    ) else (
        echo [CẢNH BÁO] Không tìm thấy file .env. 
        echo Hệ thống có thể không kết nối được Database.
    )
)

echo [1/1] Đang chạy ứng dụng...
echo.
echo ========================================
echo   Ứng dụng đang được khởi tạo...
echo   Vui lòng chờ giây lát.
echo ========================================
echo.

:: Khởi động ứng dụng (Single process)
start "" "TheoDoiTienDo.exe"

timeout /t 3 > nul

echo.
echo ➜ Ứng dụng đã sẵn sàng tại: http://localhost:5000
echo.
echo Lưu ý: Giữ cửa sổ này để xem log hoặc nhấn Ctrl+C để dừng.
echo.

exit
