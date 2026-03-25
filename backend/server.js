require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình CORS động từ file .env
const allowedOrigins = [
  '*'
];
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const mongoURI = process.env.MONGO_URI;

// Kết nối DB sử dụng biến môi trường (có retry)
const connectWithRetry = async (retries = 5, delay = 3000) => {
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
        console.error('✗ Không thể kết nối MongoDB sau nhiều lần thử. Kiểm tra mạng/DNS.');
      }
    }
  }
};
connectWithRetry();

// Import controllers và routes
const progressController = require('./controller/progressController');

// Routes
// Document routes
app.post('/api/documents', progressController.createDocument);
app.get('/api/documents', progressController.getAllDocuments);
app.get('/api/documents/:id', progressController.getDocumentById);
app.put('/api/documents/:id', progressController.updateDocument);
app.delete('/api/documents/:id', progressController.deleteDocument);

// Section routes
app.post('/api/sections', progressController.createSection);
app.get('/api/sections/:documentId', progressController.getSectionsByDocument);
app.put('/api/sections/:id', progressController.updateSection);
app.delete('/api/sections/:id', progressController.deleteSection);

// Yearly Progress routes
app.post('/api/yearly-progress', progressController.createOrUpdateYearlyProgress);
app.get('/api/yearly-progress/:sectionId', progressController.getYearlyProgressBySection);
app.delete('/api/yearly-progress/:id', progressController.deleteYearlyProgress);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Có lỗi xảy ra', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server chạy trên port ${PORT}`);
});