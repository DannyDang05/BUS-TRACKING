import { pool } from "../config/connectDB.js";
// Không cần import bcrypt nữa vì bảng `drivers` không lưu password

// GET /api/v1/drivers
// Lấy danh sách tài xế từ bảng `drivers`
const getAllDrivers = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const q = req.query.q ? String(req.query.q).trim() : null;
  const offset = (page - 1) * limit;

  try {
    let where = '';
    const params = [];
    if (q) {
      where = ' WHERE Id LIKE ? OR FullName LIKE ? OR MaBangLai LIKE ? OR PhoneNumber LIKE ? ';
      const like = `%${q}%`;
      params.push(like, like, like, like);
    }

    const countSql = `SELECT COUNT(*) as total FROM drivers ${where}`;
    const [countRows] = await pool.query(countSql, params);
    const totalItems = countRows[0].total || 0;

    const dataSql = `SELECT Id, FullName, MaBangLai, PhoneNumber, UserId, IsActive FROM drivers ${where} ORDER BY Id LIMIT ? OFFSET ?`;
    const dataParams = params.concat([limit, offset]);
    const [rows] = await pool.query(dataSql, dataParams);

    const totalPages = Math.ceil(totalItems / limit);
    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: rows,
      meta: { totalItems, totalPages, currentPage: page, pageSize: limit },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/drivers
// Tạo tài xế mới (CHƯA XỦ LÝ TẠO TÀI KHOẢN `users`)
const createNewDriver = async (req, res) => {
  // Lấy các trường từ DB mới
  const { Id, FullName, MaBangLai, PhoneNumber, IsActive } = req.body; 
  
  if (!Id || !FullName || !MaBangLai || !PhoneNumber) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (Id, Tên, Mã Bằng Lái, SĐT).' });
  }

  try {
    // Không mã hóa mật khẩu ở đây nữa
    const [result] = await pool.query(
      'INSERT INTO drivers (Id, FullName, MaBangLai, PhoneNumber, IsActive) VALUES (?, ?, ?, ?, ?)',
      [Id, FullName, MaBangLai, PhoneNumber, IsActive !== undefined ? IsActive : 1]
    );

    return res.status(201).json({ errorCode: 0, message: 'Tạo tài xế mới thành công!', driverId: Id });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 2, message: 'Id, Mã Bằng Lái đã tồn tại.' });
    }
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/drivers/:id
// Lấy chi tiết 1 tài xế
const getDriverDetail = async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await pool.query(
            'SELECT Id, FullName, MaBangLai, PhoneNumber, UserId, IsActive FROM drivers WHERE Id = ?', [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy tài xế.' });
        }
        return res.status(200).json({ errorCode: 0, message: 'OK', data: rows[0] });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
    }
};

// PUT /api/v1/drivers/:id
// Cập nhật thông tin tài xế
const updateDriver = async (req, res) => {
  const id = req.params.id;
  const { FullName, MaBangLai, PhoneNumber, IsActive } = req.body; // Bỏ `email`, `licenseClass`

  if (!FullName || !MaBangLai || !PhoneNumber) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin bắt buộc.' });
  }
  
  try {
    const [result] = await pool.query(
      'UPDATE drivers SET FullName = ?, MaBangLai = ?, PhoneNumber = ?, IsActive = ? WHERE Id = ?',
      [FullName, MaBangLai, PhoneNumber, IsActive, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy tài xế.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'Cập nhật tài xế thành công.' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 2, message: 'Mã Bằng Lái bị trùng.' });
    }
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// DELETE /api/v1/drivers/:id
// Xóa tài xế
const deleteDriver = async (req, res) => {
    const id = req.params.id;
    try {
        // Cân nhắc: Xóa tài xế có nên xóa/vô hiệu hóa `users` liên kết không?
        // Tạm thời chỉ xóa trong bảng `drivers`
        const [result] = await pool.query('DELETE FROM drivers WHERE Id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy tài xế.' });
        }
        return res.status(200).json({ errorCode: 0, message: 'Xóa tài xế thành công.' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
    }
};

// GET /api/v1/driver/notifications/:driverId
// Lấy thông báo cho tài xế
const getDriverNotifications = async (req, res) => {
  const driverId = req.params.driverId;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 20, 1);
  const offset = (page - 1) * limit;

  try {
    console.log('🔍 getDriverNotifications called with driverId:', driverId);
    
    // Lấy tất cả thông báo của tài xế từ bảng thongbao_taixe
    const sql = `
      SELECT 
        tb.Id as notification_id,
        tb.MaThongBao as code,
        tb.NoiDung as message,
        tb.LoaiThongBao as type,
        tb.ThoiGian as created_at,
        tb.DaDoc as is_read
      FROM thongbao_taixe tb
      WHERE tb.MaTaiXe = ?
      ORDER BY tb.ThoiGian DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(sql, [driverId, limit, offset]);
    console.log(`✅ Found ${rows.length} notifications for driver ${driverId}:`, rows);

    // Count total
    const [countRows] = await pool.query(
      'SELECT COUNT(*) as total FROM thongbao_taixe WHERE MaTaiXe = ?',
      [driverId]
    );
    const totalItems = countRows[0].total || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: rows,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (e) {
    console.error('❌ Error getting driver notifications:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/driver/notifications/:notificationId/mark-read
// Đánh dấu thông báo đã đọc
const markDriverNotificationRead = async (req, res) => {
  const notificationId = req.params.notificationId;

  try {
    const [result] = await pool.query(
      'UPDATE thongbao_taixe SET DaDoc = 1 WHERE Id = ?',
      [notificationId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy thông báo.' });
    }

    return res.status(200).json({ errorCode: 0, message: 'Đã đánh dấu đọc.' });
  } catch (e) {
    console.error('❌ Error marking driver notification read:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/driver/notifications/mark-all-read/:driverId
// Đánh dấu tất cả thông báo đã đọc
const markAllDriverNotificationsRead = async (req, res) => {
  const driverId = req.params.driverId;

  try {
    await pool.query(
      'UPDATE thongbao_taixe SET DaDoc = 1 WHERE MaTaiXe = ? AND DaDoc = 0',
      [driverId]
    );

    return res.status(200).json({ errorCode: 0, message: 'Đã đánh dấu tất cả đọc.' });
  } catch (e) {
    console.error('❌ Error marking all driver notifications read:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

export { 
  getAllDrivers, 
  createNewDriver, 
  getDriverDetail, 
  updateDriver, 
  deleteDriver,
  getDriverNotifications,
  markDriverNotificationRead,
  markAllDriverNotificationsRead
};