import { pool } from "../config/connectDB.js";

// GET /api/v1/parent/children/:parentId
// Lấy danh sách con và tuyến xe của phụ huynh
const getChildrenRoutes = async (req, res) => {
  const parentId = req.params.parentId;

  try {
    // Query lấy thông tin con, điểm đón, tuyến xe, tài xế + pickup status
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
        r.currentLatitude as VehicleLat,
        r.currentLongitude as VehicleLng,
        
        v.LicensePlate as VehicleNumber,
        v.Model as VehicleType,
        v.SpeedKmh as VehicleSpeed,
        
        d.FullName as DriverName,
        d.PhoneNumber as DriverPhone,
        
        s.id as schedule_id,
        s.date as ScheduleDate,
        s.start_time as StartTime,
        s.shift as Shift,
        s.status as ScheduleStatus,
        
        sps.TinhTrangDon as PickupStatus,
        sps.ThoiGianDonThucTe as ActualPickupTime
        
      FROM hocsinh hs
      LEFT JOIN pickuppoints pp ON pp.MaHocSinh = hs.MaHocSinh
      LEFT JOIN routes r ON r.Id = pp.RouteId
      LEFT JOIN vehicles v ON v.Id = r.VehicleId
      LEFT JOIN drivers d ON d.Id = r.DriverId
      LEFT JOIN schedules s ON s.route_id = r.Id 
        AND s.date = CURDATE()
      LEFT JOIN schedule_pickup_status sps ON sps.ScheduleId = s.id 
        AND sps.PickupPointId = pp.Id
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
    // Query lấy vị trí xe bus từ routes (real-time tracking)
    const sql = `
      SELECT 
        r.Id as route_id,
        r.Name as route_name,
        r.MaTuyen as route_code,
        r.currentLatitude as VehicleLat,
        r.currentLongitude as VehicleLng,
        r.Status as route_status,
        r.lastUpdated as LastUpdate,
        
        v.LicensePlate as vehicle_number,
        v.Model as VehicleType,
        v.SpeedKmh as speed,
        
        d.FullName as DriverName,
        d.PhoneNumber as DriverPhone,
        
        pp.Latitude as StudentPickupLat,
        pp.Longitude as StudentPickupLng,
        pp.DiaChi as StudentPickupAddress,
        pp.PointOrder,
        
        s.id as schedule_id,
        s.date as schedule_date,
        s.start_time,
        s.status as schedule_status
        
      FROM hocsinh hs
      INNER JOIN pickuppoints pp ON pp.MaHocSinh = hs.MaHocSinh
      INNER JOIN routes r ON r.Id = pp.RouteId
      LEFT JOIN vehicles v ON v.Id = r.VehicleId
      LEFT JOIN drivers d ON d.Id = r.DriverId
      LEFT JOIN schedules s ON s.route_id = r.Id AND s.date = CURDATE()
      WHERE hs.MaHocSinh = ?
      ORDER BY s.start_time DESC
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        errorCode: 3, 
        message: 'Không tìm thấy thông tin tuyến xe cho học sinh này.' 
      });
    }

    const trackingData = rows[0];

    // Nếu không có vị trí real-time, trả về thông báo
    if (!trackingData.VehicleLat || !trackingData.VehicleLng) {
      trackingData.VehicleLat = null;
      trackingData.VehicleLng = null;
      trackingData.Status = 'no_tracking';
      trackingData.message = 'Xe chưa bắt đầu chạy hoặc không có dữ liệu vị trí';
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

// GET /api/v1/parent/info/:parentId
// Lấy thông tin chi tiết phụ huynh
const getParentInfo = async (req, res) => {
  const parentId = req.params.parentId;

  try {
    const sql = `
      SELECT 
        ph.MaPhuHuynh as Id,
        ph.HoTen as FullName,
        ph.SoDienThoai as PhoneNumber,
        ph.Nhanthongbao as NotificationEnabled,
        u.Username,
        u.Role
      FROM phuhuynh ph
      LEFT JOIN users u ON u.ProfileId = ph.MaPhuHuynh AND u.Role = 'parent'
      WHERE ph.MaPhuHuynh = ?
    `;

    const [rows] = await pool.query(sql, [parentId]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        errorCode: 3, 
        message: 'Không tìm thấy thông tin phụ huynh.' 
      });
    }

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: rows[0]
    });
  } catch (e) {
    console.error('❌ Error getting parent info:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/parent/vehicle-eta/:studentId
// Lấy thông tin ETA (Estimated Time of Arrival) chính xác
const getVehicleETA = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const sql = `
      SELECT 
        r.Id as route_id,
        r.Name as route_name,
        r.currentLatitude as VehicleLat,
        r.currentLongitude as VehicleLng,
        r.lastUpdated as LastUpdate,
        
        v.SpeedKmh as current_speed,
        
        pp.Latitude as PickupLat,
        pp.Longitude as PickupLng,
        pp.DiaChi as PickupAddress,
        
        s.id as schedule_id,
        s.start_time,
        s.status as schedule_status,
        s.shift,
        
        sps.TinhTrangDon as pickup_status
        
      FROM hocsinh hs
      INNER JOIN pickuppoints pp ON pp.MaHocSinh = hs.MaHocSinh
      INNER JOIN routes r ON r.Id = pp.RouteId
      LEFT JOIN vehicles v ON v.Id = r.VehicleId
      LEFT JOIN schedules s ON s.route_id = r.Id AND s.date = CURDATE()
      LEFT JOIN schedule_pickup_status sps ON sps.ScheduleId = s.id AND sps.PickupPointId = pp.Id
      WHERE hs.MaHocSinh = ?
      ORDER BY s.start_time DESC
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        errorCode: 3, 
        message: 'Không tìm thấy thông tin xe cho học sinh này.' 
      });
    }

    const data = rows[0];
    const result = {
      routeId: data.route_id,
      routeName: data.route_name,
      scheduleStatus: data.schedule_status,
      pickupStatus: data.pickup_status,
      shift: data.shift,
      distance: null,
      eta: null,
      vehicleStatus: 'unknown',
      currentSpeed: data.current_speed || 0,
      isDelayed: false,
      delayMinutes: 0
    };

    // Nếu xe đang chạy và có vị trí
    if (data.VehicleLat && data.VehicleLng && data.PickupLat && data.PickupLng) {
      const distance = calculateDistance(
        data.VehicleLat,
        data.VehicleLng,
        data.PickupLat,
        data.PickupLng
      );
      
      result.distance = Math.round(distance);
      
      // Tính ETA
      const avgSpeed = data.current_speed || 30;
      const timeInMinutes = Math.round((distance / 1000) / avgSpeed * 60);
      result.eta = timeInMinutes;

      // Xác định status
      if (distance < 100) {
        result.vehicleStatus = 'arrived';
      } else if (distance < 500) {
        result.vehicleStatus = 'approaching';
      } else {
        result.vehicleStatus = 'moving';
      }

      // Kiểm tra trễ
      if (data.start_time && data.schedule_status === 'Đang chạy') {
        const delay = calculateDelay(data.start_time, data.LastUpdate);
        if (delay > 15) {
          result.isDelayed = true;
          result.delayMinutes = delay;
        }
      }
    }

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: result
    });
  } catch (e) {
    console.error('❌ Error getting vehicle ETA:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// Helper: Tính delay (phút)
function calculateDelay(startTime, lastUpdate) {
  if (!startTime || !lastUpdate) return 0;
  
  const now = new Date();
  const [hours, minutes] = startTime.split(':');
  const scheduled = new Date();
  scheduled.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  const diffMs = now - scheduled;
  const diffMins = Math.floor(diffMs / 60000);
  
  return Math.max(0, diffMins);
}

export { 
  getChildrenRoutes, 
  getParentNotifications, 
  markNotificationRead,
  markAllNotificationsRead,
  getVehicleTracking,
  getParentInfo,
  getVehicleETA
};
