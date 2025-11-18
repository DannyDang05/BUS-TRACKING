import { pool } from "../config/connectDB.js";

// GET /api/v1/vehicles
const getAllVehicles = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT Id, LicensePlate, Model, SpeedKmh FROM vehicles');
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/vehicles
const createVehicle = async (req, res) => {
  const { LicensePlate, Model, SpeedKmh } = req.body;
  
  if (!LicensePlate) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (LicensePlate).' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO vehicles (LicensePlate, Model, SpeedKmh) VALUES (?, ?, ?)',
      [LicensePlate, Model, SpeedKmh || 40]
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
      'SELECT Id, LicensePlate, Model, SpeedKmh FROM vehicles WHERE Id = ?', [id]
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
  const { LicensePlate, Model, SpeedKmh } = req.body;

  if (!LicensePlate) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin bắt buộc.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE vehicles SET LicensePlate = ?, Model = ?, SpeedKmh = ? WHERE Id = ?',
      [LicensePlate, Model, SpeedKmh, id]
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
