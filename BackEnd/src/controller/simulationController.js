import { pool } from "../config/connectDB.js";
import parentNotificationService from "../service/ParentNotificationService.js";

// Store active simulations
const activeSimulations = new Map();

// Track which pickup points have been processed (to avoid duplicate notifications)
const processedPickups = new Map();

// START /api/v1/simulation/start-trip
const startTripSimulation = async (req, res) => {
  const { scheduleId } = req.body;
  
  if (!scheduleId) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu scheduleId' });
  }

  try {
    // Get schedule and route info
    const [schedules] = await pool.query(`
      SELECT s.*, r.Id as routeId, r.MaTuyen, r.Name as routeName
      FROM schedules s
      INNER JOIN routes r ON s.route_id = r.Id
      WHERE s.id = ?
    `, [scheduleId]);

    if (schedules.length === 0) {
      return res.status(404).json({ errorCode: 2, message: 'Không tìm thấy schedule' });
    }

    const schedule = schedules[0];
    const routeId = schedule.routeId;

    // Get pickup points for this SCHEDULE (from schedule_pickup_status, not pickuppoints)
    // LỌC BỎ các điểm có TinhTrangDon = 'Vắng' để không đi qua điểm học sinh vắng mặt
    const [pickupPoints] = await pool.query(`
      SELECT 
        p.Id,
        p.MaHocSinh,
        p.PointOrder,
        p.Latitude,
        p.Longitude,
        p.DiaChi,
        sps.TinhTrangDon,
        sps.ScheduleId
      FROM pickuppoints p
      INNER JOIN schedule_pickup_status sps ON sps.PickupPointId = p.Id
      WHERE sps.ScheduleId = ? 
        AND (p.MaHocSinh IS NULL OR sps.TinhTrangDon != 'Vắng')
      ORDER BY p.PointOrder ASC
    `, [scheduleId]);
    
    console.log(`📍 Active pickup points (excluding absent students): ${pickupPoints.length}`);

    if (pickupPoints.length === 0) {
      return res.status(400).json({ errorCode: 3, message: 'Tuyến không có điểm đón nào' });
    }

    // Get route coordinates using Mapbox Directions API
    // Split into chunks of 25 points (Mapbox limit)
    const mapboxToken = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';
    const chunkSize = 25;
    const chunks = [];
    
    for (let i = 0; i < pickupPoints.length; i += chunkSize - 1) {
      const chunk = pickupPoints.slice(i, i + chunkSize);
      if (chunk.length >= 2) {
        chunks.push(chunk);
      }
    }

    console.log(`📦 Split ${pickupPoints.length} points into ${chunks.length} chunks`);

    let allCoordinates = [];

    // Fetch route for each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const coordinates = chunk.map(p => `${p.Longitude},${p.Latitude}`).join(';');
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxToken}`;

      console.log(`🚗 Fetching route for chunk ${i + 1}/${chunks.length} (${chunk.length} points)`);

      try {
        // Add timeout for fetch request (5 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(directionsUrl, { 
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        clearTimeout(timeoutId);
        
        const directionsData = await response.json();

        if (directionsData.code === 'Ok' && directionsData.routes && directionsData.routes.length > 0) {
          const chunkCoords = directionsData.routes[0].geometry.coordinates;
          allCoordinates = allCoordinates.concat(chunkCoords);
          console.log(`✅ Got ${chunkCoords.length} coordinates for chunk ${i + 1}`);
        } else {
          console.warn(`⚠️ Failed to get route for chunk ${i + 1}, using straight lines`);
          allCoordinates = allCoordinates.concat(chunk.map(p => [p.Longitude, p.Latitude]));
        }
      } catch (error) {
        console.error(`❌ Error fetching route for chunk ${i + 1}:`, error.message);
        console.log(`⚠️ Using fallback straight line coordinates for chunk ${i + 1}`);
        allCoordinates = allCoordinates.concat(chunk.map(p => [p.Longitude, p.Latitude]));
      }
    }

    if (allCoordinates.length === 0) {
      return res.status(400).json({ errorCode: 4, message: 'Không thể tính toán route' });
    }

    const routeGeometry = allCoordinates;
    console.log(`✅ Total route coordinates: ${routeGeometry.length}`);
    
    // Update schedule status to "Đang chạy"
    await pool.query('UPDATE schedules SET status = ? WHERE id = ?', ['Đang chạy', scheduleId]);
    
    // Update route status
    await pool.query('UPDATE routes SET Status = ? WHERE Id = ?', ['Đang chạy', routeId]);

    // Start simulation
    startSimulation(scheduleId, routeId, routeGeometry, pickupPoints);

    return res.status(200).json({
      errorCode: 0,
      message: 'Đã bắt đầu hành trình (simulation)',
      data: {
        scheduleId,
        routeId,
        totalPoints: routeGeometry.length,
        pickupPoints: pickupPoints.length
      }
    });

  } catch (error) {
    console.error('Error starting trip simulation:', error);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server: ' + error.message });
  }
};

// STOP /api/v1/simulation/stop-trip
const stopTripSimulation = async (req, res) => {
  const { scheduleId } = req.body;

  if (!scheduleId) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu scheduleId' });
  }

  if (activeSimulations.has(scheduleId)) {
    const simulation = activeSimulations.get(scheduleId);
    clearInterval(simulation.intervalId);
    activeSimulations.delete(scheduleId);

    try {
      // Update schedule status
      await pool.query('UPDATE schedules SET status = ? WHERE id = ?', ['Hoàn thành', scheduleId]);
      
      // Get route ID and update route status
      const [schedules] = await pool.query('SELECT route_id FROM schedules WHERE id = ?', [scheduleId]);
      if (schedules.length > 0) {
        await pool.query('UPDATE routes SET Status = ?, currentLatitude = NULL, currentLongitude = NULL WHERE Id = ?', 
          ['Đã hoàn thành', schedules[0].route_id]);
      }

      return res.status(200).json({
        errorCode: 0,
        message: 'Đã dừng hành trình'
      });
    } catch (error) {
      console.error('Error stopping trip:', error);
      return res.status(500).json({ errorCode: -1, message: 'Lỗi server' });
    }
  } else {
    return res.status(404).json({ errorCode: 2, message: 'Không tìm thấy simulation đang chạy' });
  }
};

// SIMULATION LOGIC
const startSimulation = async (scheduleId, routeId, routeCoordinates, pickupPoints) => {
  let currentIndex = 0;
  const totalPoints = routeCoordinates.length;
  const updateInterval = 1000; // Update every 1 second
  const stepsPerUpdate = Math.max(2, Math.floor(totalPoints / 1000)); // Larger steps = shorter distance per update

  console.log(`🚍 Starting simulation for schedule ${scheduleId}, route ${routeId}`);
  console.log(`   Total coordinates: ${totalPoints}, Steps per update: ${stepsPerUpdate}`);

  // CẬP NHẬT VỊ TRÍ ĐẦU TIÊN NGAY LẬP TỨC
  if (routeCoordinates.length > 0) {
    const [lng, lat] = routeCoordinates[0];
    try {
      await pool.query(
        'UPDATE routes SET currentLatitude = ?, currentLongitude = ?, lastUpdated = NOW() WHERE Id = ?',
        [lat, lng, routeId]
      );
      console.log(`✅ Initial position set: [${lat}, ${lng}]`);
    } catch (error) {
      console.error('Error setting initial position:', error);
    }
  }

  const intervalId = setInterval(async () => {
    if (currentIndex >= totalPoints) {
      // Simulation complete
      console.log(`✅ Simulation complete for schedule ${scheduleId}`);
      clearInterval(intervalId);
      activeSimulations.delete(scheduleId);
      
      // Cleanup processed pickups for this schedule
      for (const key of processedPickups.keys()) {
        if (key.startsWith(`${scheduleId}_`)) {
          processedPickups.delete(key);
        }
      }

      // Update final status
      try {
        await pool.query('UPDATE schedules SET status = ?, end_time = NOW() WHERE id = ?', ['Hoàn thành', scheduleId]);
        await pool.query('UPDATE routes SET Status = ?, currentLatitude = NULL, currentLongitude = NULL WHERE Id = ?', 
          ['Đã hoàn thành', routeId]);
      } catch (error) {
        console.error('Error updating final status:', error);
      }
      return;
    }

    const [lng, lat] = routeCoordinates[currentIndex];

    // Update current position in database
    try {
      await pool.query(
        'UPDATE routes SET currentLatitude = ?, currentLongitude = ?, lastUpdated = NOW() WHERE Id = ?',
        [lat, lng, routeId]
      );

      // Check if near any pickup point (proximity notifications + auto-update status)
      for (const point of pickupPoints) {
        // Bỏ qua điểm trường (MaHocSinh = NULL)
        if (!point.MaHocSinh) continue;
        
        const distance = calculateDistance(lat, lng, point.Latitude, point.Longitude);
        const distanceMeters = distance * 1000; // Convert km to meters
        
        // Lấy thông tin parent và student
        const [studentInfo] = await pool.query(
          `SELECT hs.MaPhuHuynh as parent_id, hs.HoTen as student_name, pp.DiaChi as pickup_address
           FROM pickuppoints pp
           JOIN hocsinh hs ON pp.MaHocSinh = hs.MaHocSinh
           WHERE pp.Id = ?`,
          [point.Id]
        );
        
        if (studentInfo.length === 0) continue;
        const { parent_id, student_name, pickup_address } = studentInfo[0];
        
        // Thông báo "đang đến gần" (< 500m, >= 100m)
        if (distanceMeters < 500 && distanceMeters >= 100) {
          const notifyKey = `approaching_${scheduleId}_${point.Id}`;
          if (!processedPickups.has(notifyKey)) {
            // Check status trước khi gửi thông báo
            const [statusCheck] = await pool.query(
              'SELECT TinhTrangDon FROM schedule_pickup_status WHERE ScheduleId = ? AND PickupPointId = ?',
              [scheduleId, point.Id]
            );
            const currentStatus = statusCheck.length > 0 ? statusCheck[0].TinhTrangDon : 'Chưa đón';
            
            if (!currentStatus || currentStatus === 'Chưa đón') {
              await parentNotificationService.sendNotificationIfNotSent(
                parent_id,
                'approaching',
                `🚌 Xe sắp tới điểm đón ${student_name}!`,
                `Xe còn cách khoảng ${Math.round(distanceMeters)}m, vui lòng chuẩn bị đón con nhé!`,
                scheduleId,
                point.Id
              );
              processedPickups.set(notifyKey, Date.now());
              console.log(`📢 Sent "approaching" notification to parent ${parent_id}`);
            }
          }
        }
        
        // Thông báo "đã đến" (< 100m, >= 50m)
        if (distanceMeters < 100 && distanceMeters >= 50) {
          const notifyKey = `arrived_${scheduleId}_${point.Id}`;
          if (!processedPickups.has(notifyKey)) {
            // Check status trước khi gửi thông báo
            const [statusCheck] = await pool.query(
              'SELECT TinhTrangDon FROM schedule_pickup_status WHERE ScheduleId = ? AND PickupPointId = ?',
              [scheduleId, point.Id]
            );
            const currentStatus = statusCheck.length > 0 ? statusCheck[0].TinhTrangDon : 'Chưa đón';
            
            if (!currentStatus || currentStatus === 'Chưa đón') {
              await parentNotificationService.sendNotificationIfNotSent(
                parent_id,
                'arrived',
                `📍 Xe đã đến điểm đón ${student_name}!`,
                `Xe bus hiện đang ở rất gần (${Math.round(distanceMeters)}m), con có thể lên xe ngay!`,
                scheduleId,
                point.Id
              );
              processedPickups.set(notifyKey, Date.now());
              console.log(`📢 Sent "arrived" notification to parent ${parent_id}`);
            }
          }
        }
        
        // Tự động đánh dấu "Đã đón" (< 50m)
        const pickupKey = `pickup_${scheduleId}_${point.Id}`;
        if (distanceMeters < 50 && !processedPickups.has(pickupKey)) {
          const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
          
          try {
            // Kiểm tra trạng thái hiện tại
            const [existing] = await pool.query(
              'SELECT TinhTrangDon FROM schedule_pickup_status WHERE ScheduleId = ? AND PickupPointId = ?',
              [scheduleId, point.Id]
            );
            
            const currentStatus = existing.length > 0 ? existing[0].TinhTrangDon : null;
            
            // Chỉ cập nhật nếu chưa đón hoặc chưa có record
            if (!currentStatus || currentStatus === 'Chưa đón') {
              if (existing.length > 0) {
                // Update existing record
                await pool.query(
                  `UPDATE schedule_pickup_status 
                   SET TinhTrangDon = ?, ThoiGianDonThucTe = ?
                   WHERE ScheduleId = ? AND PickupPointId = ?`,
                  ['Đã đón', now, scheduleId, point.Id]
                );
              } else {
                // Insert new record
                await pool.query(
                  `INSERT INTO schedule_pickup_status 
                   (ScheduleId, PickupPointId, TinhTrangDon, ThoiGianDonThucTe)
                   VALUES (?, ?, ?, ?)`,
                  [scheduleId, point.Id, 'Đã đón', now]
                );
              }
              
              console.log(`✅ Auto-marked student at pickup point ${point.Id} as "Đã đón"`);
              
              // Gửi thông báo "đã đón"
              const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
              
              await parentNotificationService.sendNotificationIfNotSent(
                parent_id,
                'picked_up',
                `✅ ${student_name} đã lên xe an toàn`,
                `Con đã được tài xế đón tại ${pickup_address || 'điểm đón'} lúc ${currentTime}`,
                scheduleId,
                point.Id
              );
              
              console.log(`📢 Sent "picked up" notification to parent ${parent_id}`);
              
              // Đánh dấu đã xử lý
              processedPickups.set(pickupKey, Date.now());
            }
          } catch (error) {
            console.error(`❌ Error auto-updating pickup status for point ${point.Id}:`, error);
          }
        }
      }

      console.log(`🚗 Updated position: [${lat}, ${lng}] (${currentIndex}/${totalPoints})`);
    } catch (error) {
      console.error('Error updating position:', error);
    }

    currentIndex += stepsPerUpdate;
  }, updateInterval);

  activeSimulations.set(scheduleId, {
    intervalId,
    routeId,
    startTime: new Date(),
    currentIndex: 0,
    totalPoints
  });
};

// Helper: Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// GET active simulations
const getActiveSimulations = (req, res) => {
  const simulations = Array.from(activeSimulations.entries()).map(([scheduleId, data]) => ({
    scheduleId,
    routeId: data.routeId,
    startTime: data.startTime,
    progress: `${data.currentIndex}/${data.totalPoints}`,
    percentage: ((data.currentIndex / data.totalPoints) * 100).toFixed(2) + '%'
  }));

  return res.status(200).json({
    errorCode: 0,
    message: 'OK',
    data: simulations,
    total: simulations.length
  });
};

export {
  startTripSimulation,
  stopTripSimulation,
  getActiveSimulations
};
