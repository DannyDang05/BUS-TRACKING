import { pool } from "../config/connectDB.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  // accept username or email for backward compatibility
  const username = req.body.username || req.body.Username || req.body.email || req.body.Email;
  const password = req.body.password || req.body.Password;

  if (!username || !password) {
    return res.status(400).json({ errorCode: 1, message: 'Username và mật khẩu là bắt buộc.' });
  }

  try {
    // 1. Tìm người dùng trong bảng `users`
    const [rows] = await pool.query('SELECT Id, Username, Password, Role, ProfileId FROM users WHERE Username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ errorCode: 2, message: 'Username không tồn tại.' });
    }
    const user = rows[0];

    // 2. Kiểm tra mật khẩu
    const dbPassword = user.Password || user.password;

    // Cho phép test: nếu password trùng plain text hoặc đúng hash đều cho qua
    let isMatch = false;
    if (password === dbPassword) {
      isMatch = true;
    } else {
      isMatch = await bcrypt.compare(password, dbPassword);
    }
    if (!isMatch) {
      return res.status(401).json({ errorCode: 3, message: 'Sai mật khẩu.' });
    }

    // 3. Tạo Token
    const payload = {
      id: user.Id,
      username: user.Username,
      role: user.Role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 4. (Optional) Gửi Token qua HttpOnly Cookie nếu muốn hỗ trợ cả cookie-based
    res.cookie('jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    });

    // 5. Trả token và user info về JSON để frontend lưu và sử dụng
    return res.status(200).json({
      errorCode: 0,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.Id,
        username: user.Username,
        role: user.Role,
        profileId: user.ProfileId
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