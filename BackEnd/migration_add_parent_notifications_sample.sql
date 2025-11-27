-- Migration: Add sample notifications for parent testing
-- Date: 2025-11-26
-- Purpose: Insert test notifications into thongbao_phuhuynh table

-- Thêm thông báo mẫu cho phụ huynh PH001
INSERT INTO thongbao_phuhuynh (MaThongBao, MaPhuHuynh, NoiDung, ThoiGian, LoaiThongBao, DaDoc) VALUES
('TB001', 'PH001', 'Xe buýt đang cách điểm đón của con bạn 500m. Vui lòng chuẩn bị!', NOW() - INTERVAL 5 MINUTE, 'Xe đang đến gần', 0),
('TB002', 'PH001', 'Xe buýt đã đến điểm đón. Con bạn đã lên xe an toàn.', NOW() - INTERVAL 15 MINUTE, 'Xe đã đến', 0),
('TB003', 'PH001', 'Chuyến đi đã hoàn thành. Con bạn đã về đến trường an toàn lúc 7:30.', NOW() - INTERVAL 30 MINUTE, 'Hoàn thành', 1),
('TB004', 'PH001', 'Xe buýt có thể trễ 10 phút do tắc đường tại khu vực cầu Sài Gòn. Xin lỗi vì sự bất tiện.', NOW() - INTERVAL 1 HOUR, 'Xe bị trễ', 0),
('TB005', 'PH001', 'Hệ thống đã được nâng cấp với tính năng theo dõi vị trí xe bus realtime. Vui lòng trải nghiệm!', NOW() - INTERVAL 2 HOUR, 'Thông báo hệ thống', 1);

-- Thêm thông báo cho phụ huynh PH002
INSERT INTO thongbao_phuhuynh (MaThongBao, MaPhuHuynh, NoiDung, ThoiGian, LoaiThongBao, DaDoc) VALUES
('TB006', 'PH002', 'Xe buýt đang trên đường đến điểm đón của con bạn.', NOW() - INTERVAL 10 MINUTE, 'Đang trên đường', 0),
('TB007', 'PH002', 'Con bạn đã được đón và đang trên đường đến trường.', NOW() - INTERVAL 20 MINUTE, 'Đã đón', 1);

-- Thêm thông báo cho phụ huynh PH003
INSERT INTO thongbao_phuhuynh (MaThongBao, MaPhuHuynh, NoiDung, ThoiGian, LoaiThongBao, DaDoc) VALUES
('TB008', 'PH003', 'Lịch trình ngày mai: Xe sẽ đến đón lúc 7:00 sáng như thường lệ.', NOW() - INTERVAL 3 HOUR, 'Lịch trình', 1);
