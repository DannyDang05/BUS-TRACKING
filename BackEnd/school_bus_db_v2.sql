-- ========================================
-- SCHOOL BUS TRACKING SYSTEM - REDESIGNED DATABASE
-- Thiết kế tối ưu cho phân tuyến tự động
-- ========================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school_bus_db`
--

-- --------------------------------------------------------
-- 1. USERS TABLE (Authentication)
-- --------------------------------------------------------
CREATE TABLE `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('admin','driver','parent') NOT NULL,
  `ProfileId` varchar(20) NOT NULL,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Username` (`Username`),
  KEY `idx_username` (`Username`),
  KEY `idx_profile` (`ProfileId`,`Role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`Id`, `Username`, `Password`, `Role`, `ProfileId`) VALUES
(1, 'admin', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'admin', 'QL001'),
(2, 'admin2', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'admin', 'QL002'),
(3, 'taixe01', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX001'),
(4, 'taixe02', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX002'),
(5, 'taixe03', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX003'),
(6, 'taixe04', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX004'),
(7, 'taixe05', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX005'),
(8, 'phuhuynh01', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH001'),
(9, 'phuhuynh02', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH002'),
(10, 'phuhuynh03', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH003');

-- --------------------------------------------------------
-- 2. QUẢN LÝ (Admin/Manager)
-- --------------------------------------------------------
CREATE TABLE `quanly` (
  `MaQuanLy` varchar(20) NOT NULL,
  `HoTen` varchar(100) NOT NULL,
  `SoDienThoai` varchar(15) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`MaQuanLy`),
  UNIQUE KEY `UserId` (`UserId`),
  CONSTRAINT `fk_quanly_users` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `quanly` (`MaQuanLy`, `HoTen`, `SoDienThoai`, `UserId`) VALUES
('QL001', 'Bùi Bích Phương', '0912345678', 1),
('QL002', 'Trần Minh Tuấn', '0913456789', 2);

-- --------------------------------------------------------
-- 3. PHỤ HUYNH (Parents)
-- --------------------------------------------------------
CREATE TABLE `phuhuynh` (
  `MaPhuHuynh` varchar(20) NOT NULL,
  `HoTen` varchar(100) NOT NULL,
  `SoDienThoai` varchar(15) DEFAULT NULL,
  `Nhanthongbao` tinyint(1) DEFAULT 1,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`MaPhuHuynh`),
  UNIQUE KEY `UserId` (`UserId`),
  CONSTRAINT `fk_phuhuynh_users` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES
('PH001', 'Nguyễn Văn A', '0901234567', 1, 8),
('PH002', 'Trần Thị B', '0907654321', 1, 9),
('PH003', 'Lê Văn C', '0903456789', 1, 10),
('PH004', 'Phạm Thị D', '0909876543', 1, NULL),
('PH005', 'Võ Văn E', '0904444444', 1, NULL),
('PH006', 'Đỗ Thị F', '0905555555', 1, NULL),
('PH007', 'Bùi Văn G', '0906666666', 1, NULL),
('PH008', 'Hoàng Thị H', '0907777777', 1, NULL),
('PH009', 'Phan Văn I', '0908888888', 1, NULL),
('PH010', 'Lý Thị K', '0909999999', 1, NULL);

-- --------------------------------------------------------
-- 4. TÀI XẾ (Drivers)
-- --------------------------------------------------------
CREATE TABLE `drivers` (
  `Id` varchar(20) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `MaBangLai` varchar(20) NOT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1 COMMENT 'Tài xế có đang hoạt động không',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `MaBangLai` (`MaBangLai`),
  UNIQUE KEY `UserId` (`UserId`),
  CONSTRAINT `drivers_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES
('TX001', 'Võ Văn Mạnh', 'C1-555123', '0908765432', 3, 1),
('TX002', 'Đỗ Thị Hương', 'C1-555234', '0902345678', 4, 1),
('TX003', 'Bùi Văn Dũng', 'B2-555345', '0906789012', 5, 1),
('TX004', 'Nguyễn Thị Kim', 'B2-555456', '0901111111', 6, 1),
('TX005', 'Trần Văn Long', 'C1-555567', '0902222222', 7, 1);

-- --------------------------------------------------------
-- 5. XE (Vehicles/Buses)
-- --------------------------------------------------------
CREATE TABLE `vehicles` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `LicensePlate` varchar(20) NOT NULL,
  `Model` varchar(100) DEFAULT NULL,
  `Capacity` int(11) NOT NULL DEFAULT 16 COMMENT 'Số chỗ ngồi của xe',
  `SpeedKmh` int(11) NOT NULL DEFAULT 40 COMMENT 'Tốc độ trung bình (km/h)',
  `IsActive` tinyint(1) DEFAULT 1 COMMENT 'Xe có đang hoạt động không',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `LicensePlate` (`LicensePlate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `vehicles` (`Id`, `LicensePlate`, `Model`, `Capacity`, `SpeedKmh`, `IsActive`) VALUES
(1, '51A-123.45', 'Hyundai County 16 chỗ', 16, 50, 1),
(2, '51B-678.90', 'Toyota Coaster 29 chỗ', 29, 45, 1),
(3, '51C-555.55', 'Ford Transit 16 chỗ', 16, 55, 1),
(4, '5D-111.22', 'Mercedes Sprinter 16 chỗ', 16, 50, 1),
(5, '51E-999.88', 'Hyundai Solati 16 chỗ', 16, 45, 1);

-- --------------------------------------------------------
-- 6. HỌC SINH (Students) - REDESIGNED
-- --------------------------------------------------------
CREATE TABLE `hocsinh` (
  `MaHocSinh` varchar(20) NOT NULL,
  `HoTen` varchar(100) NOT NULL,
  `Lop` varchar(20) DEFAULT NULL,
  `MaPhuHuynh` varchar(20) DEFAULT NULL,
  `DiaChi` text NOT NULL COMMENT 'Địa chỉ nhà học sinh (dùng cho pickup)',
  `Latitude` decimal(10,8) NOT NULL COMMENT 'Vĩ độ (tự động từ địa chỉ hoặc nhập)',
  `Longitude` decimal(11,8) NOT NULL COMMENT 'Kinh độ (tự động từ địa chỉ hoặc nhập)',
  `TrangThaiHocTap` enum('Đang học','Nghỉ học','Chuyển trường') NOT NULL DEFAULT 'Đang học' COMMENT 'Trạng thái học tập - CHỈ học sinh "Đang học" mới được phân tuyến',
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`MaHocSinh`),
  KEY `idx_phuhuynh` (`MaPhuHuynh`),
  KEY `idx_location` (`Latitude`, `Longitude`),
  KEY `idx_trangthai` (`TrangThaiHocTap`),
  CONSTRAINT `hocsinh_ibfk_1` FOREIGN KEY (`MaPhuHuynh`) REFERENCES `phuhuynh` (`MaPhuHuynh`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `hocsinh` (`MaHocSinh`, `HoTen`, `Lop`, `MaPhuHuynh`, `DiaChi`, `Latitude`, `Longitude`, `TrangThaiHocTap`) VALUES
('HS001', 'Nguyễn Thị An', '6A1', 'PH001', '01 Công xã Paris, Bến Nghé, Quận 1, TP.HCM', 10.77688000, 106.70080000, 'Đang học'),
('HS002', 'Phạm Văn Bình', '7B2', 'PH001', '2 Hải Triều, Bến Nghé, Quận 1, TP.HCM', 10.77140000, 106.70420000, 'Đang học'),
('HS003', 'Hoàng Thị Cúc', '8C3', 'PH002', 'Trương Định, Quận 1, TP.HCM', 10.78210000, 106.69340000, 'Đang học'),
('HS004', 'Trần Văn Dũng', '6A2', 'PH003', '2 Công xã Paris, Quận 1, TP.HCM', 10.77995000, 106.69968000, 'Đang học'),
('HS005', 'Lê Thị Hoa', '7A1', 'PH004', 'Lê Lợi, Quận 1, TP.HCM', 10.77230000, 106.69810000, 'Đang học'),
('HS006', 'Võ Văn Kiên', '5B1', 'PH004', '135 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM', 10.77739000, 106.69534000, 'Đang học'),
('HS007', 'Đỗ Thị Lan', '6B2', 'PH005', 'Nguyễn Tất Thành, Quận 4, TP.HCM', 10.76279000, 106.68225000, 'Đang học'),
('HS008', 'Bùi Văn Minh', '8A1', 'PH006', '65 Lý Tự Trọng, Quận 1, TP.HCM', 10.76837000, 106.69210000, 'Đang học'),
('HS009', 'Phan Thị Ngọc', '7C1', 'PH007', 'Hai Bà Trưng, Quận 1, TP.HCM', 10.78547000, 106.70143000, 'Đang học'),
('HS010', 'Lý Văn Phong', '6C2', 'PH007', 'Võ Thị Sáu, Quận 3, TP.HCM', 10.79234000, 106.70012000, 'Đang học'),
('HS011', 'Nguyễn Văn Quang', '5A1', 'PH008', 'Lam Sơn, Quận 1, TP.HCM', 10.78901000, 106.69543000, 'Đang học'),
('HS012', 'Trần Thị Rạng', '7B1', 'PH009', 'Vinhomes Central Park, Bình Thạnh, TP.HCM', 10.78234000, 106.70345000, 'Đang học'),
('HS013', 'Lê Văn Sáng', '8B2', 'PH009', 'Phạm Ngọc Thạch, Quận 3, TP.HCM', 10.76234000, 106.70123000, 'Đang học'),
('HS014', 'Phạm Thị Tuyết', '6A3', 'PH010', 'Phạm Ngũ Lão, Quận 1, TP.HCM', 10.76834000, 106.69876000, 'Đang học'),
('HS015', 'Võ Văn Uy', '7A2', 'PH010', 'Tôn Đức Thắng, Quận 1, TP.HCM', 10.77123000, 106.70234000, 'Đang học'),
('HS016', 'Trần Thị Mai', '6B1', 'PH003', '10 Nguyễn Huệ, Quận 1, TP.HCM', 10.77445000, 106.70267000, 'Nghỉ học'),
('HS017', 'Lê Văn Tú', '8A2', 'PH005', '20 Lê Duẩn, Quận 1, TP.HCM', 10.77890000, 106.69990000, 'Đang học');

-- --------------------------------------------------------
-- 7. ROUTES (Tuyến xe) - CHỈ LƯU THÔNG TIN TUYẾN
-- --------------------------------------------------------
CREATE TABLE `routes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MaTuyen` varchar(20) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `DriverId` varchar(20) DEFAULT NULL,
  `VehicleId` int(11) DEFAULT NULL,
  `Status` enum('Chưa chạy','Đang chạy','Đã hoàn thành','Đã hủy') NOT NULL DEFAULT 'Chưa chạy',
  `TotalDistance` decimal(10,2) DEFAULT NULL COMMENT 'Tổng quãng đường (km)',
  `EstimatedTime` int(11) DEFAULT NULL COMMENT 'Thời gian ước tính (phút)',
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `MaTuyen` (`MaTuyen`),
  KEY `DriverId` (`DriverId`),
  KEY `VehicleId` (`VehicleId`),
  KEY `idx_status` (`Status`),
  CONSTRAINT `routes_ibfk_1` FOREIGN KEY (`DriverId`) REFERENCES `drivers` (`Id`) ON DELETE SET NULL,
  CONSTRAINT `routes_ibfk_2` FOREIGN KEY (`VehicleId`) REFERENCES `vehicles` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. PICKUP POINTS - ĐIỂM ĐÓN (GẮN VỚI HỌC SINH VÀ TUYẾN)
-- --------------------------------------------------------
CREATE TABLE `pickuppoints` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RouteId` int(11) NOT NULL COMMENT 'Tuyến xe',
  `MaHocSinh` varchar(20) NOT NULL COMMENT 'Học sinh được đón tại điểm này',
  `Latitude` decimal(10,8) NOT NULL COMMENT 'Vĩ độ điểm đón (copy từ hocsinh)',
  `Longitude` decimal(11,8) NOT NULL COMMENT 'Kinh độ điểm đón (copy từ hocsinh)',
  `DiaChi` text NOT NULL COMMENT 'Địa chỉ điểm đón (copy từ hocsinh)',
  `PointOrder` int(11) NOT NULL COMMENT 'Thứ tự điểm đón trên tuyến (1, 2, 3...)',
  `PointName` varchar(255) DEFAULT NULL COMMENT 'Tên điểm đón (thường là tên học sinh)',
  `TinhTrangDon` enum('Chưa đón','Đã đón','Vắng','Đã trả') DEFAULT 'Chưa đón' COMMENT 'Trạng thái đón trả học sinh',
  `ThoiGianDonDuKien` time DEFAULT NULL COMMENT 'Thời gian đón dự kiến',
  `ThoiGianDonThucTe` datetime DEFAULT NULL COMMENT 'Thời gian đón thực tế',
  PRIMARY KEY (`Id`),
  KEY `RouteId` (`RouteId`),
  KEY `MaHocSinh` (`MaHocSinh`),
  KEY `idx_order` (`RouteId`, `PointOrder`),
  KEY `idx_tinhtrang` (`TinhTrangDon`),
  CONSTRAINT `pickuppoints_ibfk_1` FOREIGN KEY (`RouteId`) REFERENCES `routes` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `pickuppoints_ibfk_2` FOREIGN KEY (`MaHocSinh`) REFERENCES `hocsinh` (`MaHocSinh`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. SCHEDULES (Lịch trình chạy xe)
-- --------------------------------------------------------
CREATE TABLE `schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `status` enum('Sắp diễn ra','Đang chạy','Hoàn thành','Đã hủy') DEFAULT 'Sắp diễn ra',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_route` (`route_id`),
  KEY `idx_date` (`date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_schedules_routes` FOREIGN KEY (`route_id`) REFERENCES `routes` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. THÔNG BÁO
-- --------------------------------------------------------
CREATE TABLE `thongbao` (
  `MaThongBao` varchar(20) NOT NULL,
  `NoiDung` text DEFAULT NULL,
  `ThoiGian` datetime DEFAULT NULL,
  `LoaiThongBao` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MaThongBao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `thongbao_phuhuynh` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MaThongBao` varchar(20) NOT NULL,
  `MaPhuHuynh` varchar(20) NOT NULL,
  `NoiDung` text NOT NULL,
  `ThoiGian` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `LoaiThongBao` varchar(50) DEFAULT 'Thông báo',
  `DaDoc` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `MaThongBao` (`MaThongBao`),
  KEY `idx_phuhuynh` (`MaPhuHuynh`),
  KEY `idx_dadoc` (`DaDoc`),
  KEY `idx_thoigian` (`ThoiGian`),
  CONSTRAINT `fk_thongbao_ph_phuhuynh` FOREIGN KEY (`MaPhuHuynh`) REFERENCES `phuhuynh` (`MaPhuHuynh`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- AUTO INCREMENT
-- ========================================
ALTER TABLE `users` AUTO_INCREMENT = 11;
ALTER TABLE `vehicles` AUTO_INCREMENT = 6;
ALTER TABLE `routes` AUTO_INCREMENT = 1;
ALTER TABLE `pickuppoints` AUTO_INCREMENT = 1;
ALTER TABLE `schedules` AUTO_INCREMENT = 1;
ALTER TABLE `thongbao_phuhuynh` AUTO_INCREMENT = 1;

-- ========================================
-- ENABLE FOREIGN KEY CHECKS
-- ========================================
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
