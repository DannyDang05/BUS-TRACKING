import { pool } from "../config/connectDB.js";
import bcrypt from 'bcryptjs';

// GET /api/v1/drivers
const getAllDrivers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, fullName, phone, email, licenseNumber, licenseClass, createdAt FROM Drivers');
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/drivers
const createNewDriver = async (req, res) => {
  const { fullName, phone, email, password, licenseNumber, licenseClass } = req.body;
  if (!fullName || !phone || !email || !password || !licenseNumber || !licenseClass) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin bắt buộc.' });
  }

  try {
    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO Drivers (fullName, phone, email, password, licenseNumber, licenseClass) VALUES (?, ?, ?, ?, ?, ?)',
      [fullName, phone, email, hashedPassword, licenseNumber, licenseClass]
    );

    return res.status(201).json({ errorCode: 0, message: 'Tạo tài xế mới thành công!', driverId: result.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 2, message: 'Email, SĐT hoặc Bằng lái đã tồn tại.' });
    }
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/drivers/:id
const getDriverDetail = async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await pool.query(
            'SELECT id, fullName, phone, email, licenseNumber, licenseClass FROM Drivers WHERE id = ?', [id]
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
const updateDriver = async (req, res) => {
  const id = req.params.id;
  const { fullName, phone, email, licenseNumber, licenseClass } = req.body;

  if (!fullName || !phone || !email || !licenseNumber || !licenseClass) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin bắt buộc.' });
  }
  
  try {
    // Lưu ý: Tạm thời chưa xử lý đổi mật khẩu ở đây
    const [result] = await pool.query(
      'UPDATE Drivers SET fullName = ?, phone = ?, email = ?, licenseNumber = ?, licenseClass = ? WHERE id = ?',
      [fullName, phone, email, licenseNumber, licenseClass, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy tài xế.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'Cập nhật tài xế thành công.' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 2, message: 'Email, SĐT hoặc Bằng lái bị trùng.' });
    }
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// DELETE /api/v1/drivers/:id
const deleteDriver = async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM Drivers WHERE id = ?', [id]);
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