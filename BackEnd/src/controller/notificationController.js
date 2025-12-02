import { pool } from "../config/connectDB.js";

// GET /api/v1/notifications
const getAllNotifications = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const q = req.query.q ? String(req.query.q).trim() : null;
  const offset = (page - 1) * limit;

  try {
    let where = '';
    const params = [];
    if (q) {
      where = ' WHERE MaThongBao LIKE ? OR NoiDung LIKE ? OR LoaiThongBao LIKE ? ';
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    const countSql = `SELECT COUNT(*) as total FROM thongbao ${where}`;
    const [countRows] = await pool.query(countSql, params);
    const totalItems = countRows[0].total || 0;

    const dataSql = `SELECT MaThongBao, NoiDung, ThoiGian, LoaiThongBao FROM thongbao ${where} ORDER BY ThoiGian DESC LIMIT ? OFFSET ?`;
    const dataParams = params.concat([limit, offset]);
    const [rows] = await pool.query(dataSql, dataParams);

    const totalPages = Math.ceil(totalItems / limit);
    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: rows,
      meta: { totalItems, totalPages, currentPage: page, pageSize: limit }
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/notifications
const createNotification = async (req, res) => {
  const { MaThongBao, NoiDung, LoaiThongBao, recipientType, recipients } = req.body;
  
  if (!MaThongBao || !NoiDung) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (MaThongBao, NoiDung).' });
  }

  if (!recipientType || !['driver', 'parent', 'all'].includes(recipientType)) {
    return res.status(400).json({ errorCode: 1, message: 'recipientType phải là "driver", "parent" hoặc "all".' });
  }

  if (recipientType !== 'all' && (!recipients || !Array.isArray(recipients) || recipients.length === 0)) {
    return res.status(400).json({ errorCode: 1, message: 'Danh sách người nhận không hợp lệ.' });
  }

  try {
    // Tạo thông báo chính trong bảng thongbao
    await pool.query(
      'INSERT INTO thongbao (MaThongBao, NoiDung, ThoiGian, LoaiThongBao) VALUES (?, ?, ?, ?)',
      [MaThongBao, NoiDung, new Date(), LoaiThongBao || 'Thông thường']
    );

    let insertedCount = 0;

    // Gửi thông báo cho từng đối tượng
    if (recipientType === 'driver' || recipientType === 'all') {
      let driverList = recipients;
      
      // Nếu gửi cho tất cả, lấy danh sách tất cả tài xế
      if (recipientType === 'all') {
        const [allDrivers] = await pool.query('SELECT Id FROM drivers WHERE IsActive = 1');
        driverList = allDrivers.map(d => d.Id);
      }

      // Chèn vào bảng thongbao_taixe
      for (const driverId of driverList) {
        const uniqueId = `${MaThongBao}_${driverId}_${Date.now()}`;
        await pool.query(
          'INSERT INTO thongbao_taixe (MaThongBao, MaTaiXe, NoiDung, ThoiGian, LoaiThongBao, DaDoc) VALUES (?, ?, ?, ?, ?, ?)',
          [uniqueId, driverId, NoiDung, new Date(), LoaiThongBao || 'Thông báo', 0]
        );
        insertedCount++;
      }
    }

    if (recipientType === 'parent' || recipientType === 'all') {
      let parentList = recipients;
      
      // Nếu gửi cho tất cả, lấy danh sách tất cả phụ huynh
      if (recipientType === 'all') {
        const [allParents] = await pool.query('SELECT MaPhuHuynh FROM phuhuynh WHERE Nhanthongbao = 1');
        parentList = allParents.map(p => p.MaPhuHuynh);
      }

      // Chèn vào bảng thongbao_phuhuynh
      for (const parentId of parentList) {
        const uniqueId = `${MaThongBao}_${parentId}_${Date.now()}`;
        await pool.query(
          'INSERT INTO thongbao_phuhuynh (MaThongBao, MaPhuHuynh, NoiDung, ThoiGian, LoaiThongBao, DaDoc) VALUES (?, ?, ?, ?, ?, ?)',
          [uniqueId, parentId, NoiDung, new Date(), LoaiThongBao || 'Thông báo', 0]
        );
        insertedCount++;
      }
    }

    return res.status(201).json({ 
      errorCode: 0, 
      message: `Tạo thông báo thành công! Đã gửi tới ${insertedCount} người nhận.`, 
      notificationId: MaThongBao,
      recipientCount: insertedCount
    });
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

// GET /api/v1/notifications/recipients/drivers
const getAllDriversForNotification = async (req, res) => {
  try {
    const [drivers] = await pool.query(
      'SELECT Id, FullName, PhoneNumber, MaBangLai FROM drivers WHERE IsActive = 1 ORDER BY FullName'
    );
    return res.status(200).json({ errorCode: 0, data: drivers });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/notifications/recipients/parents
const getAllParentsForNotification = async (req, res) => {
  try {
    const [parents] = await pool.query(
      'SELECT MaPhuHuynh, HoTen, SoDienThoai FROM phuhuynh WHERE Nhanthongbao = 1 ORDER BY HoTen'
    );
    return res.status(200).json({ errorCode: 0, data: parents });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

export { 
  getAllNotifications, 
  createNotification, 
  getNotificationDetail, 
  deleteNotification, 
  reportIssue,
  getAllDriversForNotification,
  getAllParentsForNotification
};
