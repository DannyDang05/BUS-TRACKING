-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: bustracking
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers` (
  `Id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FullName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaBangLai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PhoneNumber` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT '1' COMMENT 'Tài xế có đang hoạt động không',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `MaBangLai` (`MaBangLai`),
  UNIQUE KEY `UserId` (`UserId`),
  CONSTRAINT `drivers_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES ('TX001','Võ Văn Mạnh','C1-555123','0908765432',3,1),('TX002','Đỗ Thị Hương','C1-555234','0902345678',4,1),('TX003','Bùi Văn Dũng','B2-555345','0906789012',5,1),('TX004','Nguyễn Thị Kim','B2-555456','0901111111',6,1),('TX005','Trần Văn Long','C1-555567','0902222222',7,1);
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hocsinh`
--

DROP TABLE IF EXISTS `hocsinh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hocsinh` (
  `MaHocSinh` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HoTen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Lop` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaPhuHuynh` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DiaChi` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa chỉ nhà học sinh (dùng cho pickup)',
  `Latitude` decimal(10,8) NOT NULL COMMENT 'Vĩ độ (tự động từ địa chỉ hoặc nhập)',
  `Longitude` decimal(11,8) NOT NULL COMMENT 'Kinh độ (tự động từ địa chỉ hoặc nhập)',
  `TrangThaiHocTap` enum('Đang học','Nghỉ học','Chuyển trường') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Đang học' COMMENT 'Trạng thái học tập - CHỈ học sinh "Đang học" mới được phân tuyến',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`MaHocSinh`),
  KEY `idx_phuhuynh` (`MaPhuHuynh`),
  KEY `idx_location` (`Latitude`,`Longitude`),
  KEY `idx_trangthai` (`TrangThaiHocTap`),
  CONSTRAINT `hocsinh_ibfk_1` FOREIGN KEY (`MaPhuHuynh`) REFERENCES `phuhuynh` (`MaPhuHuynh`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hocsinh`
--

LOCK TABLES `hocsinh` WRITE;
/*!40000 ALTER TABLE `hocsinh` DISABLE KEYS */;
INSERT INTO `hocsinh` VALUES ('HS001','Nguyễn Thị An','6A1','PH001','01 Công xã Paris, Bến Nghé, Quận 1, TP.HCM',10.77688000,106.70080000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS002','Phạm Văn Bình','7B2','PH001','2 Hải Triều, Bến Nghé, Quận 1, TP.HCM',10.77140000,106.70420000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS003','Hoàng Thị Cúc','8C3','PH002','Trương Định, Quận 1, TP.HCM',10.78210000,106.69340000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS004','Trần Văn Dũng','6A2','PH003','2 Công xã Paris, Quận 1, TP.HCM',10.77995000,106.69968000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS005','Lê Thị Hoa','7A1','PH004','Lê Lợi, Quận 1, TP.HCM',10.77230000,106.69810000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS006','Võ Văn Kiên','5B1','PH004','135 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM',10.77739000,106.69534000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS007','Đỗ Thị Lan','6B2','PH005','Nguyễn Tất Thành, Quận 4, TP.HCM',10.76279000,106.68225000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS008','Bùi Văn Minh','8A1','PH006','65 Lý Tự Trọng, Quận 1, TP.HCM',10.76837000,106.69210000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS009','Phan Thị Ngọc','7C1','PH007','Hai Bà Trưng, Quận 1, TP.HCM',10.78547000,106.70143000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS010','Lý Văn Phong','6C2','PH007','Võ Thị Sáu, Quận 3, TP.HCM',10.79234000,106.70012000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS011','Nguyễn Văn Quang','5A1','PH008','Lam Sơn, Quận 1, TP.HCM',10.78901000,106.69543000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS012','Trần Thị Rạng','7B1','PH009','Vinhomes Central Park, Bình Thạnh, TP.HCM',10.78234000,106.70345000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS013','Lê Văn Sáng','8B2','PH009','Phạm Ngọc Thạch, Quận 3, TP.HCM',10.76234000,106.70123000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS014','Phạm Thị Tuyết','6A3','PH010','Phạm Ngũ Lão, Quận 1, TP.HCM',10.76834000,106.69876000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS015','Võ Văn Uy','7A2','PH010','Tôn Đức Thắng, Quận 1, TP.HCM',10.77123000,106.70234000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS016','Trần Thị Mai','6B1','PH003','10 Nguyễn Huệ, Quận 1, TP.HCM',10.77445000,106.70267000,'Nghỉ học','2025-11-26 13:58:56','2025-11-26 13:58:56'),('HS017','Lê Văn Tú','8A2','PH005','20 Lê Duẩn, Quận 1, TP.HCM',10.77890000,106.69990000,'Đang học','2025-11-26 13:58:56','2025-11-26 13:58:56');
/*!40000 ALTER TABLE `hocsinh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phuhuynh`
--

DROP TABLE IF EXISTS `phuhuynh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phuhuynh` (
  `MaPhuHuynh` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HoTen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoDienThoai` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Nhanthongbao` tinyint(1) DEFAULT '1',
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`MaPhuHuynh`),
  UNIQUE KEY `UserId` (`UserId`),
  CONSTRAINT `fk_phuhuynh_users` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phuhuynh`
--

LOCK TABLES `phuhuynh` WRITE;
/*!40000 ALTER TABLE `phuhuynh` DISABLE KEYS */;
INSERT INTO `phuhuynh` VALUES ('PH001','Nguyễn Văn A','0901234567',1,8),('PH002','Trần Thị B','0907654321',1,9),('PH003','Lê Văn C','0903456789',1,10),('PH004','Phạm Thị D','0909876543',1,NULL),('PH005','Võ Văn E','0904444444',1,NULL),('PH006','Đỗ Thị F','0905555555',1,NULL),('PH007','Bùi Văn G','0906666666',1,NULL),('PH008','Hoàng Thị H','0907777777',1,NULL),('PH009','Phan Văn I','0908888888',1,NULL),('PH010','Lý Thị K','0909999999',1,NULL);
/*!40000 ALTER TABLE `phuhuynh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pickuppoints`
--

DROP TABLE IF EXISTS `pickuppoints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pickuppoints` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RouteId` int NOT NULL COMMENT 'Tuyến xe',
  `MaHocSinh` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Học sinh được đón tại điểm này',
  `Latitude` decimal(10,8) NOT NULL COMMENT 'Vĩ độ điểm đón (copy từ hocsinh)',
  `Longitude` decimal(11,8) NOT NULL COMMENT 'Kinh độ điểm đón (copy từ hocsinh)',
  `DiaChi` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa chỉ điểm đón (copy từ hocsinh)',
  `PointOrder` int NOT NULL COMMENT 'Thứ tự điểm đón trên tuyến (1, 2, 3...)',
  `PointName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tên điểm đón (thường là tên học sinh)',
  `TinhTrangDon` enum('Chưa đón','Đã đón','Vắng','Đã trả') COLLATE utf8mb4_unicode_ci DEFAULT 'Chưa đón' COMMENT 'Trạng thái đón trả học sinh',
  `ThoiGianDonDuKien` time DEFAULT NULL COMMENT 'Thời gian đón dự kiến',
  `ThoiGianDonThucTe` datetime DEFAULT NULL COMMENT 'Thời gian đón thực tế',
  PRIMARY KEY (`Id`),
  KEY `RouteId` (`RouteId`),
  KEY `MaHocSinh` (`MaHocSinh`),
  KEY `idx_order` (`RouteId`,`PointOrder`),
  KEY `idx_tinhtrang` (`TinhTrangDon`),
  CONSTRAINT `pickuppoints_ibfk_1` FOREIGN KEY (`RouteId`) REFERENCES `routes` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `pickuppoints_ibfk_2` FOREIGN KEY (`MaHocSinh`) REFERENCES `hocsinh` (`MaHocSinh`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pickuppoints`
--

LOCK TABLES `pickuppoints` WRITE;
/*!40000 ALTER TABLE `pickuppoints` DISABLE KEYS */;
INSERT INTO `pickuppoints` VALUES (1,1,'HS001',10.77688000,106.70080000,'01 Công xã Paris, Bến Nghé, Quận 1, TP.HCM',1,'Điểm đón An','Chưa đón','06:30:00',NULL),(2,1,'HS002',10.77140000,106.70420000,'2 Hải Triều, Bến Nghé, Quận 1, TP.HCM',2,'Điểm đón Bình','Chưa đón','06:40:00',NULL),(3,2,'HS003',10.78210000,106.69340000,'Trương Định, Quận 1, TP.HCM',1,'Điểm đón Cúc','Chưa đón','07:00:00',NULL),(4,2,'HS004',10.77995000,106.69968000,'2 Công xã Paris, Quận 1, TP.HCM',2,'Điểm đón Dũng','Chưa đón','07:10:00',NULL),(5,3,'HS005',10.77230000,106.69810000,'Lê Lợi, Quận 1, TP.HCM',1,'Điểm đón Hoa','Chưa đón','06:35:00',NULL),(6,3,'HS006',10.77739000,106.69534000,'135 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM',2,'Điểm đón Kiên','Chưa đón','06:45:00',NULL);
/*!40000 ALTER TABLE `pickuppoints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quanly`
--

DROP TABLE IF EXISTS `quanly`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quanly` (
  `MaQuanLy` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HoTen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoDienThoai` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`MaQuanLy`),
  UNIQUE KEY `UserId` (`UserId`),
  CONSTRAINT `fk_quanly_users` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quanly`
--

LOCK TABLES `quanly` WRITE;
/*!40000 ALTER TABLE `quanly` DISABLE KEYS */;
INSERT INTO `quanly` VALUES ('QL001','Bùi Bích Phương','0912345678',1),('QL002','Trần Minh Tuấn','0913456789',2);
/*!40000 ALTER TABLE `quanly` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `MaTuyen` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DriverId` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `VehicleId` int DEFAULT NULL,
  `Status` enum('Chưa chạy','Đang chạy','Đã hoàn thành','Đã hủy') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Chưa chạy',
  `TotalDistance` decimal(10,2) DEFAULT NULL COMMENT 'Tổng quãng đường (km)',
  `EstimatedTime` int DEFAULT NULL COMMENT 'Thời gian ước tính (phút)',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `MaTuyen` (`MaTuyen`),
  KEY `DriverId` (`DriverId`),
  KEY `VehicleId` (`VehicleId`),
  KEY `idx_status` (`Status`),
  CONSTRAINT `routes_ibfk_1` FOREIGN KEY (`DriverId`) REFERENCES `drivers` (`Id`) ON DELETE SET NULL,
  CONSTRAINT `routes_ibfk_2` FOREIGN KEY (`VehicleId`) REFERENCES `vehicles` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (1,'TUYEN001','Tuyến 1','TX001',1,'Chưa chạy',12.50,25,'2025-11-26 13:59:16','2025-11-26 13:59:16'),(2,'TUYEN002','Tuyến 2','TX002',2,'Chưa chạy',15.00,30,'2025-11-26 13:59:16','2025-11-26 13:59:16'),(3,'TUYEN003','Tuyến 3','TX003',3,'Chưa chạy',10.00,20,'2025-11-26 13:59:16','2025-11-26 13:59:16');
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `route_id` int NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `status` enum('Sắp diễn ra','Đang chạy','Hoàn thành','Đã hủy') COLLATE utf8mb4_unicode_ci DEFAULT 'Sắp diễn ra',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_route` (`route_id`),
  KEY `idx_date` (`date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_schedules_routes` FOREIGN KEY (`route_id`) REFERENCES `routes` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,1,'2025-11-27','06:30:00','07:00:00','Sắp diễn ra','2025-11-26 13:59:33'),(2,2,'2025-11-27','06:50:00','07:20:00','Sắp diễn ra','2025-11-26 13:59:33'),(3,3,'2025-11-27','06:40:00','07:10:00','Sắp diễn ra','2025-11-26 13:59:33');
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thongbao`
--

DROP TABLE IF EXISTS `thongbao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thongbao` (
  `MaThongBao` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NoiDung` text COLLATE utf8mb4_unicode_ci,
  `ThoiGian` datetime DEFAULT NULL,
  `LoaiThongBao` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaThongBao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thongbao`
--

LOCK TABLES `thongbao` WRITE;
/*!40000 ALTER TABLE `thongbao` DISABLE KEYS */;
INSERT INTO `thongbao` VALUES ('TB001','Học sinh nhớ mang thẻ khi đi xe','2025-11-26 13:59:40','Thông báo'),('TB002','Xe tuyến 1 có thay đổi lịch trình','2025-11-26 13:59:40','Thông báo'),('TB003','Tài xế TX002 nghỉ phép hôm nay','2025-11-26 13:59:40','Thông báo');
/*!40000 ALTER TABLE `thongbao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thongbao_phuhuynh`
--

DROP TABLE IF EXISTS `thongbao_phuhuynh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thongbao_phuhuynh` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `MaThongBao` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaPhuHuynh` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NoiDung` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ThoiGian` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `LoaiThongBao` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Thông báo',
  `DaDoc` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `MaThongBao` (`MaThongBao`),
  KEY `idx_phuhuynh` (`MaPhuHuynh`),
  KEY `idx_dadoc` (`DaDoc`),
  KEY `idx_thoigian` (`ThoiGian`),
  CONSTRAINT `fk_thongbao_ph_phuhuynh` FOREIGN KEY (`MaPhuHuynh`) REFERENCES `phuhuynh` (`MaPhuHuynh`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thongbao_phuhuynh`
--

LOCK TABLES `thongbao_phuhuynh` WRITE;
/*!40000 ALTER TABLE `thongbao_phuhuynh` DISABLE KEYS */;
INSERT INTO `thongbao_phuhuynh` VALUES (1,'TB001','PH001','Học sinh nhớ mang thẻ khi đi xe','2025-11-26 13:59:47','Thông báo',0),(2,'TB002','PH002','Xe tuyến 1 có thay đổi lịch trình','2025-11-26 13:59:47','Thông báo',0),(3,'TB003','PH003','Tài xế TX002 nghỉ phép hôm nay','2025-11-26 13:59:47','Thông báo',0);
/*!40000 ALTER TABLE `thongbao_phuhuynh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Role` enum('admin','driver','parent') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ProfileId` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Username` (`Username`),
  KEY `idx_username` (`Username`),
  KEY `idx_profile` (`ProfileId`,`Role`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','1','admin','QL001','2025-11-26 13:58:55'),(2,'admin2','$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS','admin','QL002','2025-11-26 13:58:55'),(3,'taixe01','$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS','driver','TX001','2025-11-26 13:58:55'),(4,'taixe02','$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS','driver','TX002','2025-11-26 13:58:55'),(5,'taixe03','$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS','driver','TX003','2025-11-26 13:58:55'),(6,'taixe04','$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS','driver','TX004','2025-11-26 13:58:55'),(7,'taixe05','$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS','driver','TX005','2025-11-26 13:58:55'),(8,'phuhuynh01','1','parent','PH001','2025-11-26 13:58:55'),(9,'phuhuynh02','$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS','parent','PH002','2025-11-26 13:58:55'),(10,'phuhuynh03','$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS','parent','PH003','2025-11-26 13:58:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `LicensePlate` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Model` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Capacity` int NOT NULL DEFAULT '16' COMMENT 'Số chỗ ngồi của xe',
  `SpeedKmh` int NOT NULL DEFAULT '40' COMMENT 'Tốc độ trung bình (km/h)',
  `IsActive` tinyint(1) DEFAULT '1' COMMENT 'Xe có đang hoạt động không',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `LicensePlate` (`LicensePlate`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,'51A-123.45','Hyundai County 16 chỗ',16,50,1),(2,'51B-678.90','Toyota Coaster 29 chỗ',29,45,1),(3,'51C-555.55','Ford Transit 16 chỗ',16,55,1),(4,'5D-111.22','Mercedes Sprinter 16 chỗ',16,50,1),(5,'51E-999.88','Hyundai Solati 16 chỗ',16,45,1);
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 22:26:28
