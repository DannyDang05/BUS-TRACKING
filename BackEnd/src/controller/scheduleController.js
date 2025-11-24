gitimport { pool } from "../config/connectDB.js";

/**
 * GET /api/v1/schedules/driver/:driverId
 * Lấy danh sách lịch làm việc của tài xế theo ngày
 * Query params: date (optional, default: hôm nay)
 */
const getDriverSchedules = async (req, res) => {
  const driverId = req.params.driverId;
  const date = req.query.date || new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  try {
    // Lấy schedules của tài xế join với routes và vehicles
    const [schedules] = await pool.query(`
      SELECT 
        s.id AS scheduleId,
        s.date,
        s.start_time AS startTime,
        s.status,
        r.Id AS routeId,
        r.MaTuyen AS routeCode,
        r.Name AS routeName,
        v.LicensePlate,
        v.Model AS vehicleModel,
        COUNT(DISTINCT pp.Id) AS totalStudents,
        SUM(CASE WHEN pp.TinhTrangDon = 'Đã đón' THEN 1 ELSE 0 END) AS pickedUpCount,
        SUM(CASE WHEN pp.TinhTrangDon = 'Đã trả' THEN 1 ELSE 0 END) AS droppedOffCount
      FROM schedules s
      INNER JOIN routes r ON s.route_id = r.Id
      LEFT JOIN vehicles v ON r.VehicleId = v.Id
      LEFT JOIN pickuppoints pp ON r.Id = pp.RouteId
      WHERE r.DriverId = ? AND s.date = ?
      GROUP BY s.id, s.date, s.start_time, s.status, r.Id, r.MaTuyen, r.Name, v.LicensePlate, v.Model
      ORDER BY s.start_time ASC
    `, [driverId, date]);

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

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: students
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

export { 
  getDriverSchedules, 
  getScheduleStudents,
  updateScheduleStatus
};
