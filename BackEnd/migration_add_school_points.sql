-- ============================================
-- Migration: Thêm hỗ trợ điểm trường vào pickuppoints
-- Date: 2025-11-26
-- Description: Cho phép pickuppoints lưu điểm trường (không có MaHocSinh)
-- ============================================

USE school_bus_db;

-- Bước 1: Xóa FOREIGN KEY constraint cũ
ALTER TABLE `pickuppoints` 
    DROP FOREIGN KEY `pickuppoints_ibfk_2`;

-- Bước 2: Xóa INDEX của MaHocSinh
ALTER TABLE `pickuppoints` 
    DROP INDEX `MaHocSinh`;

-- Bước 3: Sửa cột MaHocSinh thành NULLABLE (cho phép NULL khi là điểm trường)
ALTER TABLE `pickuppoints` 
    MODIFY COLUMN `MaHocSinh` varchar(20) NULL COMMENT 'Học sinh được đón tại điểm này (NULL nếu là điểm trường)';

-- Bước 4: Sửa cột DiaChi thành NULLABLE (vì có thể tự động điền từ PointName)
ALTER TABLE `pickuppoints` 
    MODIFY COLUMN `DiaChi` text NULL COMMENT 'Địa chỉ điểm đón';

-- Bước 5: Thêm lại INDEX cho MaHocSinh (vẫn giữ để tối ưu query)
ALTER TABLE `pickuppoints` 
    ADD INDEX `MaHocSinh` (`MaHocSinh`);

-- Bước 6: Thêm lại FOREIGN KEY constraint với ON DELETE SET NULL
-- (Khi xóa học sinh, chỉ set NULL chứ không xóa điểm đón)
ALTER TABLE `pickuppoints` 
    ADD CONSTRAINT `pickuppoints_ibfk_2` 
    FOREIGN KEY (`MaHocSinh`) 
    REFERENCES `hocsinh` (`MaHocSinh`) 
    ON DELETE SET NULL;

-- Bước 7: Cập nhật TinhTrangDon enum để thêm status mới cho điểm trường
ALTER TABLE `pickuppoints` 
    MODIFY COLUMN `TinhTrangDon` 
    enum('Chưa đón','Đã đón','Vắng','Đã trả','Xuất phát','Điểm cuối') 
    DEFAULT 'Chưa đón' 
    COMMENT 'Trạng thái đón trả học sinh (Xuất phát/Điểm cuối cho điểm trường)';

-- ============================================
-- Verification queries (chạy sau migration)
-- ============================================

-- Kiểm tra cấu trúc table sau khi migration
-- DESCRIBE pickuppoints;

-- Kiểm tra constraints
-- SELECT 
--     CONSTRAINT_NAME, 
--     COLUMN_NAME, 
--     REFERENCED_TABLE_NAME, 
--     REFERENCED_COLUMN_NAME,
--     DELETE_RULE
-- FROM information_schema.KEY_COLUMN_USAGE
-- WHERE TABLE_NAME = 'pickuppoints' 
--     AND TABLE_SCHEMA = 'school_bus_db'
--     AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Test insert điểm trường (sau khi migration)
-- INSERT INTO pickuppoints (RouteId, MaHocSinh, Latitude, Longitude, DiaChi, PointOrder, TinhTrangDon)
-- VALUES (1, NULL, 10.8231, 106.6297, 'Trường ĐH Sài Gòn, Quận 5', 0, 'Xuất phát');

COMMIT;
