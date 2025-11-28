import { Server } from 'socket.io';
import { pool } from '../config/connectDB.js';
import parentNotificationService from './ParentNotificationService.js';

let io = null;

// In-memory storage for bus locations (thay thế Redis)
const busLocations = new Map();

// In-memory cache for sent notifications (thay thế Redis TTL)
const sentNotifications = new Set();

/**
 * Khởi tạo Socket.IO Server
 */
export const initSocketIO = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  console.log('✅ Socket.IO Server initialized');

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Driver gửi GPS location
    socket.on('driver:location', async (data) => {
      try {
        await handleDriverLocation(socket, data);
      } catch (error) {
        console.error('❌ Error handling driver location:', error);
        socket.emit('error', { message: 'Failed to process location' });
      }
    });

    // Parent subscribe bus channel
    socket.on('parent:subscribe', async (data) => {
      try {
        await handleParentSubscribe(socket, data);
      } catch (error) {
        console.error('❌ Error handling parent subscribe:', error);
      }
    });

    // Parent unsubscribe
    socket.on('parent:unsubscribe', (data) => {
      const { busId } = data;
      if (busId) {
        socket.leave(`bus-${busId}`);
        console.log(`📤 Parent ${socket.id} unsubscribed from bus-${busId}`);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Xử lý GPS từ Driver
 */
const handleDriverLocation = async (socket, data) => {
  const { busId, routeId, scheduleId, latitude, longitude, speed, status, timestamp } = data;

  if (!busId || !latitude || !longitude) {
    socket.emit('error', { message: 'Missing required fields' });
    return;
  }

  console.log(`📍 Received GPS from bus ${busId}: [${latitude}, ${longitude}]`);

  const locationData = {
    busId,
    routeId,
    scheduleId,
    latitude,
    longitude,
    speed: speed || 0,
    status: status || 'running',
    timestamp: timestamp || Date.now()
  };

  // Lưu vào memory (thay thế Redis)
  busLocations.set(busId, locationData);
  console.log(`💾 Saved location for bus ${busId} in memory`);

  // Broadcast đến tất cả Parents đang theo dõi bus này
  io.to(`bus-${busId}`).emit('bus:location', locationData);

  // Kiểm tra khoảng cách đến các điểm đón và gửi thông báo
  await checkProximityAndNotify(scheduleId, routeId, latitude, longitude);

  // Confirm lại cho driver
  socket.emit('location:confirmed', { success: true, timestamp: Date.now() });
};

/**
 * Kiểm tra khoảng cách và gửi thông báo tự động
 */
const checkProximityAndNotify = async (scheduleId, routeId, vehicleLat, vehicleLng) => {
  if (!scheduleId || !routeId) return;

  try {
    // Lấy danh sách pickup points
    const [pickupPoints] = await pool.query(`
      SELECT 
        pp.Id as pickup_point_id,
        pp.MaHocSinh as student_id,
        pp.Latitude as pickup_lat,
        pp.Longitude as pickup_lng,
        pp.DiaChi as pickup_address,
        sps.TinhTrangDon as pickup_status,
        hs.MaPhuHuynh as parent_id,
        hs.HoTen as student_name
      FROM pickuppoints pp
      INNER JOIN hocsinh hs ON hs.MaHocSinh = pp.MaHocSinh
      LEFT JOIN schedule_pickup_status sps ON sps.PickupPointId = pp.Id 
        AND sps.ScheduleId = ?
      WHERE pp.RouteId = ?
        AND pp.MaHocSinh IS NOT NULL
    `, [scheduleId, routeId]);

    for (const point of pickupPoints) {
      const distance = calculateDistance(
        vehicleLat,
        vehicleLng,
        point.pickup_lat,
        point.pickup_lng
      );

      const distanceMeters = distance * 1000;

      // Thông báo "đang đến gần" (< 500m)
      if (distanceMeters < 500 && distanceMeters >= 100) {
        const notifyKey = `notify:approaching:${scheduleId}:${point.pickup_point_id}`;
        const alreadySent = sentNotifications.has(notifyKey);
        
        if (!alreadySent && (!point.pickup_status || point.pickup_status === 'Chưa đón')) {
          await parentNotificationService.sendNotificationIfNotSent(
            point.parent_id,
            'approaching',
            `🚌 Xe sắp tới điểm đón ${point.student_name}!`,
            `Xe còn cách khoảng ${Math.round(distanceMeters)}m, vui lòng chuẩn bị đón con nhé!`,
            scheduleId,
            point.pickup_point_id
          );
          sentNotifications.add(notifyKey);
        }
      }

      // Thông báo "đã đến" (< 100m)
      if (distanceMeters < 100 && distanceMeters >= 50) {
        const notifyKey = `notify:arrived:${scheduleId}:${point.pickup_point_id}`;
        const alreadySent = sentNotifications.has(notifyKey);
        
        if (!alreadySent && (!point.pickup_status || point.pickup_status === 'Chưa đón')) {
          await parentNotificationService.sendNotificationIfNotSent(
            point.parent_id,
            'arrived',
            `📍 Xe đã đến điểm đón ${point.student_name}!`,
            `Xe bus hiện đang ở rất gần (${Math.round(distanceMeters)}m), con có thể lên xe ngay!`,
            scheduleId,
            point.pickup_point_id
          );
          sentNotifications.add(notifyKey);
        }
      }

      // Tự động "Đã đón" (< 50m)
      if (distanceMeters < 50) {
        const pickupKey = `auto:pickup:${scheduleId}:${point.pickup_point_id}`;
        const alreadyProcessed = sentNotifications.has(pickupKey);

        if (!alreadyProcessed && (!point.pickup_status || point.pickup_status === 'Chưa đón')) {
          const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

          // Kiểm tra xem đã có record chưa
          const [existing] = await pool.query(
            'SELECT TinhTrangDon FROM schedule_pickup_status WHERE ScheduleId = ? AND PickupPointId = ?',
            [scheduleId, point.pickup_point_id]
          );

          if (existing.length > 0) {
            await pool.query(
              `UPDATE schedule_pickup_status 
               SET TinhTrangDon = ?, ThoiGianDonThucTe = ?
               WHERE ScheduleId = ? AND PickupPointId = ?`,
              ['Đã đón', now, scheduleId, point.pickup_point_id]
            );
          } else {
            await pool.query(
              `INSERT INTO schedule_pickup_status 
               (ScheduleId, PickupPointId, TinhTrangDon, ThoiGianDonThucTe)
               VALUES (?, ?, ?, ?)`,
              [scheduleId, point.pickup_point_id, 'Đã đón', now]
            );
          }

          // Gửi thông báo
          const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          await parentNotificationService.sendNotificationIfNotSent(
            point.parent_id,
            'picked_up',
            `✅ ${point.student_name} đã lên xe an toàn`,
            `Con đã được tài xế đón tại ${point.pickup_address || 'điểm đón'} lúc ${currentTime}`,
            scheduleId,
            point.pickup_point_id
          );

          sentNotifications.add(pickupKey);
          console.log(`✅ Auto-marked ${point.student_name} as "Đã đón"`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error checking proximity:', error);
  }
};

/**
 * Parent subscribe bus channel
 */
const handleParentSubscribe = async (socket, data) => {
  const { busId, studentId } = data;

  if (!busId) {
    socket.emit('error', { message: 'Missing busId' });
    return;
  }

  // Join room
  socket.join(`bus-${busId}`);
  console.log(`📥 Parent ${socket.id} subscribed to bus-${busId}`);

  // Gửi vị trí hiện tại từ memory (nếu có)
  try {
    const currentLocation = busLocations.get(busId);
    
    if (currentLocation) {
      socket.emit('bus:location', currentLocation);
      console.log(`📤 Sent current location to parent ${socket.id}`);
    } else {
      console.log(`⚠️ No location found for bus ${busId} (bus not started yet)`);
    }
  } catch (error) {
    console.error('❌ Error fetching current location:', error);
  }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const getIO = () => io;
export const getBusLocations = () => busLocations;
