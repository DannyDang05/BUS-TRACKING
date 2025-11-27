-- ============================================
-- Migration: Thêm status "Đã phân công" vào schedules
-- Date: 2025-11-26
-- Description: Cho phép schedules có status "Đã phân công" khi assign driver
-- ============================================

USE school_bus_db;

-- 1. Thêm "Đã phân công" vào enum status
ALTER TABLE `schedules` 
    MODIFY COLUMN `status` 
    enum('Sắp diễn ra','Đang chạy','Hoàn thành','Đã hủy','Đã phân công') 
    DEFAULT 'Sắp diễn ra' 
    COMMENT 'Trạng thái lịch trình';

-- 2. Thêm cột Shift (Ca sáng/chiều)
ALTER TABLE `schedules` 
    ADD COLUMN `shift` 
    enum('Sáng','Chiều') 
    NOT NULL DEFAULT 'Sáng' 
    AFTER `start_time`
    COMMENT 'Ca làm việc: Sáng hoặc Chiều';

-- Kiểm tra kết quả
SHOW COLUMNS FROM schedules LIKE 'status';
SHOW COLUMNS FROM schedules LIKE 'shift';

COMMIT;
