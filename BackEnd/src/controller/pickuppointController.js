import { pool } from "../config/connectDB.js";

// GET /api/v1/pickuppoints?routeId=123
const getPickupPoints = async (req, res) => {
  const routeId = req.query.routeId || null;
  try {
    let sql = 'SELECT Id, RouteId, Latitude, Longitude, PointOrder, PointName, Address FROM pickuppoints';
    const params = [];
    if (routeId) {
      sql += ' WHERE RouteId = ?';
      params.push(routeId);
    }
    sql += ' ORDER BY PointOrder ASC';

    const [rows] = await pool.query(sql, params);
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows });
  } catch (e) {
    console.error('Error getPickupPoints:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/pickuppoints/:id
const getPickupPointById = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT Id, RouteId, Latitude, Longitude, PointOrder, PointName, Address FROM pickuppoints WHERE Id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy điểm đón.' });
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows[0] });
  } catch (e) {
    console.error('Error getPickupPointById:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/pickuppoints
const createPickupPoint = async (req, res) => {
  const { RouteId, Latitude, Longitude, PointOrder, PointName, Address } = req.body;
  if (!RouteId || Latitude == null || Longitude == null || PointOrder == null) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin bắt buộc (RouteId, Latitude, Longitude, PointOrder).' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO pickuppoints (RouteId, Latitude, Longitude, PointOrder, PointName, Address) VALUES (?, ?, ?, ?, ?, ?)',
      [RouteId, Latitude, Longitude, PointOrder, PointName || null, Address || null]
    );
    return res.status(201).json({ errorCode: 0, message: 'Tạo điểm đón thành công.', id: result.insertId });
  } catch (e) {
    console.error('Error createPickupPoint:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// PUT /api/v1/pickuppoints/:id
const updatePickupPoint = async (req, res) => {
  const id = req.params.id;
  const { Latitude, Longitude, PointOrder, PointName, Address } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE pickuppoints SET Latitude = ?, Longitude = ?, PointOrder = ?, PointName = ?, Address = ? WHERE Id = ?',
      [Latitude, Longitude, PointOrder, PointName || null, Address || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy điểm đón.' });
    return res.status(200).json({ errorCode: 0, message: 'Cập nhật điểm đón thành công.' });
  } catch (e) {
    console.error('Error updatePickupPoint:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// DELETE /api/v1/pickuppoints/:id
const deletePickupPoint = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM pickuppoints WHERE Id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy điểm đón.' });
    return res.status(200).json({ errorCode: 0, message: 'Xóa điểm đón thành công.' });
  } catch (e) {
    console.error('Error deletePickupPoint:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

export { getPickupPoints, getPickupPointById, createPickupPoint, updatePickupPoint, deletePickupPoint };
