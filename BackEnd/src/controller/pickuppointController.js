import { pool } from "../config/connectDB.js";
import { checkAndCompleteSchedule } from "./scheduleStatusHelper.js";
import parentNotificationService from "../service/ParentNotificationService.js";

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

/**
 * PUT /api/v1/pickuppoints/:scheduleId/:pickupPointId/status
 * Cập nhật trạng thái đón/trả học sinh cho một schedule cụ thể
 * Body: { status: 'Đã đón' | 'Đã trả' | 'Vắng' | 'Chưa đón', note: 'Ghi chú (optional)' }
 * Tự động kiểm tra và cập nhật schedule thành "Hoàn thành" nếu tất cả học sinh đã được đón/trả
 */
const updateSchedulePickupStatus = async (req, res) => {
  const { scheduleId, pickupPointId } = req.params;
  const { status, note } = req.body;

  const validStatuses = ['Chưa đón', 'Đã đón', 'Đã trả', 'Vắng', 'Xuất phát', 'Điểm cuối'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      errorCode: 1,
      message: `Trạng thái không hợp lệ. Chỉ chấp nhận: ${validStatuses.join(', ')}`
    });
  }

  try {
    // Kiểm tra xem đã có record trong schedule_pickup_status chưa
    const [existing] = await pool.query(
      'SELECT Id FROM schedule_pickup_status WHERE ScheduleId = ? AND PickupPointId = ?',
      [scheduleId, pickupPointId]
    );

    const now = new Date();
    const currentTime = now.toISOString().slice(0, 19).replace('T', ' ');

    if (existing.length > 0) {
      // Cập nhật record hiện có
      await pool.query(
        `UPDATE schedule_pickup_status 
         SET TinhTrangDon = ?, ThoiGianDonThucTe = ?, GhiChu = ?
         WHERE ScheduleId = ? AND PickupPointId = ?`,
        [status, currentTime, note || null, scheduleId, pickupPointId]
      );
    } else {
      // Tạo record mới
      await pool.query(
        `INSERT INTO schedule_pickup_status 
         (ScheduleId, PickupPointId, TinhTrangDon, ThoiGianDonThucTe, GhiChu)
         VALUES (?, ?, ?, ?, ?)`,
        [scheduleId, pickupPointId, status, currentTime, note || null]
      );
    }

    // Tự động kiểm tra và cập nhật schedule thành "Hoàn thành" nếu đủ điều kiện
    await checkAndCompleteSchedule(scheduleId);

    // Gửi thông báo cho phụ huynh ngay lập tức
    if (status === 'Đã đón' || status === 'Đã trả') {
      try {
        // Lấy thông tin học sinh và phụ huynh
        const [studentInfo] = await pool.query(`
          SELECT 
            hs.MaPhuHuynh as parent_id,
            hs.HoTen as student_name,
            pp.DiaChi as pickup_address
          FROM pickuppoints pp
          JOIN hocsinh hs ON pp.MaHocSinh = hs.MaHocSinh
          WHERE pp.Id = ?
        `, [pickupPointId]);

        if (studentInfo.length > 0) {
          const { parent_id, student_name, pickup_address } = studentInfo[0];
          const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          
          if (status === 'Đã đón') {
            await parentNotificationService.sendNotificationIfNotSent(
              parent_id,
              'picked_up',
              `✅ ${student_name} đã lên xe an toàn`,
              `Con đã được tài xế đón tại ${pickup_address || 'điểm đón'} lúc ${currentTime}`,
              scheduleId,
              pickupPointId
            );
          } else if (status === 'Đã trả') {
            await parentNotificationService.sendNotificationIfNotSent(
              parent_id,
              'dropped_off',
              `🏠 ${student_name} đã về đến điểm trả`,
              `Con đã được trả an toàn tại ${pickup_address || 'điểm trả'} lúc ${currentTime}`,
              scheduleId,
              pickupPointId
            );
          }
          
          console.log(`✅ Đã gửi thông báo "${status}" cho phụ huynh ${parent_id}`);
        }
      } catch (notifError) {
        console.error('❌ Lỗi gửi thông báo:', notifError);
        // Không throw error để không ảnh hưởng đến việc update status
      }
    }

    return res.status(200).json({
      errorCode: 0,
      message: 'Cập nhật trạng thái thành công.'
    });
  } catch (e) {
    console.error('Error updateSchedulePickupStatus:', e);
    return res.status(500).json({
      errorCode: -1,
      message: 'Lỗi server.'
    });
  }
};

export { 
  getPickupPoints, 
  getPickupPointById, 
  createPickupPoint, 
  updatePickupPoint, 
  deletePickupPoint, 
  updatePickupStatus,
  updateSchedulePickupStatus
};
