import { pool } from "../config/connectDB.js";

// GET /api/v1/notifications
const getAllNotifications = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT MaThongBao, NoiDung, ThoiGian, LoaiThongBao FROM thongbao');
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/notifications
const createNotification = async (req, res) => {
  const { MaThongBao, NoiDung, LoaiThongBao } = req.body;
  
  if (!MaThongBao || !NoiDung) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (MaThongBao, NoiDung).' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO thongbao (MaThongBao, NoiDung, ThoiGian, LoaiThongBao) VALUES (?, ?, ?, ?)',
      [MaThongBao, NoiDung, new Date(), LoaiThongBao || 'Thông thường']
    );
    return res.status(201).json({ errorCode: 0, message: 'Tạo thông báo thành công!', notificationId: MaThongBao });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 2, message: 'Mã thông báo đã tồn tại.' });
    }
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/notifications/:id
const getNotificationDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query(
      'SELECT MaThongBao, NoiDung, ThoiGian, LoaiThongBao FROM thongbao WHERE MaThongBao = ?', [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy thông báo.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows[0] });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// DELETE /api/v1/notifications/:id
const deleteNotification = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM thongbao WHERE MaThongBao = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy thông báo.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'Xóa thông báo thành công.' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

/**
 * POST /api/v1/notifications/report-issue
 * Tài xế báo cáo sự cố (tắc đường, xe hỏng, học sinh gây rối...)
 * Body: { driverId, routeCode, issueType, description }
 */
const reportIssue = async (req, res) => {
  const { driverId, routeCode, issueType, description } = req.body;

  if (!driverId || !issueType || !description) {
    return res.status(400).json({
      errorCode: 1,
      message: 'Thiếu thông tin bắt buộc (driverId, issueType, description).'
    });
  }

  try {
    // Tạo mã thông báo tự động: ISSUE-{timestamp}
    const maThongBao = `ISSUE-${Date.now()}`;
    const noiDung = `[SỰ CỐ] Tài xế ${driverId}${routeCode ? ` - Tuyến ${routeCode}` : ''} báo cáo: ${issueType} - ${description}`;

    await pool.query(
      'INSERT INTO thongbao (MaThongBao, NoiDung, ThoiGian, LoaiThongBao) VALUES (?, ?, NOW(), ?)',
      [maThongBao, noiDung, 'Sự cố']
    );

    return res.status(201).json({
      errorCode: 0,
      message: 'Báo cáo sự cố thành công. Ban quản lý sẽ xử lý trong thời gian sớm nhất.',
      notificationId: maThongBao
    });
  } catch (e) {
    console.error('Error reportIssue:', e);
    return res.status(500).json({
      errorCode: -1,
      message: 'Lỗi server khi gửi báo cáo.'
    });
  }
};

export { getAllNotifications, createNotification, getNotificationDetail, deleteNotification, reportIssue };
