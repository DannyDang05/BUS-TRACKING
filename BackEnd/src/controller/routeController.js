import { pool } from "../config/connectDB.js";

// GET /api/v1/routes
const getAllRoutes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT Id, MaTuyen, Name, DriverId, VehicleId, Status FROM routes');
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/routes
const createRoute = async (req, res) => {
  const { MaTuyen, Name, DriverId, VehicleId, Status } = req.body;
  
  if (!MaTuyen || !Name) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (MaTuyen, Name).' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO routes (MaTuyen, Name, DriverId, VehicleId, Status) VALUES (?, ?, ?, ?, ?)',
      [MaTuyen, Name, DriverId, VehicleId, Status || 'Chưa chạy']
    );
    return res.status(201).json({ errorCode: 0, message: 'Tạo tuyến thành công!', routeId: result.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 2, message: 'Mã tuyến đã tồn tại.' });
    }
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/routes/:id
const getRouteDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query(
      'SELECT Id, MaTuyen, Name, DriverId, VehicleId, Status FROM routes WHERE Id = ?', [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy tuyến.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows[0] });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// PUT /api/v1/routes/:id
const updateRoute = async (req, res) => {
  const id = req.params.id;
  const { MaTuyen, Name, DriverId, VehicleId, Status } = req.body;

  if (!MaTuyen || !Name) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin bắt buộc.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE routes SET MaTuyen = ?, Name = ?, DriverId = ?, VehicleId = ?, Status = ? WHERE Id = ?',
      [MaTuyen, Name, DriverId, VehicleId, Status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy tuyến.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'Cập nhật tuyến thành công.' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// DELETE /api/v1/routes/:id
const deleteRoute = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM routes WHERE Id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy tuyến.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'Xóa tuyến thành công.' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

export { getAllRoutes, createRoute, getRouteDetail, updateRoute, deleteRoute };
