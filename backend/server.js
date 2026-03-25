require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình CORS động từ file .env
app.use(cors({
  origin: '*'
}));

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// Kết nối DB sử dụng biến môi trường
mongoose.connect(mongoURI)
  .then(() => console.log('✓ Kết nối MongoDB thành công'))
  .catch(err => console.error('✗ Lỗi kết nối MongoDB:', err));

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