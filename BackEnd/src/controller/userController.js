import { pool } from "../config/connectDB.js";
import bcrypt from 'bcryptjs';

// GET /api/v1/users
// Lấy danh sách tài khoản
const getAllUsers = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const q = req.query.q ? String(req.query.q).trim() : null;
  const offset = (page - 1) * limit;

  try {
    let where = '';
    const params = [];
    if (q) {
      where = ' WHERE Username LIKE ? OR Role LIKE ? OR ProfileId LIKE ? ';
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    const countSql = `SELECT COUNT(*) as total FROM users ${where}`;
    const [countRows] = await pool.query(countSql, params);
    const totalItems = countRows[0].total || 0;

    const dataSql = `SELECT Id, Username, Role, ProfileId FROM users ${where} ORDER BY Id DESC LIMIT ? OFFSET ?`;
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
    console.error('Error getting users:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/users
// Tạo tài khoản mới
const createUser = async (req, res) => {
  const { username, password, role, profileId } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (username, password, role).' });
  }

  // Validate role
  const validRoles = ['admin', 'driver', 'parent'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ errorCode: 2, message: 'Role không hợp lệ. Chỉ chấp nhận: admin, driver, parent' });
  }

  try {
    // Check username đã tồn tại chưa
    const [existing] = await pool.query('SELECT Id FROM users WHERE Username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ errorCode: 3, message: 'Username đã tồn tại.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (Username, Password, Role, ProfileId) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, role, profileId || null]
    );

    return res.status(201).json({
      errorCode: 0,
      message: 'Tạo tài khoản thành công!',
      userId: result.insertId
    });
  } catch (e) {
    console.error('Error creating user:', e);
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 3, message: 'Username đã tồn tại.' });
    }
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/users/:id
// Lấy chi tiết 1 tài khoản
const getUserDetail = async (req, res) => {
  const id = req.params.id;
  
  try {
    const [rows] = await pool.query(
      'SELECT Id, Username, Role, ProfileId FROM users WHERE Id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ errorCode: 4, message: 'Không tìm thấy tài khoản.' });
    }
    
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows[0] });
  } catch (e) {
    console.error('Error getting user detail:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// PUT /api/v1/users/:id
// Cập nhật tài khoản
const updateUser = async (req, res) => {
  const id = req.params.id;
  const { username, password, role, profileId } = req.body;

  if (!username || !role) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin bắt buộc (username, role).' });
  }

  // Validate role
  const validRoles = ['admin', 'driver', 'parent'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ errorCode: 2, message: 'Role không hợp lệ. Chỉ chấp nhận: admin, driver, parent' });
  }

  try {
    // Check username trùng với user khác
    const [existing] = await pool.query('SELECT Id FROM users WHERE Username = ? AND Id != ?', [username, id]);
    if (existing.length > 0) {
      return res.status(409).json({ errorCode: 3, message: 'Username đã tồn tại.' });
    }

    // Nếu có password mới thì hash
    let updateQuery = 'UPDATE users SET Username = ?, Role = ?, ProfileId = ? WHERE Id = ?';
    let params = [username, role, profileId || null, id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery = 'UPDATE users SET Username = ?, Password = ?, Role = ?, ProfileId = ? WHERE Id = ?';
      params = [username, hashedPassword, role, profileId || null, id];
    }

    const [result] = await pool.query(updateQuery, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 4, message: 'Không tìm thấy tài khoản.' });
    }

    return res.status(200).json({ errorCode: 0, message: 'Cập nhật tài khoản thành công.' });
  } catch (e) {
    console.error('Error updating user:', e);
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 3, message: 'Username đã tồn tại.' });
    }
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// DELETE /api/v1/users/:id
// Xóa tài khoản
const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE Id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 4, message: 'Không tìm thấy tài khoản.' });
    }

    return res.status(200).json({ errorCode: 0, message: 'Xóa tài khoản thành công.' });
  } catch (e) {
    console.error('Error deleting user:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

export {
  getAllUsers,
  createUser,
  getUserDetail,
  updateUser,
  deleteUser
};
