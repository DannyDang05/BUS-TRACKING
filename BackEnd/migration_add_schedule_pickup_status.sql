-- Migration: Tách riêng trạng thái đón học sinh cho từng schedule
-- Date: 2025-11-27
-- Purpose: Giải quyết vấn đề trạng thái đón bị trùng lặp khi có nhiều schedule cho cùng 1 tuyến

-- Bước 1: Tạo bảng mới lưu trạng thái đón cho từng schedule
CREATE TABLE IF NOT EXISTS `schedule_pickup_status` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ScheduleId` int(11) NOT NULL COMMENT 'ID của schedule',
  `PickupPointId` int(11) NOT NULL COMMENT 'ID của điểm đón',
  `TinhTrangDon` enum('Chưa đón','Đã đón','Vắng','Đã trả','Xuất phát','Điểm cuối') DEFAULT 'Chưa đón' COMMENT 'Trạng thái đón trả học sinh',
  `ThoiGianDonThucTe` datetime DEFAULT NULL COMMENT 'Thời gian đón thực tế',
  `GhiChu` text DEFAULT NULL COMMENT 'Ghi chú (lý do vắng, v.v.)',
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id`),
  UNIQUE KEY `unique_schedule_pickup` (`ScheduleId`, `PickupPointId`),
  KEY `idx_schedule` (`ScheduleId`),
  KEY `idx_pickuppoint` (`PickupPointId`),
  KEY `idx_tinhtrang` (`TinhTrangDon`),
  CONSTRAINT `fk_schedule_pickup_schedule` FOREIGN KEY (`ScheduleId`) REFERENCES `schedules` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_schedule_pickup_point` FOREIGN KEY (`PickupPointId`) REFERENCES `pickuppoints` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lưu trạng thái đón học sinh riêng cho từng schedule';

-- Bước 2: Migrate dữ liệu hiện có từ pickuppoints sang schedule_pickup_status
-- Với mỗi pickuppoint, tạo 1 record cho mỗi schedule của route đó
INSERT INTO `schedule_pickup_status` (`ScheduleId`, `PickupPointId`, `TinhTrangDon`, `ThoiGianDonThucTe`)
SELECT 
    s.id as ScheduleId,
    pp.Id as PickupPointId,
    pp.TinhTrangDon,
    pp.ThoiGianDonThucTe
FROM pickuppoints pp
INNER JOIN schedules s ON s.route_id = pp.RouteId
WHERE NOT EXISTS (
    SELECT 1 FROM schedule_pickup_status sps 
    WHERE sps.ScheduleId = s.id AND sps.PickupPointId = pp.Id
);

-- Bước 3: Xóa các cột không cần thiết khỏi bảng pickuppoints
-- (Giữ lại cấu trúc tuyến, chỉ xóa trạng thái động)
-- Lưu ý: Chỉ chạy sau khi đã test kỹ và cập nhật code
-- ALTER TABLE `pickuppoints` DROP COLUMN `TinhTrangDon`;
-- ALTER TABLE `pickuppoints` DROP COLUMN `ThoiGianDonThucTe`;

-- Bước 4: Index optimization
CREATE INDEX idx_schedule_status ON schedule_pickup_status(ScheduleId, TinhTrangDon);
CREATE INDEX idx_time ON schedule_pickup_status(ThoiGianDonThucTe);

-- ============================================
-- HƯỚNG DẪN SỬ DỤNG:
-- ============================================
-- 1. Query lấy trạng thái đón cho 1 schedule cụ thể:
-- SELECT 
--     pp.Id, pp.PointOrder, pp.PointName, pp.DiaChi,
--     hs.HoTen, hs.Lop,
--     sps.TinhTrangDon, sps.ThoiGianDonThucTe
-- FROM pickuppoints pp
-- LEFT JOIN schedule_pickup_status sps ON sps.PickupPointId = pp.Id AND sps.ScheduleId = ?
-- LEFT JOIN hocsinh hs ON hs.MaHocSinh = pp.MaHocSinh
-- WHERE pp.RouteId = ?
-- ORDER BY pp.PointOrder;

-- 2. Cập nhật trạng thái đón:
-- INSERT INTO schedule_pickup_status (ScheduleId, PickupPointId, TinhTrangDon, ThoiGianDonThucTe)
-- VALUES (?, ?, 'Đã đón', NOW())
-- ON DUPLICATE KEY UPDATE 
--     TinhTrangDon = VALUES(TinhTrangDon),
--     ThoiGianDonThucTe = VALUES(ThoiGianDonThucTe);

-- 3. Tạo trạng thái đón mặc định khi tạo schedule mới:
-- INSERT INTO schedule_pickup_status (ScheduleId, PickupPointId, TinhTrangDon)
-- SELECT ?, pp.Id, 
--     CASE 
--         WHEN pp.MaHocSinh IS NULL AND pp.PointOrder = 0 THEN 'Xuất phát'
--         WHEN pp.MaHocSinh IS NULL AND pp.PointOrder > 0 THEN 'Điểm cuối'
--         ELSE 'Chưa đón'
--     END
-- FROM pickuppoints pp
-- WHERE pp.RouteId = ?;
