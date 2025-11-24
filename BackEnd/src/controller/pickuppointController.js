import { pool } from "../config/connectDB.js";

// GET /api/v1/pickuppoints?routeId=123
const getPickupPoints = async (req, res) => {
  const routeId = req.query.routeId || null;
  try {
    let sql = 'SELECT Id, MaHocSinh, RouteId, DiaChi, Latitude, Longitude, PointOrder, TinhTrangDon FROM pickuppoints';
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
    const [rows] = await pool.query('SELECT Id, MaHocSinh, RouteId, DiaChi, Latitude, Longitude, PointOrder, TinhTrangDon FROM pickuppoints WHERE Id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy điểm đón.' });
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows[0] });
  } catch (e) {
    console.error('Error getPickupPointById:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/pickuppoints
const createPickupPoint = async (req, res) => {
  const { MaHocSinh, RouteId, DiaChi, Latitude, Longitude, PointOrder, TinhTrangDon } = req.body;
  if (!MaHocSinh || !RouteId || Latitude == null || Longitude == null || PointOrder == null) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin bắt buộc (MaHocSinh, RouteId, Latitude, Longitude, PointOrder).' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO pickuppoints (MaHocSinh, RouteId, DiaChi, Latitude, Longitude, PointOrder, TinhTrangDon) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [MaHocSinh, RouteId, DiaChi || null, Latitude, Longitude, PointOrder, TinhTrangDon || 'Chưa đón']
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
  const { MaHocSinh, RouteId, DiaChi, Latitude, Longitude, PointOrder, TinhTrangDon } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE pickuppoints SET MaHocSinh = ?, RouteId = ?, DiaChi = ?, Latitude = ?, Longitude = ?, PointOrder = ?, TinhTrangDon = ? WHERE Id = ?',
      [MaHocSinh, RouteId, DiaChi || null, Latitude, Longitude, PointOrder, TinhTrangDon, id]
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

/**
 * PUT /api/v1/pickuppoints/:id/status
 * Cập nhật trạng thái đón/trả học sinh
 * Body: { status: 'Đã đón' | 'Đã trả' | 'Vắng mặt' | 'Chưa đón' }
 */
const updatePickupStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  const validStatuses = ['Chưa đón', 'Đã đón', 'Đã trả', 'Vắng mặt'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      errorCode: 1,
      message: `Trạng thái không hợp lệ. Chỉ chấp nhận: ${validStatuses.join(', ')}`
    });
  }

  try {
    const [result] = await pool.query(
      'UPDATE pickuppoints SET TinhTrangDon = ? WHERE Id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        errorCode: 3,
        message: 'Không tìm thấy điểm đón.'
      });
    }

    return res.status(200).json({
      errorCode: 0,
      message: 'Cập nhật trạng thái thành công.'
    });
  } catch (e) {
    console.error('Error updatePickupStatus:', e);
    return res.status(500).json({
      errorCode: -1,
      message: 'Lỗi server.'
    });
  }
};

export { getPickupPoints, getPickupPointById, createPickupPoint, updatePickupPoint, deletePickupPoint, updatePickupStatus };
