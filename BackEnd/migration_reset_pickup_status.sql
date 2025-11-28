-- Migration: Reset pickup status về mặc định "Chưa đón" cho các schedule mới
-- Date: 2025-11-27
-- Description: Đảm bảo tất cả schedule_pickup_status có trạng thái đúng

-- Bước 1: Kiểm tra các schedule_pickup_status hiện tại
SELECT 
    s.id as schedule_id,
    s.date,
    s.status as schedule_status,
    COUNT(*) as total_points,
    SUM(CASE WHEN sps.TinhTrangDon = 'Chưa đón' THEN 1 ELSE 0 END) as chua_don,
    SUM(CASE WHEN sps.TinhTrangDon = 'Đã đón' THEN 1 ELSE 0 END) as da_don,
    SUM(CASE WHEN sps.TinhTrangDon = 'Đã trả' THEN 1 ELSE 0 END) as da_tra
FROM schedules s
LEFT JOIN schedule_pickup_status sps ON sps.ScheduleId = s.id
WHERE s.date >= CURDATE()
GROUP BY s.id, s.date, s.status
ORDER BY s.date, s.id;

-- Bước 2: Reset tất cả schedule_pickup_status về "Chưa đón" 
-- cho các schedule chưa bắt đầu hoặc mới tạo
UPDATE schedule_pickup_status sps
INNER JOIN schedules s ON sps.ScheduleId = s.id
SET sps.TinhTrangDon = 'Chưa đón',
    sps.ThoiGianDonThucTe = NULL,
    sps.GhiChu = NULL
WHERE s.status IN ('Chưa phân công', 'Đã phân công', 'Sắp diễn ra')
  AND s.date >= CURDATE();

-- Bước 3: Xác nhận kết quả
SELECT 
    s.id as schedule_id,
    s.date,
    s.status as schedule_status,
    COUNT(*) as total_points,
    SUM(CASE WHEN sps.TinhTrangDon = 'Chưa đón' THEN 1 ELSE 0 END) as chua_don,
    SUM(CASE WHEN sps.TinhTrangDon = 'Đã đón' THEN 1 ELSE 0 END) as da_don,
    SUM(CASE WHEN sps.TinhTrangDon = 'Đã trả' THEN 1 ELSE 0 END) as da_tra
FROM schedules s
LEFT JOIN schedule_pickup_status sps ON sps.ScheduleId = s.id
WHERE s.date >= CURDATE()
  AND s.status IN ('Chưa phân công', 'Đã phân công', 'Sắp diễn ra')
GROUP BY s.id, s.date, s.status
ORDER BY s.date, s.id;

-- Bước 4: Tùy chọn - Xóa các pickup status cũ không còn liên quan
-- (Cẩn thận với lệnh này, chỉ chạy nếu chắc chắn muốn xóa dữ liệu cũ)
-- DELETE sps FROM schedule_pickup_status sps
-- INNER JOIN schedules s ON sps.ScheduleId = s.id
-- WHERE s.date < CURDATE() - INTERVAL 30 DAY;

-- Ghi chú:
-- 1. Migration này đảm bảo các schedule chưa chạy có status pickup = "Chưa đón"
-- 2. Không ảnh hưởng đến schedule đang chạy hoặc đã hoàn thành
-- 3. Reset cả thời gian và ghi chú về NULL
