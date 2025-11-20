// Middleware kiểm tra quyền truy cập theo role
const requireRole = (role) => (req, res, next) => {
  if (!req.user || (req.user.role !== role && req.user.Role !== role)) {
    return res.status(403).json({
      errorCode: 403,
      message: 'Bạn không có quyền truy cập.'
    });
  }
  next();
};

export default requireRole;
