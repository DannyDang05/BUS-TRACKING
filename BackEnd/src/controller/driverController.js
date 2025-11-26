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

export { getAllDrivers, createNewDriver, getDriverDetail, updateDriver, deleteDriver };