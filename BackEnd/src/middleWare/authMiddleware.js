import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  // Ưu tiên lấy token từ header Authorization: Bearer <token>
  let token = null;
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.jwt_token) {
    token = req.cookies.jwt_token;
  }

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