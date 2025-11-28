-- Migration: Cập nhật giá trị mặc định của status trong bảng schedules
-- Date: 2025-11-27
-- Description: Thay đổi status mặc định từ 'Sắp diễn ra' thành 'Chưa phân công'
--              để phù hợp với quy trình: Tạo schedule -> Chưa phân công -> Đã phân công -> Sắp diễn ra -> Đang chạy -> Hoàn thành

-- !!! QUAN TRỌNG: Đảm bảo bạn đang sử dụng đúng database
-- USE bus_tracking; -- Uncomment nếu cần

-- Bước 1: Kiểm tra database hiện tại
SELECT DATABASE() as current_database;

-- Bước 2: Kiểm tra cấu trúc hiện tại của cột status
SHOW COLUMNS FROM schedules LIKE 'status';

-- Bước 3: Cập nhật status mặc định thành 'Chưa phân công'
ALTER TABLE schedules 
MODIFY COLUMN status ENUM('Chưa phân công', 'Sắp diễn ra', 'Đang chạy', 'Hoàn thành', 'Đã hủy', 'Đã phân công') 
DEFAULT 'Chưa phân công' 
COMMENT 'Trạng thái lịch trình';

-- Bước 4: Xác nhận thay đổi đã thành công
SHOW COLUMNS FROM schedules LIKE 'status';

-- Bước 4 (Optional): Cập nhật các schedule hiện có đang có status 'Sắp diễn ra' về 'Chưa phân công'
-- Chỉ chạy nếu muốn reset lại tất cả schedule cũ
-- UPDATE schedules SET status = 'Chưa phân công' WHERE status = 'Sắp diễn ra' AND date >= CURDATE();

-- Ghi chú:
-- 1. Status 'Chưa phân công': Schedule mới tạo, chưa assign driver
-- 2. Status 'Đã phân công': Đã assign driver cho schedule
-- 3. Status 'Sắp diễn ra': Schedule sắp đến giờ chạy (có thể tự động cập nhật bằng cron job)
-- 4. Status 'Đang chạy': Xe đang chạy trên tuyến
-- 5. Status 'Hoàn thành': Tất cả học sinh đã được đón/trả
-- 6. Status 'Đã hủy': Schedule bị hủy
