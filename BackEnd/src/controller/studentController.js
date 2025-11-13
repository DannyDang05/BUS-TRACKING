import { pool } from "../config/connectDB.js";

// GET /api/v1/students
const getAllStudents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, fullName, studentId, class, address, createdAt FROM Students');
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/students
const createStudent = async (req, res) => {
  const { fullName, studentId, class: studentClass, address } = req.body;
  
  if (!fullName || !studentId || !studentClass) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (Tên, Mã HS, Lớp).' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO Students (fullName, studentId, class, address) VALUES (?, ?, ?, ?)',
      [fullName, studentId, studentClass, address]
    );
    return res.status(201).json({ errorCode: 0, message: 'Tạo học sinh mới thành công!', studentDbId: result.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 2, message: 'Mã học sinh đã tồn tại.' });
    }
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// PUT /api/v1/students/:id
const updateStudent = async (req, res) => {
  const id = req.params.id;
  const { fullName, studentId, class: studentClass, address } = req.body;
  
  if (!fullName || !studentId || !studentClass) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (Tên, Mã HS, Lớp).' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE Students SET fullName = ?, studentId = ?, class = ?, address = ? WHERE id = ?',
      [fullName, studentId, studentClass, address, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy học sinh.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'Cập nhật học sinh thành công.' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 2, message: 'Mã học sinh bị trùng.' });
    }
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// DELETE /api/v1/students/:id
const deleteStudent = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM Students WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy học sinh.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'Xóa học sinh thành công.' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

export { getAllStudents, createStudent, updateStudent, deleteStudent };