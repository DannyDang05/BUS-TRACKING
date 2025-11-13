import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt_token; // Đọc token từ HttpOnly Cookie

  if (!token) {
    return res.status(401).json({
      errorCode: 401,
      message: 'Chưa xác thực. Vui lòng đăng nhập.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gắn thông tin người dùng (vd: { id: 1, email: 'admin@...' }) vào request
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({
      errorCode: 401,
      message: 'Token không hợp lệ hoặc đã hết hạn.'
    });
  }
};

export default verifyToken;