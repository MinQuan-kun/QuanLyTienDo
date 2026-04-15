// Xử lý nạp biến môi trường cho cả môi trường dev và container/pkg
const fs = require('fs');
const path = require('path');

// Đường dẫn tìm kiếm file .env: CWD, backend/.env, và cạnh file thực thi (nếu là pkg)
const envPaths = [
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), 'backend', '.env')
];

if (process.pkg) {
  // Nếu đang chạy trong file EXE (pkg), ưu tiên file .env nằm cùng thư mục với file .exe
  envPaths.unshift(path.join(path.dirname(process.execPath), '.env'));
}

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`✓ Đã nạp cấu hình từ: ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log('ℹ Không tìm thấy file .env, sử dụng các biến môi trường hệ thống (nếu có).');
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình CORS động từ file .env
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('✗ LỖI NGHIÊM TRỌNG: MONGO_URI không được định nghĩa trong file .env!');
  console.error('  Ứng dụng có thể không hoạt động chính xác.');
}

// Kết nối DB sử dụng biến môi trường (có retry)
const connectWithRetry = async (retries = 5, delay = 3000) => {
  if (!mongoURI) return;
  
  console.log('🌱 Đang kết nối tới Database...');
  for (let i = 1; i <= retries; i++) {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      console.log('✓ Kết nối MongoDB thành công');
      return;
    } catch (err) {
      console.error(`✗ Lần ${i}/${retries} - Lỗi kết nối MongoDB:`, err.message);
      if (i < retries) {
        console.log(`  ⏳ Thử lại sau ${delay / 1000} giây...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('✗ Không thể kết nối MongoDB sau nhiều lần thử. Kiểm tra MONGO_URI trong .env hoặc kết nối mạng.');
      }
    }
  }
};
connectWithRetry();

// Import controllers và routes
const progressController = require('./controller/progressController');
const authController = require('./controller/authController');
const { protect, adminOnly } = require('./middleware/authMiddleware');
const vanBanController = require('./controller/vanBanController');
const { uploadMiddleware } = vanBanController;

// Routes
// Authentication routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Project routes
app.post('/api/projects', protect, progressController.createProject);
app.get('/api/projects', progressController.getAllProjects);
app.put('/api/projects/:id', protect, progressController.updateProject);
app.delete('/api/projects/:id', protect, adminOnly, progressController.deleteProject);

// Document routes
app.post('/api/documents', protect, uploadMiddleware, progressController.createDocument);
app.get('/api/documents', progressController.getAllDocuments);
app.get('/api/documents/:id', progressController.getDocumentById);
app.put('/api/documents/:id', protect, uploadMiddleware, progressController.updateDocument);
app.delete('/api/documents/:id', protect, adminOnly, progressController.deleteDocument);

// Section routes
app.post('/api/sections', protect, uploadMiddleware, progressController.createSection);
app.get('/api/sections/:documentId', progressController.getSectionsByDocument);
app.put('/api/sections/:id', protect, uploadMiddleware, progressController.updateSection);
app.delete('/api/sections/:id', protect, adminOnly, progressController.deleteSection);

// Yearly Progress routes
app.post('/api/yearly-progress', protect, progressController.createOrUpdateYearlyProgress);
app.get('/api/yearly-progress/:sectionId', progressController.getYearlyProgressBySection);
app.delete('/api/yearly-progress/:id', protect, adminOnly, progressController.deleteYearlyProgress);

// Văn bản routes
app.get('/api/van-ban', vanBanController.getAll);
app.get('/api/van-ban/:id/download', vanBanController.download);
app.get('/api/van-ban/:id', vanBanController.getById);
app.post('/api/van-ban', protect, uploadMiddleware, vanBanController.create);
app.put('/api/van-ban/:id', protect, uploadMiddleware, vanBanController.update);
app.delete('/api/van-ban/:id', protect, adminOnly, vanBanController.remove);

// User Management routes (Admin only)
const userController = require('./controller/userController');
app.get('/api/users', protect, adminOnly, userController.getAllUsers);
app.post('/api/users', protect, adminOnly, userController.createUser);
app.delete('/api/users/:id', protect, adminOnly, userController.deleteUser);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

// Phục vụ các file tĩnh từ thư mục build của frontend
// Trong pkg, __dirname là /snapshot/QuanLyTienDo/backend
// Ta cần frontend/dist nằm cùng cấp với backend folder trong project root
let frontendPath = path.join(__dirname, '../frontend/dist');

// Kiểm tra xem có đang chạy trong pkg không để điều chỉnh đường dẫn
if (!fs.existsSync(frontendPath)) {
  // Thử đường dẫn khác nếu cần (ví dụ khi chạy trực tiếp từ backend folder)
  frontendPath = path.join(__dirname, 'dist');
}

if (fs.existsSync(frontendPath)) {
  console.log(`✓ Đang phục vụ frontend tại: ${frontendPath}`);
  app.use(express.static(frontendPath));
  
  app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'API route không tồn tại' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.log('ℹ Chế độ API độc lập: Không tìm thấy frontend/dist');
  app.get('/', (req, res) => {
    res.json({ message: 'TheoDoiTienDo API is running...', mode: 'Standalone' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Có lỗi xảy ra', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Ứng dụng khởi động tại: http://localhost:${PORT}`);
});