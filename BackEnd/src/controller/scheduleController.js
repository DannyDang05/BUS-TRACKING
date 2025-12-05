import { pool } from "../config/connectDB.js";
import { checkAndCompleteSchedule } from "./scheduleStatusHelper.js";
import ParentNotificationService from "../service/ParentNotificationService.js";

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
    // Đếm trạng thái từ schedule_pickup_status, KHÔNG PHẢI từ pickuppoints
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
        SUM(CASE WHEN sps.TinhTrangDon = 'Đã đón' THEN 1 ELSE 0 END) AS pickedUpCount,
        SUM(CASE WHEN sps.TinhTrangDon = 'Đã trả' THEN 1 ELSE 0 END) AS droppedOffCount
      FROM schedules s
      INNER JOIN routes r ON s.route_id = r.Id
      LEFT JOIN vehicles v ON s.vehicle_id = v.Id
      LEFT JOIN pickuppoints pp ON r.Id = pp.RouteId
      LEFT JOIN schedule_pickup_status sps ON sps.ScheduleId = s.id AND sps.PickupPointId = pp.Id
      WHERE s.driver_id = ? AND s.date >= ?
      GROUP BY s.id, s.date, s.start_time, s.shift, s.status, r.Id, r.MaTuyen, r.Name, v.LicensePlate, v.Model
      ORDER BY s.date ASC, s.start_time ASC
    `, [driverId, today]);

    // Map status text from DB
    const statusMap = {
      'Chưa phân công': 'Chưa phân công',
      'Sắp diễn ra': 'Sắp diễn ra',
      'Đang chạy': 'Đang chạy',
      'Hoàn thành': 'Hoàn thành',
      'Đã hủy': 'Đã hủy',
      'Đã phân công': 'Đã phân công'
    };

    const formattedSchedules = schedules.map(sch => ({
      ...sch,
      statusText: statusMap[sch.status] || sch.status || 'Không xác định',
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
 * Bao gồm cả trạng thái đón/trả từ bảng schedule_pickup_status
 */
const getScheduleStudents = async (req, res) => {
  const scheduleId = req.params.scheduleId;

  try {
    // Lấy route_id và thông tin schedule
    const [scheduleRows] = await pool.query(
      'SELECT route_id, shift, status, date FROM schedules WHERE id = ?',
      [scheduleId]
    );

    if (scheduleRows.length === 0) {
      return res.status(404).json({
        errorCode: 3,
        message: 'Không tìm thấy lịch trình.'
      });
    }

    const routeId = scheduleRows[0].route_id;
    const shift = scheduleRows[0].shift;
    const scheduleStatus = scheduleRows[0].status;
    const scheduleDate = scheduleRows[0].date;

    // Lấy thông tin route và vehicle từ schedule
    const [scheduleInfo] = await pool.query(`
      SELECT 
        r.Id, r.MaTuyen, r.Name,
        v.LicensePlate,
        s.driver_id, s.vehicle_id
      FROM schedules s
      INNER JOIN routes r ON s.route_id = r.Id
      LEFT JOIN vehicles v ON s.vehicle_id = v.Id
      WHERE s.id = ?
    `, [scheduleId]);
    
    const routeInfo = scheduleInfo;

    // Lấy TẤT CẢ điểm đón theo thứ tự (BAO GỒM ĐIỂM TRƯỜNG có MaHocSinh = NULL)
    // LUÔN lấy trạng thái từ schedule_pickup_status (không fallback về pickuppoints)
    const [students] = await pool.query(`
      SELECT 
        pp.Id AS pickupPointId,
        pp.MaHocSinh,
        pp.PointOrder,
        COALESCE(sps.TinhTrangDon, 'Chưa đón') AS status,
        sps.ThoiGianDonThucTe AS actualPickupTime,
        sps.GhiChu AS note,
        pp.Latitude,
        pp.Longitude,
        pp.DiaChi AS pickupAddress,
        hs.MaHocSinh AS studentId,
        hs.HoTen AS studentName,
        hs.Lop AS studentClass,
        ph.HoTen AS parentName,
        ph.SoDienThoai AS parentPhone
      FROM pickuppoints pp
      LEFT JOIN hocsinh hs ON pp.MaHocSinh = hs.MaHocSinh
      LEFT JOIN phuhuynh ph ON hs.MaPhuHuynh = ph.MaPhuHuynh
      LEFT JOIN schedule_pickup_status sps ON sps.PickupPointId = pp.Id AND sps.ScheduleId = ?
      WHERE pp.RouteId = ?
      ORDER BY pp.PointOrder ASC
    `, [scheduleId, routeId]);

    // Add route info to each student record
    const studentsWithRouteInfo = students.map(s => ({
      ...s,
      routeId: routeId,
      routeCode: routeInfo[0]?.MaTuyen || null,
      routeName: routeInfo[0]?.Name || null,
      licensePlate: routeInfo[0]?.LicensePlate || null,
      shift: shift,
      scheduleStatus: scheduleStatus,
      scheduleDate: scheduleDate
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
  const { status } = req.body; // 'Chưa phân công', 'Sắp diễn ra', 'Đang chạy', 'Hoàn thành', 'Đã hủy'

  const validStatuses = ['Chưa phân công', 'Sắp diễn ra', 'Đang chạy', 'Hoàn thành', 'Đã hủy', 'Đã phân công'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      errorCode: 1,
      message: 'Trạng thái không hợp lệ. Chỉ chấp nhận: ' + validStatuses.join(', ')
    });
  }

  try {
    // Nếu status là "Đang chạy", kiểm tra xem schedule có thể bắt đầu không
    if (status === 'Đang chạy') {
      const [scheduleData] = await pool.query(
        'SELECT status FROM schedules WHERE id = ?',
        [scheduleId]
      );
      
      if (scheduleData.length === 0) {
        return res.status(404).json({
          errorCode: 3,
          message: 'Không tìm thấy lịch trình.'
        });
      }

      const currentStatus = scheduleData[0].status;
      if (!['Đã phân công', 'Sắp diễn ra'].includes(currentStatus)) {
        return res.status(400).json({
          errorCode: 2,
          message: 'Chỉ có thể bắt đầu lịch trình có trạng thái "Đã phân công" hoặc "Sắp diễn ra".'
        });
      }
    }

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

    // Nếu status là "Đang chạy", gửi thông báo cho phụ huynh
    if (status === 'Đang chạy') {
      ParentNotificationService.notifyTripStart(scheduleId);
    }

    // Nếu status là "Hoàn thành", cập nhật end_time
    if (status === 'Hoàn thành') {
      const now = new Date();
      const endTime = now.toTimeString().split(' ')[0];
      await pool.query(
        'UPDATE schedules SET end_time = ? WHERE id = ?',
        [endTime, scheduleId]
      );
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
        DATE_FORMAT(s.date, '%Y-%m-%d') as date,
        s.start_time,
        s.shift,
        s.end_time,
        s.status,
        s.created_at,
        s.driver_id as DriverId,
        s.vehicle_id,
        r.MaTuyen as routeCode,
        r.Name as routeName,
        d.FullName as driverName,
        v.LicensePlate as licensePlate
      FROM schedules s
      INNER JOIN routes r ON s.route_id = r.Id
      LEFT JOIN drivers d ON s.driver_id = d.Id
      LEFT JOIN vehicles v ON s.vehicle_id = v.Id
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
 * Tạo schedule mới và tự động tạo pickup status records
 */
const createSchedule = async (req, res) => {
  const { route_id, date, start_time, shift, status, driver_id, vehicle_id } = req.body;
  
  if (!route_id || !date || !start_time) {
    return res.status(400).json({ 
      errorCode: 1, 
      message: 'Thiếu thông tin (route_id, date, start_time).' 
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Log để debug
    console.log('📅 Creating schedule:', { date, start_time, shift, status, driver_id, vehicle_id });
    
    // 0. Kiểm tra driver conflict (nếu có driver_id)
    if (driver_id) {
      const shiftValue = shift || 'Sáng';
      const [existingSchedules] = await connection.query(`
        SELECT s.id, r.Name as routeName
        FROM schedules s
        INNER JOIN routes r ON s.route_id = r.Id
        WHERE s.driver_id = ? AND s.date = ? AND s.shift = ? AND s.status != 'Đã hủy'
      `, [driver_id, date, shiftValue]);

      if (existingSchedules.length > 0) {
        await connection.rollback();
        const routeName = existingSchedules[0].routeName;
        return res.status(400).json({ 
          errorCode: 2, 
          message: `Tài xế đã được phân công cho tuyến "${routeName}" vào ca ${shiftValue} ngày ${date}. Một tài xế không thể phân công cho nhiều tuyến trong cùng ca.` 
        });
      }
    }
    
    // 1. Tạo schedule với driver_id và vehicle_id
    const [result] = await connection.query(
      'INSERT INTO schedules (route_id, date, start_time, shift, status, driver_id, vehicle_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [route_id, date, start_time, shift || 'Sáng', status || 'Chưa phân công', driver_id || null, vehicle_id || null]
    );
    
    const scheduleId = result.insertId;

    // 2. Tạo pickup status records cho TẤT CẢ điểm (bao gồm điểm trường)
    const [pickupPoints] = await connection.query(
      'SELECT Id, MaHocSinh, PointOrder FROM pickuppoints WHERE RouteId = ? ORDER BY PointOrder ASC',
      [route_id]
    );

    if (pickupPoints.length > 0) {
      for (const point of pickupPoints) {
        // Xác định trạng thái ban đầu
        let initialStatus = 'Chưa đón';
        if (!point.MaHocSinh) {
          // Điểm trường: Xuất phát (PointOrder = 0) hoặc Điểm cuối (PointOrder lớn nhất)
          initialStatus = point.PointOrder === 0 ? 'Xuất phát' : 'Điểm cuối';
        }
        
        await connection.query(
          `INSERT INTO schedule_pickup_status (ScheduleId, PickupPointId, TinhTrangDon) 
           VALUES (?, ?, ?)`,
          [scheduleId, point.Id, initialStatus]
        );
      }
      console.log(`✅ Đã tạo ${pickupPoints.length} bản ghi pickup status cho schedule ${scheduleId} (bao gồm điểm trường)`);
    }

    await connection.commit();
    
    return res.status(201).json({ 
      errorCode: 0, 
      message: 'Tạo lịch trình thành công!', 
      scheduleId: scheduleId,
      pickupPointsCount: pickupPoints.length
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error in createSchedule:', error);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  } finally {
    connection.release();
  }
};

/**
 * PUT /api/v1/schedules/:id
 * Cập nhật schedule
 */
const updateSchedule = async (req, res) => {
  const id = req.params.id;
  const { route_id, date, start_time, end_time, status, driver_id, vehicle_id } = req.body;

  if (!route_id || !date || !start_time) {
    return res.status(400).json({ 
      errorCode: 1, 
      message: 'Thiếu thông tin bắt buộc.' 
    });
  }

  try {
    const [result] = await pool.query(
      'UPDATE schedules SET route_id = ?, date = ?, start_time = ?, end_time = ?, status = ?, driver_id = ?, vehicle_id = ? WHERE id = ?',
      [route_id, date, start_time, end_time, status, driver_id || null, vehicle_id || null, id]
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

    // 0. Kiểm tra tài xế đã được phân công ca Sáng hoặc Chiều trong ngày này chưa
    const [existingSchedules] = await connection.query(`
      SELECT s.id, s.shift, r.Name as routeName
      FROM schedules s 
      INNER JOIN routes r ON s.route_id = r.Id
      WHERE s.driver_id = ? AND s.date = ? AND s.status != 'Đã hủy'
    `, [driverId, date]);

    // Kiểm tra conflict cho từng ca sẽ tạo
    const conflictShifts = [];
    if (morningStartTime) {
      const morningConflict = existingSchedules.find(s => s.shift === 'Sáng');
      if (morningConflict) {
        conflictShifts.push(`Sáng (tuyến "${morningConflict.routeName}")`);
      }
    }
    if (afternoonStartTime) {
      const afternoonConflict = existingSchedules.find(s => s.shift === 'Chiều');
      if (afternoonConflict) {
        conflictShifts.push(`Chiều (tuyến "${afternoonConflict.routeName}")`);
      }
    }

    if (conflictShifts.length > 0) {
      await connection.rollback();
      return res.status(400).json({ 
        errorCode: 2, 
        message: `Tài xế đã được phân công ca ${conflictShifts.join(' và ')} trong ngày ${date}. Một tài xế không thể phân công nhiều tuyến trong cùng ca.` 
      });
    }

    // 1. Lấy vehicle_id từ route
    const [routeData] = await connection.query(
      'SELECT VehicleId FROM routes WHERE Id = ?',
      [routeId]
    );
    const vehicleId = routeData[0]?.VehicleId || null;

    // 2. Lấy danh sách TẤT CẢ pickup points trên route (bao gồm điểm trường)
    const [pickupPoints] = await connection.query(
      'SELECT Id, MaHocSinh, PointOrder FROM pickuppoints WHERE RouteId = ? ORDER BY PointOrder ASC',
      [routeId]
    );

    // 3. Tạo schedule ca sáng (nếu có)
    let morningScheduleId = null;
    if (morningStartTime) {
      const [morningResult] = await connection.query(`
        INSERT INTO schedules (route_id, date, start_time, shift, status, driver_id, vehicle_id)
        VALUES (?, ?, ?, 'Sáng', 'Đã phân công', ?, ?)
      `, [routeId, date, morningStartTime, driverId, vehicleId]);
      morningScheduleId = morningResult.insertId;

      // Tạo pickup status records cho ca sáng (bao gồm điểm trường)
      if (pickupPoints.length > 0) {
        for (const point of pickupPoints) {
          let initialStatus = 'Chưa đón';
          if (!point.MaHocSinh) {
            initialStatus = point.PointOrder === 0 ? 'Xuất phát' : 'Điểm cuối';
          }
          await connection.query(
            `INSERT INTO schedule_pickup_status (ScheduleId, PickupPointId, TinhTrangDon) 
             VALUES (?, ?, ?)`,
            [morningScheduleId, point.Id, initialStatus]
          );
        }
      }
    }

    // 4. Tạo schedule ca chiều (nếu có)
    let afternoonScheduleId = null;
    if (afternoonStartTime) {
      const [afternoonResult] = await connection.query(`
        INSERT INTO schedules (route_id, date, start_time, shift, status, driver_id, vehicle_id)
        VALUES (?, ?, ?, 'Chiều', 'Đã phân công', ?, ?)
      `, [routeId, date, afternoonStartTime, driverId, vehicleId]);
      afternoonScheduleId = afternoonResult.insertId;

      // Tạo pickup status records cho ca chiều (bao gồm điểm trường)
      if (pickupPoints.length > 0) {
        for (const point of pickupPoints) {
          let initialStatus = 'Chưa đón';
          if (!point.MaHocSinh) {
            initialStatus = point.PointOrder === 0 ? 'Xuất phát' : 'Điểm cuối';
          }
          await connection.query(
            `INSERT INTO schedule_pickup_status (ScheduleId, PickupPointId, TinhTrangDon) 
             VALUES (?, ?, ?)`,
            [afternoonScheduleId, point.Id, initialStatus]
          );
        }
      }
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
    // Lấy thông tin schedule hiện tại
    const [schedules] = await pool.query(
      'SELECT route_id, date, shift FROM schedules WHERE id = ?',
      [scheduleId]
    );

    if (schedules.length === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy lịch trình.' });
    }

    const { route_id: routeId, date, shift } = schedules[0];

    // Kiểm tra tài xế đã được phân công trong cùng ngày và ca chưa
    const [existingSchedules] = await pool.query(`
      SELECT s.id, r.Name as routeName
      FROM schedules s
      INNER JOIN routes r ON s.route_id = r.Id
      WHERE s.driver_id = ? AND s.date = ? AND s.shift = ? AND s.id != ? AND s.status != 'Đã hủy'
    `, [driverId, date, shift, scheduleId]);

    if (existingSchedules.length > 0) {
      const routeName = existingSchedules[0].routeName;
      return res.status(400).json({ 
        errorCode: 2, 
        message: `Tài xế đã được phân công cho tuyến "${routeName}" vào ca ${shift} ngày ${date}. Một tài xế không thể phân công cho nhiều tuyến trong cùng ca.` 
      });
    }

    // Lấy vehicle_id từ route
    const [routeData] = await pool.query(
      'SELECT VehicleId FROM routes WHERE Id = ?',
      [routeId]
    );
    const vehicleId = routeData[0]?.VehicleId || null;

    // Cập nhật driver_id, vehicle_id và status trong schedules
    await pool.query(
      "UPDATE schedules SET driver_id = ?, vehicle_id = ?, status = 'Đã phân công' WHERE id = ?",
      [driverId, vehicleId, scheduleId]
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
        // Lấy TẤT CẢ pickup points của route (bao gồm điểm trường)
        const [pickupPoints] = await connection.query(
          'SELECT Id, MaHocSinh, PointOrder FROM pickuppoints WHERE RouteId = ? ORDER BY PointOrder ASC',
          [route.Id]
        );

        // Tạo ca sáng
        const [morningResult] = await connection.query(
          `INSERT INTO schedules (route_id, date, start_time, shift, status) 
           VALUES (?, ?, '07:00:00', 'Sáng', 'Chưa phân công')`,
          [route.Id, date]
        );
        createdCount++;

        // Tạo pickup status cho ca sáng (bao gồm điểm trường)
        if (pickupPoints.length > 0) {
          for (const point of pickupPoints) {
            let initialStatus = 'Chưa đón';
            if (!point.MaHocSinh) {
              initialStatus = point.PointOrder === 0 ? 'Xuất phát' : 'Điểm cuối';
            }
            await connection.query(
              `INSERT INTO schedule_pickup_status (ScheduleId, PickupPointId, TinhTrangDon) 
               VALUES (?, ?, ?)`,
              [morningResult.insertId, point.Id, initialStatus]
            );
          }
        }

        // Tạo ca chiều
        const [afternoonResult] = await connection.query(
          `INSERT INTO schedules (route_id, date, start_time, shift, status) 
           VALUES (?, ?, '16:00:00', 'Chiều', 'Chưa phân công')`,
          [route.Id, date]
        );
        createdCount++;

        // Tạo pickup status cho ca chiều (bao gồm điểm trường)
        if (pickupPoints.length > 0) {
          for (const point of pickupPoints) {
            let initialStatus = 'Chưa đón';
            if (!point.MaHocSinh) {
              initialStatus = point.PointOrder === 0 ? 'Xuất phát' : 'Điểm cuối';
            }
            await connection.query(
              `INSERT INTO schedule_pickup_status (ScheduleId, PickupPointId, TinhTrangDon) 
               VALUES (?, ?, ?)`,
              [afternoonResult.insertId, point.Id, initialStatus]
            );
          }
        }
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
