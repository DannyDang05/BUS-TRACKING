import { pool } from "../config/connectDB.js";

// GET /api/v1/students
// Lấy danh sách học sinh từ bảng `hocsinh`
const getAllStudents = async (req, res) => {
  // Pagination params: page (1-based), limit, optional search q
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const q = req.query.q ? String(req.query.q).trim() : null;
  const offset = (page - 1) * limit;

  try {
    let where = '';
    const params = [];
    if (q) {
      where = ' WHERE MaHocSinh LIKE ? OR HoTen LIKE ? OR Lop LIKE ? ';
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    // total count
    const countSql = `SELECT COUNT(*) as total FROM hocsinh ${where}`;
    const [countRows] = await pool.query(countSql, params);
    const totalItems = countRows[0].total || 0;

    // data with limit/offset
    const dataSql = `SELECT MaHocSinh, HoTen, Lop, TrangThaiHocTap, MaPhuHuynh, DiaChi, Latitude, Longitude FROM hocsinh ${where} ORDER BY MaHocSinh LIMIT ? OFFSET ?`;
    const dataParams = params.concat([limit, offset]);
    const [rows] = await pool.query(dataSql, dataParams);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: rows,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};
// POST /api/v1/students
// Tạo học sinh mới trong bảng `hocsinh`
const createStudent = async (req, res) => {
  // Lấy các trường từ DB mới
  const { MaHocSinh, HoTen, Lop, MaPhuHuynh, DiaChi, Latitude, Longitude, TrangThaiHocTap } = req.body;

  if (!MaHocSinh || !HoTen || !Lop || !DiaChi || !Latitude || !Longitude) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (Mã HS, Tên, Lớp, Địa chỉ, Tọa độ).' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO hocsinh (MaHocSinh, HoTen, Lop, MaPhuHuynh, DiaChi, Latitude, Longitude, TrangThaiHocTap) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [MaHocSinh, HoTen, Lop, MaPhuHuynh, DiaChi, Latitude, Longitude, TrangThaiHocTap || 'Đang học']
    );
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
  const { HoTen, Lop, TrangThaiHocTap, MaPhuHuynh, DiaChi, Latitude, Longitude } = req.body;

  if (!HoTen || !Lop) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (Tên, Lớp).' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE hocsinh SET HoTen = ?, Lop = ?, TrangThaiHocTap = ?, MaPhuHuynh = ?, DiaChi = ?, Latitude = ?, Longitude = ? WHERE MaHocSinh = ?',
      [HoTen, Lop, TrangThaiHocTap, MaPhuHuynh, DiaChi, Latitude, Longitude, maHocSinh]
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