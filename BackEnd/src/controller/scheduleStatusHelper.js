import { pool } from "../config/connectDB.js";

/**
 * Kiểm tra và tự động cập nhật status schedule thành "Hoàn thành"
 * khi tất cả học sinh đã được đón/trả
 * @param {number} scheduleId - ID của schedule cần kiểm tra
 * @returns {Promise<boolean>} - True nếu đã hoàn thành và cập nhật thành công
 */
export const checkAndCompleteSchedule = async (scheduleId) => {
  try {
    // Lấy thông tin schedule và route
    const [scheduleData] = await pool.query(`
      SELECT s.id, s.route_id, s.status, s.shift
      FROM schedules s
      WHERE s.id = ?
    `, [scheduleId]);

    if (scheduleData.length === 0) {
      console.log(`Schedule ${scheduleId} không tồn tại`);
      return false;
    }

    const schedule = scheduleData[0];
    const routeId = schedule.route_id;

    // Nếu đã hoàn thành hoặc đã hủy rồi thì không cần check nữa
    if (schedule.status === 'Hoàn thành' || schedule.status === 'Đã hủy') {
      return false;
    }

    // Đếm tổng số điểm đón trên tuyến (CHỈ học sinh, KHÔNG tính điểm trường)
    const [totalPoints] = await pool.query(`
      SELECT COUNT(*) as total
      FROM pickuppoints pp
      WHERE pp.RouteId = ? AND pp.MaHocSinh IS NOT NULL
    `, [routeId]);

    const totalStudentPoints = totalPoints[0]?.total || 0;

    if (totalStudentPoints === 0) {
      console.log(`Route ${routeId} không có học sinh nào`);
      return false;
    }

    // Đếm số điểm đã hoàn thành (Đã đón hoặc Đã trả tùy theo ca)
    // Ca sáng: cần tất cả "Đã đón"
    // Ca chiều: cần tất cả "Đã trả"
    const targetStatus = schedule.shift === 'Sáng' ? 'Đã đón' : 'Đã trả';
    
    const [completedPoints] = await pool.query(`
      SELECT COUNT(*) as completed
      FROM schedule_pickup_status sps
      INNER JOIN pickuppoints pp ON sps.PickupPointId = pp.Id
      WHERE sps.ScheduleId = ? 
        AND pp.MaHocSinh IS NOT NULL
        AND sps.TinhTrangDon = ?
    `, [scheduleId, targetStatus]);

    const completedCount = completedPoints[0]?.completed || 0;

    console.log(`📊 Schedule ${scheduleId} - Ca ${schedule.shift}: ${completedCount}/${totalStudentPoints} điểm đã hoàn thành (${targetStatus})`);

    // Nếu tất cả các điểm đã hoàn thành
    if (completedCount >= totalStudentPoints && totalStudentPoints > 0) {
      console.log(`✅ Schedule ${scheduleId} đã hoàn thành tất cả các điểm đón/trả`);
      
      // Cập nhật status thành "Hoàn thành" và ghi nhận end_time
      const now = new Date();
      const endTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
      
      await pool.query(`
        UPDATE schedules 
        SET status = 'Hoàn thành', end_time = ?
        WHERE id = ?
      `, [endTime, scheduleId]);

      console.log(`✅ Đã cập nhật schedule ${scheduleId} thành "Hoàn thành" lúc ${endTime}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ Lỗi trong checkAndCompleteSchedule:', error);
    return false;
  }
};

/**
 * Kiểm tra xem schedule có thể bắt đầu không
 * (chỉ cho phép bắt đầu nếu status là "Đã phân công" hoặc "Sắp diễn ra")
 */
export const canStartSchedule = (status) => {
  return ['Đã phân công', 'Sắp diễn ra'].includes(status);
};

/**
 * Kiểm tra xem schedule có thể chỉnh sửa không
 * (không cho chỉnh sửa nếu đã "Đang chạy" hoặc "Hoàn thành")
 */
export const canEditSchedule = (status) => {
  return !['Đang chạy', 'Hoàn thành'].includes(status);
};

/**
 * Tạo các bản ghi pickup status cho schedule mới
 * @param {number} scheduleId - ID của schedule vừa tạo
 * @param {number} routeId - ID của route
 * @returns {Promise<number>} - Số lượng bản ghi đã tạo
 */
export const createPickupStatusRecords = async (scheduleId, routeId) => {
  try {
    // Lấy tất cả pickup points trên route có học sinh
    const [pickupPoints] = await pool.query(
      'SELECT Id FROM pickuppoints WHERE RouteId = ? AND MaHocSinh IS NOT NULL ORDER BY PointOrder ASC',
      [routeId]
    );

    if (pickupPoints.length === 0) {
      console.log(`⚠️ Route ${routeId} không có điểm đón nào`);
      return 0;
    }

    // Tạo bản ghi cho mỗi pickup point
    let insertCount = 0;
    for (const point of pickupPoints) {
      await pool.query(
        `INSERT INTO schedule_pickup_status (ScheduleId, PickupPointId, TinhTrangDon) 
         VALUES (?, ?, 'Chưa đón')`,
        [scheduleId, point.Id]
      );
      insertCount++;
    }

    console.log(`✅ Đã tạo ${insertCount} bản ghi pickup status cho schedule ${scheduleId}`);
    return insertCount;
  } catch (error) {
    console.error('❌ Lỗi trong createPickupStatusRecords:', error);
    return 0;
  }
};
