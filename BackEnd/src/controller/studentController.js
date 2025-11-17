import { pool } from "../config/connectDB.js";

// GET /api/v1/students
// Lấy danh sách học sinh từ bảng `hocsinh`
const getAllStudents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT MaHocSinh, HoTen, Lop, TinhTrang, MaPhuHuynh, MaDiemDon FROM hocsinh');
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/students
// Tạo học sinh mới trong bảng `hocsinh`
const createStudent = async (req, res) => {
  // Lấy các trường từ DB mới
  const { MaHocSinh, HoTen, Lop, MaPhuHuynh, MaDiemDon } = req.body;
  
  if (!MaHocSinh || !HoTen || !Lop) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (Mã HS, Tên, Lớp).' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO hocsinh (MaHocSinh, HoTen, Lop, MaPhuHuynh, MaDiemDon) VALUES (?, ?, ?, ?, ?)',
      [MaHocSinh, HoTen, Lop, MaPhuHuynh, MaDiemDon]
    );
    // TinhTrang sẽ dùng giá trị DEFAULT 'Chưa đón'
    return res.status(201).json({ errorCode: 0, message: 'Tạo học sinh mới thành công!', studentId: MaHocSinh });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 2, message: 'Mã học sinh đã tồn tại.' });
    }
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// PUT /api/v1/students/:id
// Cập nhật học sinh. Lưu ý: route đang dùng /:id, nên chúng ta sẽ dùng req.params.id làm MaHocSinh
const updateStudent = async (req, res) => {
  const maHocSinh = req.params.id;
  const { HoTen, Lop, TinhTrang, MaPhuHuynh, MaDiemDon } = req.body;
  
  if (!HoTen || !Lop) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (Tên, Lớp).' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE hocsinh SET HoTen = ?, Lop = ?, TinhTrang = ?, MaPhuHuynh = ?, MaDiemDon = ? WHERE MaHocSinh = ?',
      [HoTen, Lop, TinhTrang, MaPhuHuynh, MaDiemDon, maHocSinh]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy học sinh.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'Cập nhật học sinh thành công.' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// DELETE /api/v1/students/:id
// Xóa học sinh
const deleteStudent = async (req, res) => {
  const maHocSinh = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM hocsinh WHERE MaHocSinh = ?', [maHocSinh]);
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