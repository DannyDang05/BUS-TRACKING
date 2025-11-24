import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  // Ưu tiên lấy token từ header Authorization: Bearer <token>
  let token = null;
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  
  // Debug logging
  console.log('🔍 Auth Debug:');
  console.log('- Authorization Header:', authHeader);
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.jwt_token) {
    token = req.cookies.jwt_token;
  }

  console.log('- Extracted Token:', token ? `${token.substring(0, 20)}...` : 'NULL');
  console.log('- Token Length:', token ? token.length : 0);

  if (!token) {
    return res.status(401).json({
      errorCode: 401,
      message: 'Chưa xác thực. Vui lòng đăng nhập.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token Valid - User:', decoded.username, '| Role:', decoded.role);
    req.user = decoded; // Gắn thông tin người dùng (vd: { id: 1, email: 'admin@...' }) vào request
    next();
  } catch (e) {
    console.error('❌ JWT Verification Error:', e.message);
    if (e.name === 'TokenExpiredError') {
      console.error('- Token expired at:', new Date(e.expiredAt).toLocaleString());
    } else if (e.name === 'JsonWebTokenError') {
      console.error('- Invalid token signature or format');
    }
    console.error('- JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.error('- JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
    return res.status(401).json({
      errorCode: 401,
      message: 'Token không hợp lệ hoặc đã hết hạn.',
      error: e.message
    });
  }
};

export default verifyToken;