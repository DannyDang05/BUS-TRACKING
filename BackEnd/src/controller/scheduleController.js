import { pool } from "../config/connectDB.js";

/**
 * GET /api/v1/schedules/driver/:driverId
 * Lấy danh sách lịch làm việc của tài xế theo ngày
 * Query params: date (optional, default: hôm nay)
 */
const getDriverSchedules = async (req, res) => {
  const driverId = req.params.driverId;
  const today = new Date().toISOString().split('T')[0]; // Ngày hôm nay

  try {
    // Lấy schedules của tài xế TỪ HÔM NAY TRỞ ĐI (không hiển thị lịch cũ)
    const [schedules] = await pool.query(`
      SELECT 
        s.id AS scheduleId,
        s.date,
        s.start_time AS startTime,
        s.shift,
        s.status,
        r.Id AS routeId,
        r.MaTuyen AS routeCode,
        r.Name AS routeName,
        v.LicensePlate,
        v.Model AS vehicleModel,
        COUNT(DISTINCT CASE WHEN pp.MaHocSinh IS NOT NULL THEN pp.Id END) AS totalStudents,
        SUM(CASE WHEN pp.TinhTrangDon = 'Đã đón' THEN 1 ELSE 0 END) AS pickedUpCount,
        SUM(CASE WHEN pp.TinhTrangDon = 'Đã trả' THEN 1 ELSE 0 END) AS droppedOffCount
      FROM schedules s
      INNER JOIN routes r ON s.route_id = r.Id
      LEFT JOIN vehicles v ON r.VehicleId = v.Id
      LEFT JOIN pickuppoints pp ON r.Id = pp.RouteId
      WHERE r.DriverId = ? AND s.date >= ?
      GROUP BY s.id, s.date, s.start_time, s.shift, s.status, r.Id, r.MaTuyen, r.Name, v.LicensePlate, v.Model
      ORDER BY s.date ASC, s.start_time ASC
    `, [driverId, today]);

    // Map status code to text
    const statusMap = {
      1: 'Sắp diễn ra',
      2: 'Đang chạy',
      3: 'Hoàn thành',
      4: 'Hủy'
    };

    const formattedSchedules = schedules.map(sch => ({
      ...sch,
      statusText: statusMap[sch.status] || 'Không xác định',
      pickedUpCount: sch.pickedUpCount || 0,
      droppedOffCount: sch.droppedOffCount || 0
    }));

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: formattedSchedules
    });
  } catch (error) {
    console.error('Error in getDriverSchedules:', error);
    return res.status(500).json({ 
      errorCode: -1, 
      message: 'Lỗi server khi lấy lịch làm việc.' 
    });
  }
};

/**
 * GET /api/v1/schedules/:scheduleId/students
 * Lấy danh sách học sinh trên tuyến của schedule
 */
const getScheduleStudents = async (req, res) => {
  const scheduleId = req.params.scheduleId;

  try {
    // Lấy route_id từ schedule
    const [scheduleRows] = await pool.query(
      'SELECT route_id FROM schedules WHERE id = ?',
      [scheduleId]
    );

    if (scheduleRows.length === 0) {
      return res.status(404).json({
        errorCode: 3,
        message: 'Không tìm thấy lịch trình.'
      });
    }

    const routeId = scheduleRows[0].route_id;

    // Lấy thông tin route
    const [routeInfo] = await pool.query(`
      SELECT r.Id, r.MaTuyen, r.Name, v.LicensePlate
      FROM routes r
      LEFT JOIN vehicles v ON r.VehicleId = v.Id
      WHERE r.Id = ?
    `, [routeId]);

    // Lấy danh sách học sinh với điểm đón theo thứ tự
    const [students] = await pool.query(`
      SELECT 
        pp.Id AS pickupPointId,
        pp.PointOrder,
        pp.TinhTrangDon AS status,
        pp.Latitude,
        pp.Longitude,
        pp.DiaChi AS pickupAddress,
        hs.MaHocSinh AS studentId,
        hs.HoTen AS studentName,
        hs.Lop AS studentClass,
        ph.HoTen AS parentName,
        ph.SoDienThoai AS parentPhone
      FROM pickuppoints pp
      INNER JOIN hocsinh hs ON pp.MaHocSinh = hs.MaHocSinh
      LEFT JOIN phuhuynh ph ON hs.MaPhuHuynh = ph.MaPhuHuynh
      WHERE pp.RouteId = ?
      ORDER BY pp.PointOrder ASC
    `, [routeId]);

    // Add route info to each student record
    const studentsWithRouteInfo = students.map(s => ({
      ...s,
      routeId: routeId,
      routeCode: routeInfo[0]?.MaTuyen || null,
      routeName: routeInfo[0]?.Name || null,
      licensePlate: routeInfo[0]?.LicensePlate || null
    }));

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: studentsWithRouteInfo
    });
  } catch (error) {
    console.error('Error in getScheduleStudents:', error);
    return res.status(500).json({
      errorCode: -1,
      message: 'Lỗi server khi lấy danh sách học sinh.'
    });
  }
};

/**
 * PUT /api/v1/schedules/:scheduleId/status
 * Cập nhật trạng thái schedule (Bắt đầu hành trình, Hoàn thành...)
 */
const updateScheduleStatus = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const { status } = req.body; // 1: Sắp diễn ra, 2: Đang chạy, 3: Hoàn thành, 4: Hủy

  if (![1, 2, 3, 4].includes(status)) {
    return res.status(400).json({
      errorCode: 1,
      message: 'Trạng thái không hợp lệ. Chỉ chấp nhận 1, 2, 3, 4.'
    });
  }

  try {
    const [result] = await pool.query(
      'UPDATE schedules SET status = ? WHERE id = ?',
      [status, scheduleId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        errorCode: 3,
        message: 'Không tìm thấy lịch trình.'
      });
    }

    return res.status(200).json({
      errorCode: 0,
      message: 'Cập nhật trạng thái lịch trình thành công.'
    });
  } catch (error) {
    console.error('Error in updateScheduleStatus:', error);
    return res.status(500).json({
      errorCode: -1,
      message: 'Lỗi server khi cập nhật trạng thái.'
    });
  }
};

/**
 * GET /api/v1/schedules
 * Lấy tất cả schedules (Admin)
 */
const getAllSchedules = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const q = req.query.q ? String(req.query.q).trim() : null;
  const offset = (page - 1) * limit;

  try {
    let where = '';
    const params = [];
    
    if (q) {
      where = ' WHERE r.MaTuyen LIKE ? OR r.Name LIKE ? OR s.date LIKE ? ';
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    // Count total
    const countSql = `
      SELECT COUNT(*) as total 
      FROM schedules s
      INNER JOIN routes r ON s.route_id = r.Id
      ${where}
    `;
    const [countRows] = await pool.query(countSql, params);
    const totalItems = countRows[0].total || 0;

    // Get data
    const dataSql = `
      SELECT 
        s.id,
        s.route_id,
        s.date,
        s.start_time,
        s.shift,
        s.end_time,
        s.status,
        s.created_at,
        r.MaTuyen as routeCode,
        r.Name as routeName,
        r.DriverId,
        d.FullName as driverName,
        v.LicensePlate as licensePlate
      FROM schedules s
      INNER JOIN routes r ON s.route_id = r.Id
      LEFT JOIN drivers d ON r.DriverId = d.Id
      LEFT JOIN vehicles v ON r.VehicleId = v.Id
      ${where}
      ORDER BY s.date DESC, s.start_time DESC
      LIMIT ? OFFSET ?
    `;
    const dataParams = params.concat([limit, offset]);
    const [rows] = await pool.query(dataSql, dataParams);

    const totalPages = Math.ceil(totalItems / limit);
    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: rows,
      meta: { totalItems, totalPages, currentPage: page, pageSize: limit }
    });
  } catch (error) {
    console.error('Error in getAllSchedules:', error);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

/**
 * GET /api/v1/schedules/:id
 * Lấy chi tiết schedule
 */
const getScheduleById = async (req, res) => {
  const id = req.params.id;
  
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.*,
        r.MaTuyen as routeCode,
        r.Name as routeName
      FROM schedules s
      INNER JOIN routes r ON s.route_id = r.Id
      WHERE s.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy lịch trình.' });
    }
    
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows[0] });
  } catch (error) {
    console.error('Error in getScheduleById:', error);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

/**
 * POST /api/v1/schedules
 * Tạo schedule mới
 */
const createSchedule = async (req, res) => {
  const { route_id, date, start_time, shift, status } = req.body;
  
  if (!route_id || !date || !start_time) {
    return res.status(400).json({ 
      errorCode: 1, 
      message: 'Thiếu thông tin (route_id, date, start_time).' 
    });
  }

  try {
    // Log để debug
    console.log('📅 Creating schedule:', { date, start_time, shift, status });
    
    const [result] = await pool.query(
      'INSERT INTO schedules (route_id, date, start_time, shift, status) VALUES (?, ?, ?, ?, ?)',
      [route_id, date, start_time, shift || 'Sáng', status || 'Sắp diễn ra']
    );
    
    return res.status(201).json({ 
      errorCode: 0, 
      message: 'Tạo lịch trình thành công!', 
      scheduleId: result.insertId 
    });
  } catch (error) {
    console.error('Error in createSchedule:', error);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

/**
 * PUT /api/v1/schedules/:id
 * Cập nhật schedule
 */
const updateSchedule = async (req, res) => {
  const id = req.params.id;
  const { route_id, date, start_time, end_time, status } = req.body;

  if (!route_id || !date || !start_time) {
    return res.status(400).json({ 
      errorCode: 1, 
      message: 'Thiếu thông tin bắt buộc.' 
    });
  }

  try {
    const [result] = await pool.query(
      'UPDATE schedules SET route_id = ?, date = ?, start_time = ?, end_time = ?, status = ? WHERE id = ?',
      [route_id, date, start_time, end_time, status, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy lịch trình.' });
    }
    
    return res.status(200).json({ errorCode: 0, message: 'Cập nhật lịch trình thành công.' });
  } catch (error) {
    console.error('Error in updateSchedule:', error);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

/**
 * DELETE /api/v1/schedules/:id
 * Xóa schedule
 */
const deleteSchedule = async (req, res) => {
  const id = req.params.id;
  
  try {
    const [result] = await pool.query('DELETE FROM schedules WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy lịch trình.' });
    }
    
    return res.status(200).json({ errorCode: 0, message: 'Xóa lịch trình thành công.' });
  } catch (error) {
    console.error('Error in deleteSchedule:', error);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

/**
 * POST /api/v1/schedules/assign-driver
 * Phân công tài xế cho route (tạo 2 schedules: sáng + chiều)
 */
const assignDriverToRoute = async (req, res) => {
  const { routeId, driverId, date, morningStartTime, afternoonStartTime } = req.body;
  
  if (!routeId || !driverId || !date) {
    return res.status(400).json({ 
      errorCode: 1, 
      message: 'Thiếu thông tin (routeId, driverId, date).' 
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Cập nhật DriverId vào route
    await connection.query(
      'UPDATE routes SET DriverId = ? WHERE Id = ?',
      [driverId, routeId]
    );

    // 2. Tạo schedule ca sáng (nếu có)
    let morningScheduleId = null;
    if (morningStartTime) {
      const [morningResult] = await connection.query(`
        INSERT INTO schedules (route_id, date, start_time, shift, status)
        VALUES (?, ?, ?, 'Sáng', 'Đã phân công')
      `, [routeId, date, morningStartTime]);
      morningScheduleId = morningResult.insertId;
    }

    // 3. Tạo schedule ca chiều (nếu có)
    let afternoonScheduleId = null;
    if (afternoonStartTime) {
      const [afternoonResult] = await connection.query(`
        INSERT INTO schedules (route_id, date, start_time, shift, status)
        VALUES (?, ?, ?, 'Chiều', 'Đã phân công')
      `, [routeId, date, afternoonStartTime]);
      afternoonScheduleId = afternoonResult.insertId;
    }

    await connection.commit();

    return res.status(201).json({ 
      errorCode: 0, 
      message: 'Phân công tài xế và tạo lịch trình thành công!',
      data: {
        routeId,
        driverId,
        morningScheduleId,
        afternoonScheduleId
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error in assignDriverToRoute:', error);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server khi phân công tài xế.' });
  } finally {
    connection.release();
  }
};

/**
 * PUT /api/v1/schedules/:id/assign-driver
 * Cập nhật tài xế cho schedule đã tồn tại
 */
const updateScheduleDriver = async (req, res) => {
  const scheduleId = req.params.id;
  const { driverId } = req.body;
  
  if (!driverId) {
    return res.status(400).json({ 
      errorCode: 1, 
      message: 'Thiếu thông tin driverId.' 
    });
  }

  try {
    // Lấy route_id từ schedule
    const [schedules] = await pool.query(
      'SELECT route_id FROM schedules WHERE id = ?',
      [scheduleId]
    );

    if (schedules.length === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy lịch trình.' });
    }

    const routeId = schedules[0].route_id;

    // Cập nhật DriverId vào route
    await pool.query(
      'UPDATE routes SET DriverId = ? WHERE Id = ?',
      [driverId, routeId]
    );

    // Cập nhật status schedule thành "Đã phân công"
    await pool.query(
      "UPDATE schedules SET status = 'Đã phân công' WHERE id = ?",
      [scheduleId]
    );

    return res.status(200).json({ 
      errorCode: 0, 
      message: 'Cập nhật tài xế cho lịch trình thành công.' 
    });
  } catch (error) {
    console.error('Error in updateScheduleDriver:', error);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

/**
 * POST /api/v1/schedules/generate-day
 * Tự động tạo schedules cho 1 ngày (2 ca: sáng + chiều cho tất cả routes)
 */
const generateDaySchedules = async (req, res) => {
  const { date } = req.body; // Format: YYYY-MM-DD
  
  if (!date) {
    return res.status(400).json({
      errorCode: 1,
      message: 'Thiếu thông tin (date).'
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Lấy tất cả routes active
    const [routes] = await connection.query('SELECT Id, MaTuyen, Name FROM routes WHERE Status != "Đã hủy"');
    
    if (routes.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        errorCode: 3,
        message: 'Không có tuyến nào để tạo lịch.'
      });
    }

    let createdCount = 0;

    // Tạo 2 ca (sáng + chiều) cho mỗi route
    for (const route of routes) {
      // Kiểm tra xem route này đã có schedule cho ngày này chưa
      const [existing] = await connection.query(
        'SELECT id FROM schedules WHERE route_id = ? AND date = ?',
        [route.Id, date]
      );

      if (existing.length === 0) {
        // Tạo ca sáng
        await connection.query(
          `INSERT INTO schedules (route_id, date, start_time, shift, status) 
           VALUES (?, ?, '07:00:00', 'Sáng', 'Chưa phân công')`,
          [route.Id, date]
        );
        createdCount++;

        // Tạo ca chiều
        await connection.query(
          `INSERT INTO schedules (route_id, date, start_time, shift, status) 
           VALUES (?, ?, '16:00:00', 'Chiều', 'Chưa phân công')`,
          [route.Id, date]
        );
        createdCount++;
      }
    }

    await connection.commit();

    return res.status(201).json({
      errorCode: 0,
      message: `Đã tạo ${createdCount} lịch trình (${createdCount/2} ca sáng + ${createdCount/2} ca chiều) cho ngày ${date}`,
      data: { createdCount, routeCount: routes.length, date }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error in generateDaySchedules:', error);
    return res.status(500).json({
      errorCode: -1,
      message: 'Lỗi server khi tạo lịch trình.'
    });
  } finally {
    connection.release();
  }
};

export { 
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getDriverSchedules, 
  getScheduleStudents,
  updateScheduleStatus,
  assignDriverToRoute,
  updateScheduleDriver,
  generateDaySchedules
};
