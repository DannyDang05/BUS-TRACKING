import { pool } from "../config/connectDB.js";
import RouteOptimizationService from "../service/RouteOptimizationService.js";

// GET /api/v1/routes
const getAllRoutes = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const q = req.query.q ? String(req.query.q).trim() : null;
  const offset = (page - 1) * limit;

  try {
    let where = '';
    const params = [];
    if (q) {
      where = ' WHERE MaTuyen LIKE ? OR Name LIKE ? OR Status LIKE ? ';
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    const countSql = `SELECT COUNT(*) as total FROM routes ${where}`;
    const [countRows] = await pool.query(countSql, params);
    const totalItems = countRows[0].total || 0;

    const dataSql = `SELECT Id, MaTuyen, Name, DriverId, VehicleId, Status FROM routes ${where} ORDER BY Id LIMIT ? OFFSET ?`;
    const dataParams = params.concat([limit, offset]);
    const [rows] = await pool.query(dataSql, dataParams);

    const totalPages = Math.ceil(totalItems / limit);
    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: rows,
      meta: { totalItems, totalPages, currentPage: page, pageSize: limit },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/routes
const createRoute = async (req, res) => {
  const { MaTuyen, Name, DriverId, VehicleId, Status } = req.body;
  
  if (!MaTuyen || !Name) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (MaTuyen, Name).' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO routes (MaTuyen, Name, DriverId, VehicleId, Status) VALUES (?, ?, ?, ?, ?)',
      [MaTuyen, Name, DriverId, VehicleId, Status || 'Chưa chạy']
    );
    return res.status(201).json({ errorCode: 0, message: 'Tạo tuyến thành công!', routeId: result.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ errorCode: 2, message: 'Mã tuyến đã tồn tại.' });
    }
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/routes/:id
const getRouteDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query(
      'SELECT Id, MaTuyen, Name, DriverId, VehicleId, Status FROM routes WHERE Id = ?', [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy tuyến.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'OK', data: rows[0] });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// PUT /api/v1/routes/:id
const updateRoute = async (req, res) => {
  const id = req.params.id;
  const { MaTuyen, Name, DriverId, VehicleId, Status } = req.body;

  if (!MaTuyen || !Name) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin bắt buộc.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE routes SET MaTuyen = ?, Name = ?, DriverId = ?, VehicleId = ?, Status = ? WHERE Id = ?',
      [MaTuyen, Name, DriverId, VehicleId, Status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy tuyến.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'Cập nhật tuyến thành công.' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// DELETE /api/v1/routes/:id
const deleteRoute = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM routes WHERE Id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy tuyến.' });
    }
    return res.status(200).json({ errorCode: 0, message: 'Xóa tuyến thành công.' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// POST /api/v1/routes/auto-optimize
const autoOptimizeRoutes = async (req, res) => {
  try {
    // Get school location from request or use default (HCMC center)
    const schoolLocation = req.body.schoolLocation || { lat: 10.7769, lon: 106.7009 };
    
    console.log('📍 Vị trí trường:', schoolLocation);
    console.log('💾 Lưu vào DB:', req.body.saveToDb);
    
    // Run optimization
    const result = await RouteOptimizationService.autoAssignRoutes(schoolLocation);
    
    if (!result.success) {
      return res.status(400).json({ errorCode: 1, message: result.message });
    }

    // Optionally save to DB if requested
    if (req.body.saveToDb) {
      console.log('💾 Đang lưu routes vào DB...');
      const saveResult = await RouteOptimizationService.saveRoutesToDB(result.routes);
      if (!saveResult.success) {
        return res.status(500).json({ errorCode: -1, message: saveResult.message });
      }
      console.log('✅ Đã lưu routes vào DB');

      // Tự động tạo schedule cho các tuyến vừa tạo
      console.log('📅 Đang tạo schedules cho các tuyến...');
      const createdRouteIds = saveResult.routeIds || [];
      if (createdRouteIds.length > 0) {
        const schedulePromises = createdRouteIds.map(async (routeId) => {
          // Tạo 2 schedule mỗi ngày: buổi sáng (đón) và buổi chiều (trả)
          const morningSchedule = await pool.query(
            'INSERT INTO schedules (route_id, date, start_time, status) VALUES (?, CURDATE(), "06:30:00", 1)',
            [routeId]
          );
          const afternoonSchedule = await pool.query(
            'INSERT INTO schedules (route_id, date, start_time, status) VALUES (?, CURDATE(), "16:30:00", 1)',
            [routeId]
          );
          return { routeId, morning: morningSchedule, afternoon: afternoonSchedule };
        });
        
        await Promise.all(schedulePromises);
        console.log(`✅ Đã tạo ${createdRouteIds.length * 2} schedules (sáng & chiều)`);
      }
    }

    return res.status(200).json({
      errorCode: 0,
      message: result.message,
      data: {
        routes: result.routes,
        totalStudents: result.totalStudents,
        totalRoutes: result.totalRoutes
      }
    });
  } catch (e) {
    console.error('❌ Error in autoOptimizeRoutes:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server: ' + e.message });
  }
};

// GET /api/v1/routes/students-by-route
const getStudentsByRoute = async (req, res) => {
  try {
    // Lấy thông tin routes
    const [routes] = await pool.query(`
      SELECT 
        r.Id as RouteId,
        r.MaTuyen,
        r.Name as RouteName,
        r.Status,
        r.TotalDistance,
        r.EstimatedTime,
        v.LicensePlate,
        v.Model,
        v.Capacity,
        d.FullName as DriverName,
        d.PhoneNumber as DriverPhone,
        COUNT(DISTINCT p.Id) as StudentCount
      FROM routes r
      LEFT JOIN vehicles v ON r.VehicleId = v.Id
      LEFT JOIN drivers d ON r.DriverId = d.Id
      LEFT JOIN pickuppoints p ON p.RouteId = r.Id
      GROUP BY r.Id
      ORDER BY r.Id
    `);

    // Lấy chi tiết học sinh cho từng tuyến (từ pickuppoints)
    for (let route of routes) {
      const [pickupPoints] = await pool.query(`
        SELECT 
          p.Id as PickupPointId,
          p.MaHocSinh,
          p.PointOrder,
          p.DiaChi,
          p.Latitude,
          p.Longitude,
          p.TinhTrangDon,
          h.HoTen,
          h.Lop,
          h.MaPhuHuynh,
          ph.HoTen as TenPhuHuynh,
          ph.SoDienThoai as SDTPhuHuynh
        FROM pickuppoints p
        LEFT JOIN hocsinh h ON p.MaHocSinh = h.MaHocSinh
        LEFT JOIN phuhuynh ph ON h.MaPhuHuynh = ph.MaPhuHuynh
        WHERE p.RouteId = ?
        ORDER BY p.PointOrder
      `, [route.RouteId]);
      
      route.PickupPoints = pickupPoints;
      route.Students = pickupPoints.map(pp => ({
        MaHocSinh: pp.MaHocSinh,
        HoTen: pp.HoTen,
        Lop: pp.Lop,
        DiaChi: pp.DiaChi,
        TinhTrangDon: pp.TinhTrangDon
      }));
    }

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: routes
    });
  } catch (e) {
    console.error('Error in getStudentsByRoute:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/routes/auto-routes - Lấy RIÊNG các tuyến tự động
const getAutoRoutes = async (req, res) => {
  try {
    console.log('📋 Đang lấy danh sách routes tự động...');
    
    // Lấy thông tin routes TỰ ĐỘNG (MaTuyen LIKE 'AUTO%')
    const [routes] = await pool.query(`
      SELECT 
        r.Id as RouteId,
        r.MaTuyen,
        r.Name as RouteName,
        r.Status,
        r.TotalDistance,
        r.EstimatedTime,
        v.LicensePlate,
        v.Model,
        v.Capacity,
        d.FullName as DriverName,
        d.PhoneNumber as DriverPhone,
        COUNT(DISTINCT p.Id) as StudentCount
      FROM routes r
      LEFT JOIN vehicles v ON r.VehicleId = v.Id
      LEFT JOIN drivers d ON r.DriverId = d.Id
      LEFT JOIN pickuppoints p ON p.RouteId = r.Id
      WHERE r.MaTuyen LIKE 'AUTO%'
      GROUP BY r.Id
      ORDER BY r.MaTuyen
    `);

    console.log(`✅ Tìm thấy ${routes.length} routes tự động`);

    // Lấy chi tiết học sinh cho từng tuyến
    for (let route of routes) {
      const [pickupPoints] = await pool.query(`
        SELECT 
          p.Id as PickupPointId,
          p.MaHocSinh,
          p.PointOrder,
          p.DiaChi,
          p.Latitude,
          p.Longitude,
          p.TinhTrangDon,
          h.HoTen,
          h.Lop,
          h.MaPhuHuynh
        FROM pickuppoints p
        LEFT JOIN hocsinh h ON p.MaHocSinh = h.MaHocSinh
        WHERE p.RouteId = ?
        ORDER BY p.PointOrder
      `, [route.RouteId]);
      
      route.PickupPoints = pickupPoints;
      route.Students = pickupPoints.map(pp => ({
        MaHocSinh: pp.MaHocSinh,
        HoTen: pp.HoTen,
        Lop: pp.Lop,
        DiaChi: pp.DiaChi,
        PointOrder: pp.PointOrder,
        TinhTrangDon: pp.TinhTrangDon
      }));
    }

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: routes,
      totalAutoRoutes: routes.length
    });
  } catch (e) {
    console.error('❌ Error in getAutoRoutes:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

// GET /api/v1/routes/all-with-points - Lấy TẤT CẢ các tuyến kèm điểm đón (cho map)
const getAllRoutesWithPoints = async (req, res) => {
  try {
    console.log('🗺️ Đang lấy tất cả routes với pickup points...');
    
    // Lấy tất cả routes - Try with currentLatitude/currentLongitude first
    let routes;
    try {
      const [routesData] = await pool.query(`
        SELECT 
          r.Id as routeId,
          r.MaTuyen as routeCode,
          r.Name as routeName,
          r.Status as status,
          r.currentLatitude as latitude,
          r.currentLongitude as longitude,
          v.Id as vehicleId,
          v.LicensePlate as licensePlate,
          v.Model,
          v.Capacity,
          d.Id as driverId,
          d.FullName as driverName,
          d.PhoneNumber as driverPhone,
          COUNT(DISTINCT p.Id) as totalStudents
        FROM routes r
        LEFT JOIN vehicles v ON r.VehicleId = v.Id
        LEFT JOIN drivers d ON r.DriverId = d.Id
        LEFT JOIN pickuppoints p ON p.RouteId = r.Id
        GROUP BY r.Id
        ORDER BY r.Id
      `);
      routes = routesData;
    } catch (err) {
      // If currentLatitude/currentLongitude columns don't exist, use fallback query
      console.log('⚠️ currentLatitude/currentLongitude columns not found, using fallback query');
      const [routesData] = await pool.query(`
        SELECT 
          r.Id as routeId,
          r.MaTuyen as routeCode,
          r.Name as routeName,
          r.Status as status,
          NULL as latitude,
          NULL as longitude,
          v.Id as vehicleId,
          v.LicensePlate as licensePlate,
          v.Model,
          v.Capacity,
          d.Id as driverId,
          d.FullName as driverName,
          d.PhoneNumber as driverPhone,
          COUNT(DISTINCT p.Id) as totalStudents
        FROM routes r
        LEFT JOIN vehicles v ON r.VehicleId = v.Id
        LEFT JOIN drivers d ON r.DriverId = d.Id
        LEFT JOIN pickuppoints p ON p.RouteId = r.Id
        GROUP BY r.Id
        ORDER BY r.Id
      `);
      routes = routesData;
    }

    console.log(`✅ Tìm thấy ${routes.length} routes`);

    // Lấy pickup points cho từng route (bao gồm cả điểm trường)
    for (let route of routes) {
      const [pickupPoints] = await pool.query(`
        SELECT 
          p.Id as id,
          p.MaHocSinh,
          p.PointOrder,
          p.DiaChi as address,
          p.Latitude as latitude,
          p.Longitude as longitude,
          p.TinhTrangDon as status,
          h.HoTen as studentName,
          h.Lop as class
        FROM pickuppoints p
        LEFT JOIN hocsinh h ON p.MaHocSinh = h.MaHocSinh
        WHERE p.RouteId = ?
        ORDER BY p.PointOrder
      `, [route.routeId]);
      
      route.pickupPoints = pickupPoints;
      
      // Calculate students picked up (chỉ đếm học sinh, không đếm điểm trường)
      route.pickedUp = pickupPoints.filter(p => p.status === 'Đã đón' && p.MaHocSinh !== null).length;
      route.droppedOff = pickupPoints.filter(p => p.status === 'Đã trả' && p.MaHocSinh !== null).length;
    }

    return res.status(200).json({
      errorCode: 0,
      message: 'OK',
      data: routes,
      totalRoutes: routes.length
    });
  } catch (e) {
    console.error('❌ Error in getAllRoutesWithPoints:', e);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
  }
};

export { 
  getAllRoutes, 
  createRoute, 
  getRouteDetail, 
  updateRoute, 
  deleteRoute,
  autoOptimizeRoutes,
  getStudentsByRoute,
  getAutoRoutes,
  getAllRoutesWithPoints
};
