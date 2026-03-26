const jwt = require('jsonwebtoken');
const User = require('../model/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Kiểm tra nếu có token trong header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập.'
      });
    }

    // 2. Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');

    // 3. Kiểm tra user còn tồn tại hay không
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        message: 'Tài khoản không còn tồn tại trên hệ thống.'
      });
    }

    // 4. Lưu thông tin user vào request để sử dụng ở các middleware/controller sau
    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token không hợp lệ. Vui lòng đăng nhập lại.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token đã hết hạn. Vui lòng đăng nhập lại.' });
    }
    res.status(500).json({ message: 'Lỗi xác thực', error: err.message });
  }
};

module.exports = { protect };
