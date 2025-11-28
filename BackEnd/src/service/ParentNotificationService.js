/**
 * ParentNotificationService.js
 * Service tự động gửi thông báo cho phụ huynh dựa trên:
 * - Khoảng cách xe bus đến điểm đón
 * - Trạng thái pickup (đã đón/đã trả)
 * - Xe bị trễ
 */

import { pool } from "../config/connectDB.js";

class ParentNotificationService {
  constructor() {
    this.checkInterval = null;
    this.notificationCache = new Map(); // Tránh gửi trùng
  }

  /**
   * Bắt đầu monitoring
   */
  start(intervalMs = 30000) { // Mặc định 30 giây
    if (this.checkInterval) {
      console.log('⚠️ Parent notification service đã đang chạy');
      return;
    }

    console.log('✅ Khởi động Parent Notification Service...');
    this.checkInterval = setInterval(() => {
      this.checkAndNotify();
    }, intervalMs);

    // Chạy ngay lần đầu
    this.checkAndNotify();
  }

  /**
   * Dừng monitoring
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('🛑 Dừng Parent Notification Service');
    }
  }

  /**
   * Thông báo bắt đầu hành trình
   */
  async notifyTripStart(scheduleId) {
    try {
      // Lấy thông tin schedule và route
      const [rows] = await pool.query(`
        SELECT s.route_id, r.Name as route_name
        FROM schedules s
        JOIN routes r ON s.route_id = r.Id
        WHERE s.id = ?
      `, [scheduleId]);

      if (rows.length === 0) return;
      const { route_id, route_name } = rows[0];

      // Lấy danh sách phụ huynh
      const [parents] = await pool.query(`
        SELECT DISTINCT hs.MaPhuHuynh as parent_id, hs.HoTen as student_name
        FROM pickuppoints pp
        JOIN hocsinh hs ON pp.MaHocSinh = hs.MaHocSinh
        WHERE pp.RouteId = ? AND pp.MaHocSinh IS NOT NULL
      `, [route_id]);

      for (const parent of parents) {
        await this.sendNotificationIfNotSent(
          parent.parent_id,
          'trip_start',
          `🚌 Xe tuyến ${route_name} đã xuất phát`,
          `Tài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!`,
          scheduleId,
          'start'
        );
      }
      
      console.log(`✅ Đã gửi thông báo bắt đầu hành trình cho ${parents.length} phụ huynh`);
    } catch (error) {
      console.error('❌ Error notifying trip start:', error);
    }
  }

  /**
   * Kiểm tra và gửi thông báo
   */
  async checkAndNotify() {
    try {
      // Lấy tất cả schedule đang chạy hôm nay
      const [schedules] = await pool.query(`
        SELECT 
          s.id as schedule_id,
          s.route_id,
          s.start_time,
          s.status as schedule_status,
          r.currentLatitude as vehicle_lat,
          r.currentLongitude as vehicle_lng,
          r.lastUpdated,
          r.Name as route_name
        FROM schedules s
        INNER JOIN routes r ON r.Id = s.route_id
        WHERE s.date = CURDATE() 
          AND s.status = 'Đang chạy'
          AND r.currentLatitude IS NOT NULL
          AND r.currentLongitude IS NOT NULL
      `);

      if (schedules.length > 0) {
        console.log(`🔍 Checking ${schedules.length} running schedule(s)...`);
      }

      for (const schedule of schedules) {
        await this.checkScheduleNotifications(schedule);
      }
    } catch (error) {
      console.error('❌ Error in checkAndNotify:', error);
    }
  }

  /**
   * Kiểm tra thông báo cho từng schedule
   */
  async checkScheduleNotifications(schedule) {
    try {
      // Lấy tất cả pickup points của schedule
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
      `, [schedule.schedule_id, schedule.route_id]);

      for (const point of pickupPoints) {
        const distance = this.calculateDistance(
          schedule.vehicle_lat,
          schedule.vehicle_lng,
          point.pickup_lat,
          point.pickup_lng
        );

        console.log(`📏 Distance to ${point.student_name}: ${Math.round(distance)}m, status: ${point.pickup_status || 'NULL'}`);

        // Thông báo xe đang đến gần (< 500m, chưa gửi)
        // Kiểm tra cả NULL và 'Chưa đón'
        if (distance < 500 && distance >= 100 && (!point.pickup_status || point.pickup_status === 'Chưa đón')) {
          console.log(`⚠️ Sending "approaching" notification for ${point.student_name}`);
          await this.sendNotificationIfNotSent(
            point.parent_id,
            'approaching',
            `🚌 Xe sắp tới điểm đón ${point.student_name}!`,
            `Xe còn cách khoảng ${Math.round(distance)}m, vui lòng chuẩn bị đón con nhé!`,
            schedule.schedule_id,
            point.pickup_point_id
          );
        }

        // Thông báo xe đã đến (< 100m, chưa gửi)
        // Kiểm tra cả NULL và 'Chưa đón'
        if (distance < 100 && (!point.pickup_status || point.pickup_status === 'Chưa đón')) {
          console.log(`📍 Sending "arrived" notification for ${point.student_name}`);
          await this.sendNotificationIfNotSent(
            point.parent_id,
            'arrived',
            `📍 Xe đã đến điểm đón ${point.student_name}!`,
            `Xe bus hiện đang ở rất gần (${Math.round(distance)}m), con có thể lên xe ngay!`,
            schedule.schedule_id,
            point.pickup_point_id
          );
        }

        // Thông báo đã đón (pickup_status thay đổi)
        if (point.pickup_status === 'Đã đón') {
          await this.sendNotificationIfNotSent(
            point.parent_id,
            'picked_up',
            `✅ ${point.student_name} đã lên xe an toàn`,
            `Con đã được tài xế đón tại ${point.pickup_address || 'điểm đón'} lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
            schedule.schedule_id,
            point.pickup_point_id
          );
        }

        // Thông báo đã trả
        if (point.pickup_status === 'Đã trả') {
          await this.sendNotificationIfNotSent(
            point.parent_id,
            'dropped_off',
            `🏠 ${point.student_name} đã về đến điểm trả`,
            `Con đã được trả an toàn tại ${point.pickup_address || 'điểm trả'} lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
            schedule.schedule_id,
            point.pickup_point_id
          );
        }
      }

      // Kiểm tra xe trễ
      await this.checkDelayNotification(schedule);

    } catch (error) {
      console.error('❌ Error checking schedule notifications:', error);
    }
  }

  /**
   * Kiểm tra và thông báo xe trễ
   */
  async checkDelayNotification(schedule) {
    const delay = this.calculateDelay(schedule.start_time);
    
    if (delay > 15) { // Trễ hơn 15 phút
      // Gửi cho tất cả phụ huynh có con trên tuyến
      const [parents] = await pool.query(`
        SELECT DISTINCT 
          hs.MaPhuHuynh as parent_id,
          hs.HoTen as student_name
        FROM pickuppoints pp
        INNER JOIN hocsinh hs ON hs.MaHocSinh = pp.MaHocSinh
        WHERE pp.RouteId = ?
      `, [schedule.route_id]);

      for (const parent of parents) {
        await this.sendNotificationIfNotSent(
          parent.parent_id,
          'delayed',
          `⏰ Xe ${schedule.route_name} bị trễ`,
          `Xe đang trễ khoảng ${delay} phút so với dự kiến. Xin lỗi vì sự bất tiện này.`,
          schedule.schedule_id,
          null
        );
      }
    }
  }

  /**
   * Gửi thông báo nếu chưa gửi
   */
  async sendNotificationIfNotSent(parentId, type, title, message, scheduleId, pickupPointId) {
    const cacheKey = `${parentId}_${type}_${scheduleId}_${pickupPointId || 'route'}`;
    
    // Kiểm tra cache
    if (this.notificationCache.has(cacheKey)) {
      return;
    }

    try {
      // Tạo mã thông báo
      const code = `TB${Date.now()}`;

      await pool.query(`
        INSERT INTO thongbao_phuhuynh 
        (MaPhuHuynh, MaThongBao, NoiDung, LoaiThongBao, ThoiGian, DaDoc)
        VALUES (?, ?, ?, ?, NOW(), 0)
      `, [parentId, code, `${title}\n${message}`, type]);

      // Lưu vào cache
      this.notificationCache.set(cacheKey, Date.now());

      console.log(`📢 Gửi thông báo ${type} cho phụ huynh ${parentId}`);

      // Xóa cache sau 5 phút
      setTimeout(() => {
        this.notificationCache.delete(cacheKey);
      }, 300000);

    } catch (error) {
      console.error('❌ Error sending notification:', error);
    }
  }

  /**
   * Tính khoảng cách (Haversine)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Tính delay (phút)
   */
  calculateDelay(startTime) {
    if (!startTime) return 0;
    
    const now = new Date();
    const [hours, minutes] = startTime.split(':');
    const scheduled = new Date();
    scheduled.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const diffMs = now - scheduled;
    const diffMins = Math.floor(diffMs / 60000);
    
    return Math.max(0, diffMins);
  }
}

// Export singleton instance
export default new ParentNotificationService();
