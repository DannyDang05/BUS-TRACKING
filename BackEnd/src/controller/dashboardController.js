import { pool } from "../config/connectDB.js";

/**
 * GET /api/v1/dashboard/stats
 * Lấy thống kê tổng quan cho trang chủ admin
 */
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Tổng số xe buýt
    const [vehiclesCount] = await pool.query(
      'SELECT COUNT(*) as total FROM vehicles'
    );

    // 2. Tổng số tài xế
    const [driversCount] = await pool.query(
      'SELECT COUNT(*) as total FROM drivers'
    );

    // 3. Tổng số tuyến
    const [routesCount] = await pool.query(
      'SELECT COUNT(*) as total FROM routes'
    );

    // 4. Tổng số học sinh
    const [studentsCount] = await pool.query(
      'SELECT COUNT(*) as total FROM hocsinh'
    );

    // 5. Tổng số lịch trình (schedules)
    const [schedulesCount] = await pool.query(
      'SELECT COUNT(*) as total FROM schedules'
    );

    // 6. Số lịch đang hoạt động hôm nay
    const [activeTodayCount] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM schedules 
       WHERE date = ? AND status IN ('Đang chạy', 'Sắp diễn ra')`,
      [today]
    );

    // 7. Thống kê chuyến đi hôm nay
    const [todaySchedules] = await pool.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Hoàn thành' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'Đang chạy' THEN 1 ELSE 0 END) as running,
        SUM(CASE WHEN status IN ('Sắp diễn ra', 'Đã phân công') THEN 1 ELSE 0 END) as upcoming
       FROM schedules 
       WHERE date = ?`,
      [today]
    );

    // 8. Số lịch trễ (end_time đã qua nhưng status != 'Hoàn thành')
    const currentTime = new Date().toTimeString().split(' ')[0];
    const [delayedCount] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM schedules 
       WHERE date = ? 
       AND end_time < ? 
       AND status NOT IN ('Hoàn thành', 'Đã hủy')`,
      [today, currentTime]
    );

    const todayStats = todaySchedules[0];

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: {
        totalBuses: vehiclesCount[0].total,
        totalDrivers: driversCount[0].total,
        totalRoutes: routesCount[0].total,
        totalStudents: studentsCount[0].total,
        totalSchedules: schedulesCount[0].total,
        activeToday: activeTodayCount[0].total,
        todayTrips: {
          total: todayStats.total,
          completed: todayStats.completed || 0,
          running: todayStats.running || 0,
          upcoming: todayStats.upcoming || 0,
          delayed: delayedCount[0].total
        }
      }
    });

  } catch (error) {
    console.error('❌ Error in getDashboardStats:', error);
    return res.status(500).json({
      errorCode: -1,
      message: 'Lỗi server khi lấy thống kê.'
    });
  }
};

/**
 * GET /api/v1/dashboard/recent-activities
 * Lấy hoạt động gần đây (schedules completed trong 7 ngày qua)
 */
const getRecentActivities = async (req, res) => {
  try {
    const [activities] = await pool.query(
      `SELECT 
        s.id,
        s.date,
        s.shift,
        s.status,
        s.start_time,
        s.end_time,
        r.MaTuyen as routeCode,
        r.Name as routeName,
        d.FullName as driverName,
        v.LicensePlate
       FROM schedules s
       INNER JOIN routes r ON s.route_id = r.Id
       LEFT JOIN drivers d ON s.driver_id = d.Id
       LEFT JOIN vehicles v ON s.vehicle_id = v.Id
       WHERE s.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       ORDER BY s.date DESC, s.start_time DESC
       LIMIT 10`
    );

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: activities
    });

  } catch (error) {
    console.error('❌ Error in getRecentActivities:', error);
    return res.status(500).json({
      errorCode: -1,
      message: 'Lỗi server khi lấy hoạt động gần đây.'
    });
  }
};

export {
  getDashboardStats,
  getRecentActivities
};
