import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function checkAndInitSchema() {
  try {
    console.log('🌱 Đang kiểm tra trạng thái database...');

    // Lấy danh sách văn bản hiện tại
    const docsRes = await axios.get(`${API_BASE}/documents`);
    const documents = docsRes.data.data || [];

    // Nếu đã có dữ liệu thì không xóa, giữ nguyên DB
    if (documents.length > 0) {
      console.log(`✅ Đã có sẵn ${documents.length} văn bản trong Database. Bỏ qua việc tạo mới/xóa dữ liệu để giữ an toàn cho dữ liệu cũ.`);
      process.exit(0);
    }

    // Nếu chưa có dữ liệu, thực ra Mongoose đã tự động tạo collection trống.
    console.log('✅ Database hiện đang trống. Schema đã sẵn sàng để sử dụng!\n');
    process.exit(0);

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('✗ Lỗi: Không thể kết nối tới Backend. Hãy chắc chắn Server đang chạy tại http://localhost:5000');
    } else {
      console.error('✗ Lỗi kiểm tra dữ liệu:', error.response?.data || error.message);
    }
    process.exit(1);
  }
}

checkAndInitSchema();
