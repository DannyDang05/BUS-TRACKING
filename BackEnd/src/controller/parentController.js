import { pool } from "../config/connectDB.js";

// GET /api/v1/parent/children/:parentId
// Lấy danh sách con và tuyến xe của phụ huynh
const getChildrenRoutes = async (req, res) => {
  const parentId = req.params.parentId;

  try {
    // Query lấy thông tin con, điểm đón, tuyến xe, tài xế
    const sql = `
      SELECT 
        hs.MaHocSinh,
        hs.HoTen as StudentName,
        hs.Lop as Class,
        hs.Latitude as StudentLat,
        hs.Longitude as StudentLng,
        hs.DiaChi as StudentAddress,
        
        pp.Id as pickup_point_id,
        pp.DiaChi as PickupAddress,
        pp.Latitude as PickupLat,
        pp.Longitude as PickupLng,
        
        r.Id as RouteId,
        r.Name as RouteName,
        r.Status as RouteStatus,
        
        v.LicensePlate as VehicleNumber,
        v.Model as VehicleType,
        
        d.FullName as DriverName,
        d.PhoneNumber as DriverPhone,
        
        s.id as schedule_id,
        s.date as ScheduleDate,
        s.start_time as StartTime,
        s.status as ScheduleStatus
        
      FROM hocsinh hs
      LEFT JOIN pickuppoints pp ON pp.MaHocSinh = hs.MaHocSinh
      LEFT JOIN routes r ON r.Id = pp.RouteId
      LEFT JOIN vehicles v ON v.Id = r.VehicleId
      LEFT JOIN drivers d ON d.Id = r.DriverId
      LEFT JOIN schedules s ON s.route_id = r.Id 
        AND s.date = CURDATE()
      WHERE hs.MaPhuHuynh = ?
      ORDER BY hs.HoTen
    `;

    const [rows] = await pool.query(sql, [parentId]);
    
    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: rows
    });
  } catch (e) {
    console.error('❌ Error getting children routes:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/parent/notifications/:parentId
// Lấy thông báo cho phụ huynh
const getParentNotifications = async (req, res) => {
  const parentId = req.params.parentId;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 20, 1);
  const offset = (page - 1) * limit;

  try {
    // Lấy tất cả thông báo của phụ huynh từ bảng thongbao_phuhuynh
    const sql = `
      SELECT 
        tb.Id as notification_id,
        tb.MaThongBao as code,
        tb.NoiDung as message,
        tb.LoaiThongBao as type,
        tb.ThoiGian as created_at,
        tb.DaDoc as is_read
      FROM thongbao_phuhuynh tb
      WHERE tb.MaPhuHuynh = ?
      ORDER BY tb.ThoiGian DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(sql, [parentId, limit, offset]);

    // Count total
    const [countRows] = await pool.query(
      'SELECT COUNT(*) as total FROM thongbao_phuhuynh WHERE MaPhuHuynh = ?',
      [parentId]
    );
    const totalItems = countRows[0].total || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: rows,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (e) {
    console.error('❌ Error getting parent notifications:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/parent/notifications/:notificationId/mark-read
// Đánh dấu thông báo đã đọc
const markNotificationRead = async (req, res) => {
  const notificationId = req.params.notificationId;

  try {
    const [result] = await pool.query(
      'UPDATE thongbao_phuhuynh SET DaDoc = 1 WHERE Id = ?',
      [notificationId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy thông báo.' });
    }

    return res.status(200).json({ errorCode: 0, message: 'Đã đánh dấu đọc.' });
  } catch (e) {
    console.error('❌ Error marking notification read:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/parent/notifications/mark-all-read/:parentId
// Đánh dấu tất cả thông báo đã đọc
const markAllNotificationsRead = async (req, res) => {
  const parentId = req.params.parentId;

  try {
    await pool.query(
      'UPDATE thongbao_phuhuynh SET DaDoc = 1 WHERE MaPhuHuynh = ? AND DaDoc = 0',
      [parentId]
    );

    return res.status(200).json({ errorCode: 0, message: 'Đã đánh dấu tất cả đọc.' });
  } catch (e) {
    console.error('❌ Error marking all notifications read:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/parent/vehicle-tracking/:studentId
// Lấy thông tin tracking thời gian thực của xe bus cho học sinh cụ thể
const getVehicleTracking = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Query lấy vị trí xe bus từ simulation hoặc tracking
    const sql = `
      SELECT 
        r.Id as route_id,
        r.Name as route_name,
        r.currentLatitude as VehicleLat,
        r.currentLongitude as VehicleLng,
        
        v.LicensePlate as vehicle_number,
        v.Model as VehicleType,
        
        d.FullName as DriverName,
        d.PhoneNumber as DriverPhone,
        
        pp.Latitude as StudentPickupLat,
        pp.Longitude as StudentPickupLng,
        pp.DiaChi as StudentPickupAddress,
        
        sim.current_latitude,
        sim.current_longitude,
        sim.speed,
        sim.updated_at as LastUpdate
        
      FROM hocsinh hs
      INNER JOIN pickuppoints pp ON pp.MaHocSinh = hs.MaHocSinh
      INNER JOIN routes r ON r.Id = pp.RouteId
      LEFT JOIN vehicles v ON v.Id = r.VehicleId
      LEFT JOIN drivers d ON d.Id = r.DriverId
      LEFT JOIN simulations sim ON sim.route_id = r.Id AND sim.status = 'running'
      WHERE hs.MaHocSinh = ?
    `;

    const [rows] = await pool.query(sql, [studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        errorCode: 3, 
        message: 'Không tìm thấy thông tin tuyến xe cho học sinh này.' 
      });
    }

    const trackingData = rows[0];

    // Nếu có simulation đang chạy, dùng current position
    if (trackingData.current_latitude && trackingData.current_longitude) {
      trackingData.VehicleLat = trackingData.current_latitude;
      trackingData.VehicleLng = trackingData.current_longitude;
    }

    // Calculate distance from vehicle to student pickup
    if (trackingData.VehicleLat && trackingData.VehicleLng && 
        trackingData.StudentPickupLat && trackingData.StudentPickupLng) {
      
      const distance = calculateDistance(
        trackingData.VehicleLat,
        trackingData.VehicleLng,
        trackingData.StudentPickupLat,
        trackingData.StudentPickupLng
      );
      
      trackingData.DistanceToPickup = Math.round(distance);
      
      // Estimate arrival time
      const avgSpeed = trackingData.speed || 30; // km/h
      const timeInMinutes = Math.round((distance / 1000) / avgSpeed * 60);
      trackingData.EstimatedArrival = timeInMinutes;

      // Status
      if (distance < 100) {
        trackingData.Status = 'arrived';
      } else if (distance < 500) {
        trackingData.Status = 'approaching';
      } else {
        trackingData.Status = 'far';
      }
    }

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: trackingData
    });
  } catch (e) {
    console.error('❌ Error getting vehicle tracking:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// Helper function to calculate distance (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export { 
  getChildrenRoutes, 
  getParentNotifications, 
  markNotificationRead,
  markAllNotificationsRead,
  getVehicleTracking 
};
