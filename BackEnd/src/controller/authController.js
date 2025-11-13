import { pool } from "../config/connectDB.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ errorCode: 1, message: 'Email và mật khẩu là bắt buộc.' });
  }

  try {
    // 1. Tìm người dùng
    const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ errorCode: 2, message: 'Email không tồn tại.' });
    }
    const user = rows[0];

    // 2. Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ errorCode: 3, message: 'Sai mật khẩu.' });
    }

    // 3. Tạo Token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 4. Gửi Token qua HttpOnly Cookie (Bảo mật)
    res.cookie('jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS ở môi trường production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    });

    return res.status(200).json({
      errorCode: 0,
      message: 'Đăng nhập thành công!',
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

const checkSession = (req, res) => {
    // Middleware verifyToken đã chạy trước đó và gắn req.user
    return res.status(200).json({
        errorCode: 0,
        message: 'Phiên đăng nhập hợp lệ.',
        data: req.user // Trả về thông tin user
    });
};

const logout = (req, res) => {
    // Xóa cookie
    res.cookie('jwt_token', '', {
        httpOnly: true,
        expires: new Date(0) // Hết hạn ngay lập tức
    });
    return res.status(200).json({
        errorCode: 0,
        message: 'Đăng xuất thành công.'
    });
};

export { login, checkSession, logout };