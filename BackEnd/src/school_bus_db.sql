-- 1. CẤU HÌNH ĐẦU FILE
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

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `Id` varchar(20) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `MaBangLai` varchar(20) NOT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`) VALUES
('TX001', 'Võ Văn Mạnh', 'C1-555123', '0908765432', 3),
('TX002', 'Đỗ Thị Hương', 'C1-555234', '0902345678', 4),
('TX003', 'Bùi Văn Dũng', 'B2-555345', '0906789012', 5),
('TX004', 'Nguyễn Thị Kim', 'B2-555456', '0901111111', 6),
('TX005', 'Trần Văn Long', 'C1-555567', '0902222222', 7),
('TX006', 'Lê Thị Mai', 'C1-555678', '0903333333', NULL),
('TX007', 'Phạm Văn Nam', 'D-555789', '0904444444', NULL),
('TX008', 'Hoàng Thị Oanh', 'D-555890', '0905555555', NULL),
('TX009', 'Ngô Quang Liếm', 'B2-3131323123', '0898992341', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hocsinh`
--

CREATE TABLE `hocsinh` (
  `MaHocSinh` varchar(20) NOT NULL,
  `HoTen` varchar(100) NOT NULL,
  `Lop` varchar(20) DEFAULT NULL,
  `TinhTrang` enum('Chưa đón','Đã đón','Vắng','Đã trả') NOT NULL DEFAULT 'Chưa đón',
  `Capnhatlinhtrang` tinyint(1) DEFAULT 0,
  `MaPhuHuynh` varchar(20) DEFAULT NULL,
  `MaDiemDon` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hocsinh`
--

INSERT INTO `hocsinh` (`MaHocSinh`, `HoTen`, `Lop`, `TinhTrang`, `Capnhatlinhtrang`, `MaPhuHuynh`, `MaDiemDon`) VALUES
('HS001', 'Nguyễn Thị An', '6A1', 'Chưa đón', 0, 'PH001', 1),
('HS002', 'Phạm Văn Bình', '7B2', 'Chưa đón', 0, 'PH001', 2),
('HS003', 'Hoàng Thị Cúc', '8C3', 'Chưa đón', 0, 'PH002', 3),
('HS004', 'Trần Văn Dũng', '6A2', 'Chưa đón', 0, 'PH003', 4),
('HS005', 'Lê Thị Hoa', '7A1', 'Chưa đón', 0, 'PH004', 1),
('HS006', 'Võ Văn Kiên', '5B1', 'Chưa đón', 0, 'PH004', 5),
('HS007', 'Đỗ Thị Lan', '6B2', 'Chưa đón', 0, 'PH005', 6),
('HS008', 'Bùi Văn Minh', '8A1', 'Chưa đón', 0, 'PH006', 7),
('HS009', 'Phan Thị Ngọc', '7C1', 'Chưa đón', 0, 'PH007', 8),
('HS010', 'Lý Văn Phong', '6C2', 'Chưa đón', 0, 'PH007', 5),
('HS011', 'Nguyễn Văn Quang', '5A1', 'Chưa đón', 0, 'PH008', 9),
('HS012', 'Trần Thị Rạng', '7B1', 'Chưa đón', 0, 'PH009', 10),
('HS013', 'Lê Văn Sáng', '8B2', 'Chưa đón', 0, 'PH009', 11),
('HS014', 'Phạm Thị Tuyết', '6A3', 'Chưa đón', 0, 'PH010', 12),
('HS015', 'Võ Văn Uy', '7A2', 'Chưa đón', 0, 'PH010', 9);

-- --------------------------------------------------------

--
-- Table structure for table `phuhuynh`
--

CREATE TABLE `phuhuynh` (
  `MaPhuHuynh` varchar(20) NOT NULL,
  `HoTen` varchar(100) NOT NULL,
  `SoDienThoai` varchar(15) DEFAULT NULL,
  `Theodovithree` varchar(100) DEFAULT NULL,
  `Nhanthongbao` tinyint(1) DEFAULT 1,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `phuhuynh`
--

INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Theodovithree`, `Nhanthongbao`, `UserId`) VALUES
('PH001', 'Nguyễn Văn A', '0901234567', NULL, 1, 8),
('PH002', 'Trần Thị B', '0907654321', NULL, 1, 9),
('PH003', 'Lê Văn C', '0903456789', NULL, 1, 10),
('PH004', 'Phạm Thị D', '0909876543', NULL, 1, NULL),
('PH005', 'Võ Văn E', '0904444444', NULL, 1, NULL),
('PH006', 'Đỗ Thị F', '0905555555', NULL, 1, NULL),
('PH007', 'Bùi Văn G', '0906666666', NULL, 1, NULL),
('PH008', 'Hoàng Thị H', '0907777777', NULL, 1, NULL),
('PH009', 'Phan Văn I', '0908888888', NULL, 1, NULL),
('PH010', 'Lý Thị K', '0909999999', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pickuppoints`
--

CREATE TABLE `pickuppoints` (
  `Id` int(11) NOT NULL,
  `RouteId` int(11) NOT NULL,
  `Latitude` decimal(10,8) NOT NULL,
  `Longitude` decimal(11,8) NOT NULL,
  `PointOrder` int(11) NOT NULL,
  `PointName` varchar(255) DEFAULT NULL,
  `Address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pickuppoints`
--

INSERT INTO `pickuppoints` (`Id`, `RouteId`, `Latitude`, `Longitude`, `PointOrder`, `PointName`, `Address`) VALUES
(1, 1, 10.77688000, 106.70080000, 1, 'Nhà Thờ Đức Bà', '01 Công xã Paris, Bến Nghé, Quận 1'),
(2, 1, 10.77140000, 106.70420000, 2, 'Bitexco Financial Tower', '2 Hải Triều, Bến Nghé, Quận 1'),
(3, 1, 10.78210000, 106.69340000, 3, 'Công viên Tao Đàn', 'Trương Định, Quận 1'),
(4, 1, 10.77995000, 106.69968000, 4, 'Bưu điện Trung tâm', '2 Công xã Paris, Quận 1'),
(5, 2, 10.77230000, 106.69810000, 1, 'Chợ Bến Thành', 'Lê Lợi, Quận 1'),
(6, 2, 10.77739000, 106.69534000, 2, 'Dinh Độc Lập', '135 Nam Kỳ Khởi Nghĩa, Quận 1'),
(7, 2, 10.76279000, 106.68225000, 3, 'Bến Nhà Rồng', 'Nguyễn Tất Thành, Quận 4'),
(8, 2, 10.76837000, 106.69210000, 4, 'Bảo tàng Thành phố', '65 Lý Tự Trọng, Quận 1'),
(9, 3, 10.78547000, 106.70143000, 1, 'Chợ Tân Định', 'Hai Bà Trưng, Quận 1'),
(10, 3, 10.79234000, 106.70012000, 2, 'Công viên Lê Văn Tám', 'Võ Thị Sáu, Quận 3'),
(11, 3, 10.78901000, 106.69543000, 3, 'Nhà hát TP.HCM', 'Lam Sơn, Quận 1'),
(12, 3, 10.78234000, 106.70345000, 4, 'Landmark 81', 'Vinhomes Central Park, Bình Thạnh'),
(13, 4, 10.76234000, 106.70123000, 1, 'Nhà Văn hóa Thanh Niên', 'Phạm Ngọc Thạch, Quận 3'),
(14, 4, 10.76834000, 106.69876000, 2, 'Công viên 23/9', 'Phạm Ngũ Lão, Quận 1'),
(15, 4, 10.77123000, 106.70234000, 3, 'Bến Bạch Đằng', 'Tôn Đức Thắng, Quận 1'),
(16, 4, 10.76543000, 106.69234000, 4, 'Chợ Nguyễn Tri Phương', 'Nguyễn Tri Phương, Quận 10'),
(17, 5, 10.78654000, 106.69123000, 1, 'Trường THCS Lê Quý Đôn', 'Lê Quý Đôn, Quận 3'),
(18, 5, 10.77876000, 106.70456000, 2, 'Bảo tàng Lịch sử', 'Nguyễn Bỉnh Khiêm, Quận 1'),
(19, 5, 10.78012000, 106.69789000, 3, 'Thảo Cầm Viên', 'Nguyễn Thị Minh Khai, Quận 1'),
(20, 5, 10.77456000, 106.70567000, 4, 'Nhà thờ Tân Định', 'Hai Bà Trưng, Quận 3');


-- --------------------------------------------------------

--
-- Table structure for table `quanly`
--

CREATE TABLE `quanly` (
  `MaQuanLy` varchar(20) NOT NULL,
  `HoTen` varchar(100) NOT NULL,
  `SoDienThoai` varchar(15) DEFAULT NULL,
  `Taolichtinh` tinyint(1) DEFAULT 0,
  `Guithongbao` tinyint(1) DEFAULT 0,
  `Phancong` tinyint(1) DEFAULT 0,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quanly`
--

INSERT INTO `quanly` (`MaQuanLy`, `HoTen`, `SoDienThoai`, `Taolichtinh`, `Guithongbao`, `Phancong`, `UserId`) VALUES
('QL001', 'Bùi Bích Phương', '0912345678', 0, 0, 0, 1),
('QL002', 'Trần Minh Tuấn', '0913456789', 0, 0, 0, 2),
('QL003', 'Nguyễn Hồng Nhung', '0914567890', 0, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `Id` int(11) NOT NULL,
  `MaTuyen` varchar(20) DEFAULT NULL,
  `Name` varchar(255) NOT NULL,
  `DriverId` varchar(20) DEFAULT NULL,
  `VehicleId` int(11) DEFAULT NULL,
  `Status` enum('Chưa chạy','Đang chạy','Đã hoàn thành') NOT NULL DEFAULT 'Chưa chạy',
  `currentLatitude` decimal(10,8) DEFAULT NULL,
  `currentLongitude` decimal(11,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `routes`
--

INSERT INTO `routes` (`Id`, `MaTuyen`, `Name`, `DriverId`, `VehicleId`, `Status`, `currentLatitude`, `currentLongitude`) VALUES
(1, 'T001', 'Tuyến 1 - Sáng', 'TX001', 1, 'Chưa chạy', NULL, NULL),
(2, 'T002', 'Tuyến 2 - Chiều', 'TX002', 2, 'Chưa chạy', NULL, NULL),
(3, 'T003', 'Tuyến 3 - Sáng', 'TX003', 3, 'Chưa chạy', NULL, NULL),
(4, 'T004', 'Tuyến 4 - Chiều', 'TX004', 4, 'Chưa chạy', NULL, NULL),
(5, 'T005', 'Tuyến 5 - Sáng', 'TX005', 5, 'Chưa chạy', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `thongbao`
--

CREATE TABLE `thongbao` (
  `MaThongBao` varchar(20) NOT NULL,
  `NoiDung` text DEFAULT NULL,
  `ThoiGian` datetime DEFAULT NULL,
  `LoaiThongBao` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `thongbao`
--

INSERT INTO `thongbao` (`MaThongBao`, `NoiDung`, `ThoiGian`, `LoaiThongBao`) VALUES
('TB001', 'Thông báo nghỉ lễ Quốc khánh 2/9', '2025-10-25 08:00:00', 'Thông thường'),
('TB002', 'Thông báo thay đổi lịch trình tuyến 1', '2025-10-26 09:00:00', 'Khẩn cấp'),
('TB003', 'Thông báo bảo trì xe 51A-12345', '2025-10-27 07:30:00', 'Thông thường'),
('TB004', 'Cảnh báo giao thông đường Lê Lợi', '2025-10-28 06:45:00', 'Cảnh báo'),
('TB005', 'Thông báo điểm đón mới', '2025-10-29 10:00:00', 'Thông thường');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('admin','driver','parent') NOT NULL,
  `ProfileId` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

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

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `Id` int(11) NOT NULL,
  `LicensePlate` varchar(20) NOT NULL,
  `Model` varchar(100) DEFAULT NULL,
  `SpeedKmh` int(11) NOT NULL DEFAULT 40
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`Id`, `LicensePlate`, `Model`, `SpeedKmh`) VALUES
(1, '51A-123.45', 'Hyundai County 16 chỗ', 50),
(2, '51B-678.90', 'Toyota Coaster 29 chỗ', 45),
(3, '51C-555.55', 'Ford Transit 16 chỗ', 55),
(4, '5D-111.22', 'Mercedes Sprinter 16 chỗ', 50),
(5, '51E-999.88', 'Hyundai Solati 16 chỗ', 45),
(6, '51F-222.33', 'Thaco Town 29 chỗ', 48),
(7, '51G-444.55', 'Isuzu Samco 16 chỗ', 52),
(8, '51H-777.88', 'Peugeot Traveller 16 chỗ', 47);

-- --------------------------------------------------------

--
-- Table structure for table `thongbao_phuhuynh` (ĐÃ SỬA: BỎ CONSTRAINT Ở ĐÂY)
--

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
  KEY `idx_thoigian` (`ThoiGian`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `thongbao_phuhuynh`
--
INSERT INTO `thongbao_phuhuynh` (`MaThongBao`, `MaPhuHuynh`, `NoiDung`, `ThoiGian`, `LoaiThongBao`, `DaDoc`) VALUES
('TBPH001', 'PH001', 'Hệ thống cập nhật phiên bản mới', '2025-11-15 08:00:00', 'Thông báo', 1),
('TBPH002', 'PH001', 'Lịch bảo trì đột xuất vào 2:00 AM ngày mai', '2025-11-16 10:00:00', 'Cảnh báo', 0),
('TBPH003', 'PH002', 'Thông báo nghỉ lễ 30/4', '2025-11-14 15:30:00', 'Thông báo', 1);

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE IF NOT EXISTS `schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `status` int(11) DEFAULT 1 COMMENT '1: Sắp diễn ra, 2: Đang chạy, 3: Hoàn thành, 4: Hủy',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_route` (`route_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schedules`
--
INSERT INTO `schedules` (`route_id`, `date`, `start_time`, `status`) VALUES
(1, CURDATE(), '06:30:00', 3),       
(1, CURDATE(), '16:30:00', 1),       
(2, CURDATE(), '07:00:00', 2),       
(3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '06:45:00', 3), 
(4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '06:15:00', 1), 
(5, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '07:00:00', 4); 

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `MaBangLai` (`MaBangLai`),
  ADD UNIQUE KEY `UserId` (`UserId`);

--
-- Indexes for table `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD PRIMARY KEY (`MaHocSinh`),
  ADD KEY `idx_diemdon_hs` (`MaDiemDon`),
  ADD KEY `MaPhuHuynh` (`MaPhuHuynh`);

--
-- Indexes for table `phuhuynh`
--
ALTER TABLE `phuhuynh`
  ADD PRIMARY KEY (`MaPhuHuynh`),
  ADD UNIQUE KEY `UserId` (`UserId`),
  ADD KEY `idx_userid_ph` (`UserId`);

--
-- Indexes for table `pickuppoints`
--
ALTER TABLE `pickuppoints`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `RouteId` (`RouteId`);

--
-- Indexes for table `quanly`
--
ALTER TABLE `quanly`
  ADD PRIMARY KEY (`MaQuanLy`),
  ADD UNIQUE KEY `UserId` (`UserId`),
  ADD KEY `idx_userid_ql` (`UserId`);

--
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `MaTuyen` (`MaTuyen`),
  ADD KEY `DriverId` (`DriverId`),
  ADD KEY `VehicleId` (`VehicleId`);

--
-- Indexes for table `thongbao`
--
ALTER TABLE `thongbao`
  ADD PRIMARY KEY (`MaThongBao`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD KEY `idx_username` (`Username`),
  ADD KEY `idx_profile` (`ProfileId`,`Role`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `LicensePlate` (`LicensePlate`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `drivers`
--
ALTER TABLE `drivers`
  ADD CONSTRAINT `drivers_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE SET NULL;

--
-- Constraints for table `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD CONSTRAINT `fk_hocsinh_diemdon` FOREIGN KEY (`MaDiemDon`) REFERENCES `pickuppoints` (`Id`) ON DELETE SET NULL,
  ADD CONSTRAINT `hocsinh_ibfk_1` FOREIGN KEY (`MaPhuHuynh`) REFERENCES `phuhuynh` (`MaPhuHuynh`) ON DELETE SET NULL;

--
-- Constraints for table `phuhuynh`
--
ALTER TABLE `phuhuynh`
  ADD CONSTRAINT `fk_phuhuynh_users` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE SET NULL;

--
-- Constraints for table `pickuppoints`
--
ALTER TABLE `pickuppoints`
  ADD CONSTRAINT `pickuppoints_ibfk_1` FOREIGN KEY (`RouteId`) REFERENCES `routes` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `quanly`
--
ALTER TABLE `quanly`
  ADD CONSTRAINT `fk_quanly_users` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE SET NULL;

--
-- Constraints for table `routes`
--
ALTER TABLE `routes`
  ADD CONSTRAINT `routes_ibfk_1` FOREIGN KEY (`DriverId`) REFERENCES `drivers` (`Id`) ON DELETE SET NULL,
  ADD CONSTRAINT `routes_ibfk_2` FOREIGN KEY (`VehicleId`) REFERENCES `vehicles` (`Id`) ON DELETE SET NULL;

--
-- Constraints for table `thongbao_phuhuynh` (CHUYỂN XUỐNG ĐÂY)
--
ALTER TABLE `thongbao_phuhuynh`
  ADD CONSTRAINT `fk_thongbao_ph_phuhuynh` 
  FOREIGN KEY (`MaPhuHuynh`) 
  REFERENCES `phuhuynh` (`MaPhuHuynh`) 
  ON DELETE CASCADE;

--
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `fk_schedules_routes` FOREIGN KEY (`route_id`) REFERENCES `routes` (`Id`) ON DELETE CASCADE;

UPDATE `schedules` SET `status` = 1 WHERE `date` > CURDATE();

-- Reset lịch trình quá khứ về "Đã hoàn thành" (3) (trừ những cái đã hủy status=4)
UPDATE `schedules` SET `status` = 3 WHERE `date` < CURDATE() AND `status` != 4;

-- BẬT LẠI KIỂM TRA KHÓA NGOẠI
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;