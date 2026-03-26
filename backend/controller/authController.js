const User = require('../model/User');
const jwt = require('jsonwebtoken');

// Tạo token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Kiểm tra user đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    const newUser = await User.create({
      username,
      password
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          role: newUser.role
        }
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Kiểm tra username và password có được gửi lên không
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
    }

    // 2. Kiểm tra user tồn tại và password đúng
    const user = await User.findOne({ username });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    // 3. Nếu mọi thứ OK, gửi token về client
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
