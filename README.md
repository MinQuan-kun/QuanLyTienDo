# Theo Dõi Tiến Độ Văn Kiện

Một ứng dụng web để theo dõi tiến độ thực hiện các chỉ tiêu của các văn kiện, dự án hoặc kế hoạch trong nhiều năm.

## 🎯 Tính Năng

### 1. **Quản Lý Văn Kiện**
- ➕ Thêm văn kiện mới
- 📝 Chỉnh sửa thông tin văn kiện
- 🗑️ Xóa văn kiện
- 🔍 Tìm kiếm theo tên
- 🏷️ Lọc theo thể loại (Kinh tế, Xã hội, Môi trường, Giáo dục, Y tế, Khác)
- 📅 Thiết lập thời gian bắt đầu và kết thúc (mặc định 5 năm)

### 2. **Quản Lý Chỉ Tiêu (Mục)**
- ➕ Thêm chỉ tiêu mới cho mỗi văn kiện
- 📊 Đặt giá trị mục tiêu cho mỗi chỉ tiêu
- 🎯 Tùy chỉnh đơn vị (%, tấn, triệu đồng, v.v.)
- ✏️ Chỉnh sửa chỉ tiêu
- 🗑️ Xóa chỉ tiêu

### 3. **Nhập Dữ Liệu Hàng Năm**
- 📥 Nhập giá trị thực tế cho mỗi năm
- 📝 Thêm ghi chú cho từng năm
- 💾 Tự động lưu dữ liệu
- 🔄 Chỉnh sửa dữ liệu năm trước đó

### 4. **Biểu Đồ & Trực Quan Hóa**
- 📊 Biểu đồ so sánh cột (So sánh giá trị thực tế vs mục tiêu)
- 📈 Biểu đồ đường (Xu hướng theo thời gian)
- 🎨 Giao diện trực quan, dễ sử dụng

### 5. **Giao Diện Người Dùng**
- 📋 Header: Logo, tìm kiếm, lọc thể loại
- 📌 Left Panel: Danh sách các văn kiện
- 🎯 Right Panel: Danh sách các chỉ tiêu
- 📊 Center Panel: Biểu đồ và form nhập dữ liệu

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- Node.js (v14 hoặc cao hơn)
- MongoDB (hoặc sử dụng MongoDB Atlas - đã cấu hình)
- npm hoặc yarn

### 1. Cài Đặt Backend

```bash
cd backend
npm install
```

### 2. Cài Đặt Frontend

```bash
cd frontend
npm install
```

### 3. Chạy Ứng Dụng

**Terminal 1 - Chạy Backend:**
```bash
cd backend
npm start
# Hoặc nếu không có script start
node server.js
```

Backend sẽ chạy trên: `http://localhost:5000`

**Terminal 2 - Chạy Frontend:**
```bash
cd frontend
npm run dev
```

Frontend sẽ chạy trên: `http://localhost:5173`

Mở trình duyệt và truy cập: `http://localhost:5173`

## 📁 Cấu Trúc Dự Án

```
backend/
├── controller/
│   └── progressController.js      # Xử lý các chức năng chính
├── model/
│   ├── Document.js                # Model văn kiện
│   ├── Section.js                 # Model chỉ tiêu/mục
│   └── YearlyProgress.js          # Model dữ liệu hàng năm
├── server.js                      # Server chính
├── package.json
└── .env                          # Cấu hình môi trường

frontend/
├── src/
│   ├── api/
│   │   └── api.js                # API calls
│   ├── hooks/
│   │   └── useApi.js             # Custom hooks
│   ├── components/
│   │   ├── Header.jsx            # Header component
│   │   ├── Sidebar.jsx           # Sidebar with sections
│   │   ├── ProgressChart.jsx     # Chart component
│   │   ├── DataInputForm.jsx     # Form nhập dữ liệu
│   │   ├── DocumentModal.jsx     # Modal thêm/sửa văn kiện
│   │   ├── SectionModal.jsx      # Modal thêm/sửa chỉ tiêu
│   │   ├── ProgressTracker.jsx   # Main component
│   │   └── *.css                 # Styling
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── package.json
```

## 🔌 API Endpoints

### Documents (Văn Kiện)
- `POST /api/documents` - Tạo văn kiện mới
- `GET /api/documents` - Lấy tất cả văn kiện (hỗ trợ lọc)
- `GET /api/documents/:id` - Lấy chi tiết văn kiện
- `PUT /api/documents/:id` - Cập nhật văn kiện
- `DELETE /api/documents/:id` - Xóa văn kiện

### Sections (Chỉ Tiêu)
- `POST /api/sections` - Tạo chỉ tiêu mới
- `GET /api/sections/:documentId` - Lấy chỉ tiêu theo văn kiện
- `PUT /api/sections/:id` - Cập nhật chỉ tiêu
- `DELETE /api/sections/:id` - Xóa chỉ tiêu

### Yearly Progress (Dữ Liệu Hàng Năm)
- `POST /api/yearly-progress` - Tạo/cập nhật dữ liệu năm
- `GET /api/yearly-progress/:sectionId` - Lấy dữ liệu theo chỉ tiêu
- `DELETE /api/yearly-progress/:id` - Xóa dữ liệu năm

## 💾 Database Schema

### Document
```javascript
{
  name: String,                    // Tên văn kiện
  description: String,             // Mô tả
  category: String,                // Thể loại
  startDate: Date,                 // Ngày bắt đầu
  endDate: Date,                   // Ngày kết thúc
  sections: [ObjectId],            // Danh sách chỉ tiêu
  createdAt: Date,
  updatedAt: Date
}
```

### Section
```javascript
{
  name: String,                    // Tên chỉ tiêu
  description: String,             // Mô tả
  targetValue: Number,             // Giá trị mục tiêu
  unit: String,                    // Đơn vị (%,...)
  document: ObjectId,              // Tham chiếu văn kiện
  yearlyData: [ObjectId],          // Dữ liệu hàng năm
  createdAt: Date,
  updatedAt: Date
}
```

### YearlyProgress
```javascript
{
  section: ObjectId,               // Tham chiếu chỉ tiêu
  year: Number,                    // Năm
  actualValue: Number,             // Giá trị thực tế
  note: String,                    // Ghi chú
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Công Nghệ Sử Dụng

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Recharts** - Charting library
- **Axios** - HTTP client
- **Lucide React** - Icons
- **CSS** - Styling

## 🔐 Môi Trường

Tạo file `.env` trong thư mục `backend/`:
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
FRONTEND_URL=http://localhost:5173
```

## 📸 Hướng Dẫn Sử Dụng

### 1. Thêm Văn Kiện Mới
- Nhấp vào **"+ Thêm Văn Kiện"**
- Điền thông tin: Tên, Mô tả, Thể loại, Ngày bắt đầu, Ngày kết thúc
- Nhấp **Lưu**

### 2. Thêm Chỉ Tiêu
- Chọn một văn kiện
- Nhấp **"+ Thêm Mục"** ở sidebar bên phải
- Điền: Tên mục, Mô tả, Giá trị mục tiêu, Đơn vị
- Nhấp **Lưu**

### 3. Nhập Dữ Liệu Hàng Năm
- Chọn một chỉ tiêu từ sidebar
- Tại bảng dữ liệu phía dưới, nhấp **Sửa** cho năm muốn nhập
- Nhập giá trị thực tế và ghi chú
- Nhấp **Lưu** để lưu dữ liệu

### 4. Xem Biểu Đồ
- Biểu đồ sẽ tự động cập nhật khi nhập dữ liệu
- Biểu đồ cột so sánh giá trị thực tế với mục tiêu
- Biểu đồ đường hiển thị xu hướng

## 🐛 Khắc Phục Sự Cố

### Backend không kết nối được MongoDB
- Kiểm tra kết nối internet
- Kiểm tra MONGO_URI trong .env
- Đảm bảo IP whitelist trong MongoDB Atlas

### Frontend không kết nối backend
- Kiểm tra backend chạy trên port 5000
- Kiểm tra CORS configuration
- Kiểm tra FRONTEND_URL trong backend .env

### Lỗi port đã trong sử dụng
```bash
# Kiểm tra process sử dụng port
lsof -i :5000    # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>    # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

## 📝 Ghi Chú

- Dữ liệu được lưu trữ trên MongoDB
- Không cần đăng nhập
- Tất cả dữ liệu được chia sẻ trong cơ sở dữ liệu
- Hỗ trợ nhiều chỉ tiêu cho một văn kiện
- Hỗ trợ dữ liệu cho từng năm

## 📧 Hỗ Trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Backend logs (terminal chạy server)
2. Browser console (F12 -> Console)
3. Network tab (F12 -> Network)

---

**Tạo bởi:** Development Team
**Ngày:** 2026

---

## ☁️ Triển Khai (Deployment)

### 1. Triển Khai lên Render (Blueprint)
Dự án đã được cấu hình sẵn để triển khai lên [Render](https://render.com) thông qua file `render.yaml`. Công cụ này sẽ tự động tạo 2 dịch vụ:
- **Backend (Web Service):** `https://quanlytiendo-api.onrender.com`
- **Frontend (Static Site):** `https://quanlytiendo-frontend.onrender.com`

**Các bước thực hiện:**
1. Connect GitHub repository của bạn với Render.
2. Chọn **Blueprint** từ menu của Render.
3. Render sẽ nhận diện file `render.yaml` và liệt kê các dịch vụ.
4. Nhập các biến môi trường (Environment Variables) còn thiếu trong Dashboard (đặc biệt là `MONGO_URI` và các thông tin Google Drive).

### 2. Biến Môi Trường (Environment Variables)
| Service | Key | Mô tả |
| :--- | :--- | :--- |
| **Backend** | `MONGO_URI` | Địa chỉ kết nối MongoDB Atlas |
| | `FRONTEND_URL` | URL của frontend (để cấu hình CORS) |
| | `GOOGLE_*` | Các thông tin tích hợp Google Drive |
| **Frontend** | `VITE_API_URL` | URL của backend api (kết thúc bằng `/api`) |

---

## 📦 Đóng gói Standalone EXE

Dự án có khả năng đóng gói thành một file `.exe` duy nhất để chạy trên Windows mà không cần cài đặt Node.js.

### 1. Build tự động
Chạy file script sau ở thư mục gốc:
```bash
build_app.bat
```
Script này sẽ tự động:
- Build frontend và nén vào thư mục `dist`.
- Sử dụng `pkg` để đóng gói backend + frontend thành `TheoDoiTienDo.exe`.

### 2. Chạy ứng dụng
Sau khi build xong, bạn chỉ cần chạy:
- `TheoDoiTienDo.exe` hoặc `start_app.bat`.
- Ứng dụng sẽ chạy tại: `http://localhost:5000`

