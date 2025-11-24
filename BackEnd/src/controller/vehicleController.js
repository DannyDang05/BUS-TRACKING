import { pool } from "../config/connectDB.js";

// GET /api/v1/vehicles
const getAllVehicles = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const q = req.query.q ? String(req.query.q).trim() : null;
  const offset = (page - 1) * limit;

  try {
    let where = '';
    const params = [];
    if (q) {
      where = ' WHERE LicensePlate LIKE ? OR Model LIKE ? ';
      const like = `%${q}%`;
      params.push(like, like);
    }

    const countSql = `SELECT COUNT(*) as total FROM vehicles ${where}`;
    const [countRows] = await pool.query(countSql, params);
    const totalItems = countRows[0].total || 0;

    const dataSql = `SELECT Id, LicensePlate, Model, SpeedKmh, Capacity, IsActive FROM vehicles ${where} ORDER BY Id LIMIT ? OFFSET ?`;
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

// POST /api/v1/vehicles
const createVehicle = async (req, res) => {
  const { LicensePlate, Model, SpeedKmh, Capacity, IsActive } = req.body;
  
  if (!LicensePlate || !Capacity) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (LicensePlate, Capacity).' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO vehicles (LicensePlate, Model, SpeedKmh, Capacity, IsActive) VALUES (?, ?, ?, ?, ?)',
      [LicensePlate, Model, SpeedKmh || 40, Capacity, IsActive !== undefined ? IsActive : 1]
    );
    return res.status(201).json({ errorCode: 0, message: 'Tạo xe thành công!', vehicleId: result.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 2, message: 'Biển số xe đã tồn tại.' });
    }
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/vehicles/:id
const getVehicleDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query(
      'SELECT Id, LicensePlate, Model, SpeedKmh, Capacity, IsActive FROM vehicles WHERE Id = ?', [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy xe.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows[0] });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// PUT /api/v1/vehicles/:id
const updateVehicle = async (req, res) => {
  const id = req.params.id;
  const { LicensePlate, Model, SpeedKmh, Capacity, IsActive } = req.body;

  if (!LicensePlate) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin bắt buộc.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE vehicles SET LicensePlate = ?, Model = ?, SpeedKmh = ?, Capacity = ?, IsActive = ? WHERE Id = ?',
      [LicensePlate, Model, SpeedKmh, Capacity, IsActive, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy xe.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'Cập nhật xe thành công.' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// DELETE /api/v1/vehicles/:id
const deleteVehicle = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM vehicles WHERE Id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy xe.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'Xóa xe thành công.' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

export { getAllVehicles, createVehicle, getVehicleDetail, updateVehicle, deleteVehicle };
