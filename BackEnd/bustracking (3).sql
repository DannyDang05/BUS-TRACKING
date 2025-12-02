-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2025 at 06:03 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bustracking`
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
  `UserId` int(11) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1 COMMENT 'Tài xế có đang hoạt động không'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES
('TX_1', 'Nguyễn Kim Nhi', 'DL-88861-1-', '0906332966', 11, 1),
('TX_10', 'Võ Minh Hùng', 'DL-79101-10-', '0986933920', 20, 1),
('TX_11', 'Huỳnh Quốc Trang', 'DL-90917-11-', '0908007495', 21, 1),
('TX_12', 'Vũ Minh Giang', 'DL-61856-12-', '0958424503', 22, 1),
('TX_13', 'Dương Xuân An', 'DL-20064-13-', '0939919313', 23, 1),
('TX_14', 'Lê Quốc Trung', 'DL-65029-14-', '0979414805', 24, 1),
('TX_15', 'Dương Đức Vân', 'DL-26658-15-', '0995241132', 25, 1),
('TX_16', 'Trần Gia Khánh', 'DL-57071-16-', '0966619959', 26, 1),
('TX_17', 'Nguyễn Thị Yến', 'DL-24425-17-', '0959506302', 27, 1),
('TX_18', 'Đỗ Hữu Long', 'DL-42388-18-', '0983633363', 28, 1),
('TX_19', 'Võ Minh Mai', 'DL-62385-19-', '0947898889', 29, 1),
('TX_2', 'Dương Gia Thảo', 'DL-43789-2-', '0903930239', 12, 1),
('TX_20', 'Phạm Hữu Minh', 'DL-21268-20-', '0927092174', 30, 1),
('TX_3', 'Ngô Kim Việt', 'DL-47389-3-', '0924706259', 13, 1),
('TX_4', 'Lê Quốc Quỳnh', 'DL-14000-4-', '0938328997', 14, 1),
('TX_5', 'Đỗ Xuân Tuấn', 'DL-68189-5-', '0901031649', 15, 1),
('TX_6', 'Bùi Thị Nam', 'DL-34156-6-', '0946674132', 16, 1),
('TX_7', 'Dương Đức An', 'DL-75798-7-', '0908421450', 17, 1),
('TX_8', 'Phan Thị Vy', 'DL-43801-8-', '0910017166', 18, 1),
('TX_9', 'Đỗ Quốc Phượng', 'DL-65987-9-', '0922731089', 19, 1),
('TX001', 'Võ Văn Mạnh', 'C1-555123', '0908765432', 3, 1),
('TX002', 'Đỗ Thị Hương', 'C1-555234', '0902345678', 4, 1),
('TX003', 'Bùi Văn Dũng', 'B2-555345', '0906789012', 5, 1),
('TX004', 'Nguyễn Thị Kim', 'B2-555456', '0901111111', 6, 1),
('TX005', 'Trần Văn Long', 'C1-555567', '0902222222', 7, 1);

-- --------------------------------------------------------

--
-- Table structure for table `hocsinh`
--

CREATE TABLE `hocsinh` (
  `MaHocSinh` varchar(20) NOT NULL,
  `HoTen` varchar(100) NOT NULL,
  `Lop` varchar(20) DEFAULT NULL,
  `MaPhuHuynh` varchar(20) DEFAULT NULL,
  `DiaChi` text NOT NULL COMMENT 'Địa chỉ nhà học sinh (dùng cho pickup)',
  `Latitude` decimal(10,8) NOT NULL COMMENT 'Vĩ độ (tự động từ địa chỉ hoặc nhập)',
  `Longitude` decimal(11,8) NOT NULL COMMENT 'Kinh độ (tự động từ địa chỉ hoặc nhập)',
  `TrangThaiHocTap` enum('Đang học','Nghỉ học','Chuyển trường') NOT NULL DEFAULT 'Đang học' COMMENT 'Trạng thái học tập - CHỈ học sinh "Đang học" mới được phân tuyến',
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hocsinh`
--

INSERT INTO `hocsinh` (`MaHocSinh`, `HoTen`, `Lop`, `MaPhuHuynh`, `DiaChi`, `Latitude`, `Longitude`, `TrangThaiHocTap`, `CreatedAt`, `UpdatedAt`) VALUES
('HS_1', 'Hồ Minh Hùng', '4D1', 'PH_1', '484 Pasteur, Phú Nhuận, TP.HCM', 10.74442427, 106.62295436, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_10', 'Huỳnh Thanh Nhi', '5A1', 'PH_10', '467 Hai Bà Trưng, Quận 4, TP.HCM', 10.72631259, 106.68178227, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_100', 'Lê Minh Thắng', '5B2', 'PH_100', '713 Điện Biên Phủ, Quận 1, TP.HCM', 10.80256797, 106.69654150, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_101', 'Lý Thanh Vy', '3B3', 'PH_101', '291 Pasteur, Quận 10, TP.HCM', 10.78835787, 106.67842059, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_102', 'Ngô Đức Huy', '2A2', 'PH_102', '625 Cách Mạng Tháng 8, Quận 5, TP.HCM', 10.73200986, 106.66216702, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_161', 'Nguyễn Mỹ Quân', '1B2', 'PH_161', '879 Nguyễn Thị Minh Khai, Quận 4, TP.HCM', 10.77059660, 106.65718237, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_162', 'Võ Minh Vân', '1A3', 'PH_162', '838 Võ Thị Sáu, Phú Nhuận, TP.HCM', 10.74896122, 106.67142507, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_163', 'Đỗ Mỹ Linh', '3D3', 'PH_163', '698 Lê Lợi, Phú Nhuận, TP.HCM', 10.79156543, 106.68164766, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_164', 'Võ Hữu Huy', '2B1', 'PH_164', '502 Hai Bà Trưng, Quận 1, TP.HCM', 10.72062152, 106.65376340, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_165', 'Nguyễn Thanh Nhi', '1A3', 'PH_165', '598 Nguyễn Huệ, Phú Nhuận, TP.HCM', 10.71299507, 106.61523516, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_166', 'Lê Mỹ Long', '4B3', 'PH_166', '320 Nguyễn Trãi, Quận 3, TP.HCM', 10.73612177, 106.68908332, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_167', 'Phan Thanh Giang', '3D2', 'PH_167', '479 Võ Thị Sáu, Bình Thạnh, TP.HCM', 10.78573979, 106.66025711, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_168', 'Võ Hữu Tùng', '2A3', 'PH_168', '609 Đồng Khởi, Quận 1, TP.HCM', 10.81169918, 106.65679595, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_169', 'Nguyễn Quốc Nhi', '2B1', 'PH_169', '983 Điện Biên Phủ, Quận 5, TP.HCM', 10.78161098, 106.70284771, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_177', 'Đỗ Quốc Quang', '2C1', 'PH_177', '213 Nguyễn Trãi, Quận 5, TP.HCM', 10.74136798, 106.66203877, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_178', 'Phan Mỹ Vy', '4A2', 'PH_178', '646 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM', 10.72681088, 106.66123742, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_179', 'Trần Kim Lan', '2B1', 'PH_179', '649 Hai Bà Trưng, Quận 4, TP.HCM', 10.71702157, 106.62314769, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_18', 'Lê Mỹ Huy', '3B3', 'PH_18', '340 Nam Kỳ Khởi Nghĩa, Quận 5, TP.HCM', 10.80718333, 106.69324441, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_180', 'Lê Quốc Quân', '5A2', 'PH_180', '217 Nam Kỳ Khởi Nghĩa, Bình Thạnh, TP.HCM', 10.71732863, 106.61499695, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_181', 'Nguyễn Mỹ An', '1B1', 'PH_181', '807 Đồng Khởi, Phú Nhuận, TP.HCM', 10.72370241, 106.69479622, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_182', 'Lê Minh Vân', '2C1', 'PH_182', '144 Lý Tự Trọng, Bình Thạnh, TP.HCM', 10.72052414, 106.62346330, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_183', 'Phạm Quốc Việt', '2B1', 'PH_183', '99 Võ Thị Sáu, Bình Thạnh, TP.HCM', 10.78921898, 106.70969035, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_184', 'Phan Thị Long', '2D2', 'PH_184', '227 Nguyễn Trãi, Quận 3, TP.HCM', 10.77249961, 106.69230923, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_185', 'Huỳnh Xuân Yến', '5A3', 'PH_185', '742 Nguyễn Huệ, Quận 1, TP.HCM', 10.77466545, 106.61917993, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_186', 'Nguyễn Mỹ Dũng', '2D3', 'PH_186', '951 Võ Thị Sáu, Quận 4, TP.HCM', 10.79372615, 106.69328364, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_187', 'Trần Thu An', '3B1', 'PH_187', '108 Điện Biên Phủ, Phú Nhuận, TP.HCM', 10.72733783, 106.61755834, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_188', 'Hồ Quốc Uyên', '2D1', 'PH_188', '770 Lê Lợi, Quận 3, TP.HCM', 10.80389946, 106.70635505, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_189', 'Huỳnh Thị Dũng', '1A3', 'PH_189', '372 Võ Thị Sáu, Quận 10, TP.HCM', 10.77398983, 106.70396031, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_19', 'Bùi Quốc Vy', '2C1', 'PH_19', '610 Nguyễn Trãi, Quận 4, TP.HCM', 10.76119935, 106.61054879, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_190', 'Võ Thị Tùng', '4A3', 'PH_190', '477 Cách Mạng Tháng 8, Bình Thạnh, TP.HCM', 10.76895309, 106.63942439, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_191', 'Phan Văn Sơn', '2A2', 'PH_191', '705 Pasteur, Phú Nhuận, TP.HCM', 10.77001147, 106.69007004, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_192', 'Bùi Đức An', '1B2', 'PH_192', '963 Hai Bà Trưng, Quận 10, TP.HCM', 10.71279264, 106.69571056, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_202', 'Trần Quốc Phúc', '4C3', 'PH_202', '680 Hai Bà Trưng, Quận 1, TP.HCM', 10.75398772, 106.70238522, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_20251130_0001', 'lê thanh phat', '10A1', 'PH_1', 'Hẻm 360 Phạm Hữu Lầu, Phước Kiển, 73200, Nhà Bè, Thành phố Hồ Chí Minh, Việt Nam', 10.70725800, 106.72134400, '', '2025-11-30 06:16:21', '2025-11-30 06:16:21'),
('HS_203', 'Hồ Xuân Quỳnh', '3B2', 'PH_203', '275 Nguyễn Huệ, Quận 5, TP.HCM', 10.71757742, 106.61457258, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_216', 'Bùi Hữu Tùng', '3B2', 'PH_216', '101 Nam Kỳ Khởi Nghĩa, Quận 10, TP.HCM', 10.75597315, 106.63551171, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_22', 'Vũ Đức Long', '4D3', 'PH_22', '264 Nguyễn Huệ, Phú Nhuận, TP.HCM', 10.78047688, 106.63446220, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_223', 'Ngô Kim Việt', '2B2', 'PH_223', '359 Đồng Khởi, Quận 3, TP.HCM', 10.72129663, 106.65695248, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_228', 'Đặng Gia Thảo', '4C3', 'PH_228', '564 Nguyễn Trãi, Quận 10, TP.HCM', 10.71834758, 106.65111484, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_231', 'Phan Quốc An', '4B1', 'PH_231', '941 Cách Mạng Tháng 8, Quận 1, TP.HCM', 10.80562268, 106.63338171, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_259', 'Bùi Minh Nam', '2B1', 'PH_259', '31 Lê Duẩn, Quận 3, TP.HCM', 10.76401881, 106.67676423, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_288', 'Bùi Kim Bình', '1D1', 'PH_288', '174 Lê Duẩn, Phú Nhuận, TP.HCM', 10.74625067, 106.66046404, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_289', 'Nguyễn Quốc Trang', '2A2', 'PH_289', '679 Tôn Đức Thắng, Quận 10, TP.HCM', 10.73708710, 106.63718700, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_292', 'Đỗ Văn Quang', '4C1', 'PH_292', '816 Lê Duẩn, Quận 5, TP.HCM', 10.72931981, 106.64036624, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_34', 'Huỳnh Xuân Cường', '5C2', 'PH_34', '640 Lê Lợi, Quận 5, TP.HCM', 10.72693574, 106.69593086, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_36', 'Hoàng Đức Vân', '3A3', 'PH_36', '819 Đồng Khởi, Bình Thạnh, TP.HCM', 10.77739372, 106.67705090, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_4', 'Dương Minh Việt', '5C3', 'PH_4', '860 Cách Mạng Tháng 8, Quận 1, TP.HCM', 10.78434996, 106.61332125, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_44', 'Hồ Minh Giang', '2C2', 'PH_44', '206 Lê Duẩn, Quận 1, TP.HCM', 10.79465622, 106.63451624, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_45', 'Trần Thanh Quỳnh', '5B1', 'PH_45', '803 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 10.77381207, 106.63308015, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_46', 'Lê Kim Phượng', '3D3', 'PH_46', '105 Nam Kỳ Khởi Nghĩa, Bình Thạnh, TP.HCM', 10.78470888, 106.65276333, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_47', 'Ngô Xuân Trang', '1C3', 'PH_47', '421 Trần Hưng Đạo, Quận 3, TP.HCM', 10.77466646, 106.61074347, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_48', 'Phan Quốc An', '5C1', 'PH_48', '473 Pasteur, Quận 10, TP.HCM', 10.72018652, 106.62550558, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_49', 'Bùi Hữu Long', '3C2', 'PH_49', '571 Nam Kỳ Khởi Nghĩa, Quận 4, TP.HCM', 10.79232365, 106.65874584, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_5', 'Phan Xuân Lan', '2C2', 'PH_5', '448 Trần Hưng Đạo, Bình Thạnh, TP.HCM', 10.76618573, 106.62210104, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_50', 'Hoàng Thu Yến', '4D2', 'PH_50', '227 Nguyễn Trãi, Quận 4, TP.HCM', 10.81188961, 106.66668034, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03'),
('HS_51', 'Bùi Minh Giang', '2A1', 'PH_51', '904 Nguyễn Huệ, Quận 1, TP.HCM', 10.75707225, 106.68294009, 'Đang học', '2025-11-24 12:07:03', '2025-11-24 12:07:03');

-- --------------------------------------------------------

--
-- Table structure for table `phuhuynh`
--

CREATE TABLE `phuhuynh` (
  `MaPhuHuynh` varchar(20) NOT NULL,
  `HoTen` varchar(100) NOT NULL,
  `SoDienThoai` varchar(15) DEFAULT NULL,
  `Nhanthongbao` tinyint(1) DEFAULT 1,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `phuhuynh`
--

INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES
('PH_1', 'Võ Xuân Tùng', '0975774404', 1, 31),
('PH_10', 'Phan Mỹ Nam', '0990678322', 1, 40),
('PH_100', 'Phan Thị Trung', '0984940996', 1, 130),
('PH_101', 'Bùi Minh Trang', '0957852709', 1, 131),
('PH_102', 'Lý Minh Dũng', '0978102587', 1, 132),
('PH_103', 'Võ Văn Vy', '0910072766', 1, 133),
('PH_104', 'Phan Mỹ Quang', '0922534074', 1, 134),
('PH_105', 'Bùi Thị Trung', '0922946808', 1, 135),
('PH_106', 'Phạm Kim Nam', '0925933143', 1, 136),
('PH_107', 'Lê Thị Lan', '0991255447', 1, 137),
('PH_108', 'Vũ Đức Việt', '0983343558', 1, 138),
('PH_109', 'Phan Thanh Thảo', '0989077294', 1, 139),
('PH_11', 'Đặng Kim Linh', '0991816675', 1, 41),
('PH_110', 'Huỳnh Thu Thủy', '0918317930', 1, 140),
('PH_111', 'Đỗ Thanh Yến', '0952320173', 1, 141),
('PH_112', 'Võ Hữu Quỳnh', '0959858446', 1, 142),
('PH_113', 'Đỗ Hữu Vy', '0981385282', 1, 143),
('PH_114', 'Võ Văn Bình', '0924803723', 1, 144),
('PH_115', 'Phan Thanh Nam', '0944411806', 1, 145),
('PH_116', 'Hồ Văn Linh', '0960995278', 1, 146),
('PH_117', 'Đặng Kim Trang', '0990513175', 1, 147),
('PH_118', 'Hoàng Văn Nam', '0921149782', 1, 148),
('PH_119', 'Ngô Kim Nam', '0958466009', 1, 149),
('PH_12', 'Ngô Kim Tuấn', '0911433188', 1, 42),
('PH_120', 'Trần Thu Nga', '0906201929', 1, 150),
('PH_121', 'Hoàng Xuân Thảo', '0955292403', 1, 151),
('PH_122', 'Ngô Văn Trang', '0954094817', 1, 152),
('PH_123', 'Ngô Đức Phúc', '0992866077', 1, 153),
('PH_124', 'Bùi Thị Việt', '0963921610', 1, 154),
('PH_125', 'Hồ Đức Thắng', '0977882351', 1, 155),
('PH_126', 'Dương Minh Long', '0912824848', 1, 156),
('PH_127', 'Phan Thu Việt', '0905517602', 1, 157),
('PH_128', 'Ngô Gia Vy', '0955963954', 1, 158),
('PH_129', 'Trần Văn Phúc', '0985776583', 1, 159),
('PH_13', 'Hồ Đức Khánh', '0988589614', 1, 43),
('PH_130', 'Huỳnh Văn Long', '0972986589', 1, 160),
('PH_131', 'Ngô Văn Lan', '0948958900', 1, 161),
('PH_132', 'Dương Hữu Yến', '0906232256', 1, 162),
('PH_133', 'Lê Gia Nhi', '0922979003', 1, 163),
('PH_134', 'Hồ Hữu Quỳnh', '0985735798', 1, 164),
('PH_135', 'Lý Văn Vân', '0914302251', 1, 165),
('PH_136', 'Ngô Mỹ Giang', '0913923415', 1, 166),
('PH_137', 'Ngô Mỹ Hùng', '0914883190', 1, 167),
('PH_138', 'Võ Thị Quỳnh', '0940950893', 1, 168),
('PH_139', 'Vũ Quốc Hải', '0905457205', 1, 169),
('PH_14', 'Vũ Kim Hải', '0927731284', 1, 44),
('PH_140', 'Ngô Thu Phúc', '0907318728', 1, 170),
('PH_141', 'Trần Thanh Linh', '0997493063', 1, 171),
('PH_142', 'Hoàng Văn Dũng', '0991033981', 1, 172),
('PH_143', 'Phan Minh Dũng', '0930315833', 1, 173),
('PH_144', 'Phan Hữu Việt', '0957625162', 1, 174),
('PH_145', 'Đặng Thu Thủy', '0924216466', 1, 175),
('PH_146', 'Đặng Xuân Việt', '0920338240', 1, 176),
('PH_147', 'Bùi Minh Long', '0929283561', 1, 177),
('PH_148', 'Lê Thị Quân', '0961451067', 1, 178),
('PH_149', 'Huỳnh Minh Khánh', '0992842589', 1, 179),
('PH_15', 'Hoàng Thị Tùng', '0986854756', 1, 45),
('PH_150', 'Phan Thị Phượng', '0960465300', 1, 180),
('PH_151', 'Dương Xuân Vy', '0934765011', 1, 181),
('PH_152', 'Võ Gia Phúc', '0975703388', 1, 182),
('PH_153', 'Lê Đức Sơn', '0952365985', 1, 183),
('PH_154', 'Phan Minh Vân', '0961802283', 1, 184),
('PH_155', 'Ngô Văn Tùng', '0974725978', 1, 185),
('PH_156', 'Bùi Gia Trung', '0932235542', 1, 186),
('PH_157', 'Phạm Kim Nam', '0923956417', 1, 187),
('PH_158', 'Đỗ Kim Tùng', '0955799731', 1, 188),
('PH_159', 'Lý Minh Nam', '0940769567', 1, 189),
('PH_16', 'Ngô Quốc Lan', '0951233225', 1, 46),
('PH_160', 'Võ Gia Nam', '0932959198', 1, 190),
('PH_161', 'Trần Hữu Trung', '0913058918', 1, 191),
('PH_162', 'Bùi Mỹ Quỳnh', '0949338870', 1, 192),
('PH_163', 'Lý Quốc Vân', '0907608441', 1, 193),
('PH_164', 'Ngô Kim Phượng', '0930099134', 1, 194),
('PH_165', 'Hồ Xuân Dũng', '0968202928', 1, 195),
('PH_166', 'Võ Mỹ Thủy', '0901479747', 1, 196),
('PH_167', 'Huỳnh Thị Sơn', '0947915658', 1, 197),
('PH_168', 'Đỗ Thanh Sơn', '0962160020', 1, 198),
('PH_169', 'Phạm Thị Nam', '0943078841', 1, 199),
('PH_17', 'Huỳnh Thanh Huy', '0906493144', 1, 47),
('PH_170', 'Huỳnh Thanh Quỳnh', '0973951368', 1, 200),
('PH_171', 'Vũ Quốc Minh', '0960939733', 1, 201),
('PH_172', 'Đặng Kim Thảo', '0934552352', 1, 202),
('PH_173', 'Vũ Mỹ Sơn', '0927826004', 1, 203),
('PH_174', 'Ngô Quốc Thảo', '0915237238', 1, 204),
('PH_175', 'Võ Xuân Trang', '0980204019', 1, 205),
('PH_176', 'Phan Thanh Trang', '0957084037', 1, 206),
('PH_177', 'Phạm Gia Uyên', '0926003294', 1, 207),
('PH_178', 'Nguyễn Thu Trung', '0983345555', 1, 208),
('PH_179', 'Phạm Gia Linh', '0907188171', 1, 209),
('PH_18', 'Hồ Hữu Tuấn', '0927609561', 1, 48),
('PH_180', 'Bùi Đức Uyên', '0955411913', 1, 210),
('PH_181', 'Vũ Thị Nam', '0901657980', 1, 211),
('PH_182', 'Phan Thanh Hải', '0984493216', 1, 212),
('PH_183', 'Hoàng Văn Thảo', '0991822866', 1, 213),
('PH_184', 'Vũ Minh Yến', '0983387470', 1, 214),
('PH_185', 'Trần Văn Huy', '0995180329', 1, 215),
('PH_186', 'Huỳnh Văn Dũng', '0955315001', 1, 216),
('PH_187', 'Phan Thanh Trung', '0931460116', 1, 217),
('PH_188', 'Phan Đức Hải', '0943039049', 1, 218),
('PH_189', 'Lý Gia Hùng', '0949158020', 1, 219),
('PH_19', 'Ngô Quốc Quỳnh', '0914170205', 1, 49),
('PH_190', 'Bùi Thanh Linh', '0957313603', 1, 220),
('PH_191', 'Đặng Kim Lan', '0975839497', 1, 221),
('PH_192', 'Bùi Gia Sơn', '0992998106', 1, 222),
('PH_193', 'Đỗ Gia Thắng', '0900727480', 1, 223),
('PH_194', 'Phạm Mỹ Trang', '0995828911', 1, 224),
('PH_195', 'Đỗ Thanh Yến', '0912625594', 1, 225),
('PH_196', 'Phan Minh Giang', '0996620427', 1, 226),
('PH_197', 'Phan Hữu Mai', '0939003220', 1, 227),
('PH_198', 'Bùi Hữu Thảo', '0933184380', 1, 228),
('PH_199', 'Vũ Thị Khánh', '0950071702', 1, 229),
('PH_2', 'Lý Đức Lan', '0976936529', 1, 32),
('PH_20', 'Huỳnh Minh Trang', '0995637970', 1, 50),
('PH_200', 'Hồ Minh Quang', '0953045073', 1, 230),
('PH_201', 'Vũ Xuân Lan', '0972791744', 1, 231),
('PH_202', 'Hồ Gia Minh', '0993013802', 1, 232),
('PH_203', 'Đặng Gia Minh', '0996662727', 1, 233),
('PH_204', 'Nguyễn Hữu Linh', '0990757034', 1, 234),
('PH_205', 'Đỗ Gia Lan', '0985888592', 1, 235),
('PH_206', 'Bùi Thanh Nam', '0955076440', 1, 236),
('PH_207', 'Lê Gia Khánh', '0979169025', 1, 237),
('PH_208', 'Nguyễn Văn Lan', '0976282627', 1, 238),
('PH_209', 'Lý Minh Vân', '0950619475', 1, 239),
('PH_21', 'Bùi Kim Thắng', '0926590697', 1, 51),
('PH_210', 'Huỳnh Xuân Việt', '0914980412', 1, 240),
('PH_211', 'Hoàng Thu Trang', '0903368964', 1, 241),
('PH_212', 'Dương Xuân Cường', '0987378229', 1, 242),
('PH_213', 'Lê Gia Khánh', '0972445466', 1, 243),
('PH_214', 'Dương Đức Yến', '0980171672', 1, 244),
('PH_215', 'Vũ Thanh Uyên', '0943960772', 1, 245),
('PH_216', 'Phan Văn Vy', '0938655585', 1, 246),
('PH_217', 'Vũ Văn Long', '0942158117', 1, 247),
('PH_218', 'Võ Quốc Trung', '0903649204', 1, 248),
('PH_219', 'Võ Mỹ Tuấn', '0983108932', 1, 249),
('PH_22', 'Vũ Văn Lan', '0940499474', 1, 52),
('PH_220', 'Hoàng Mỹ Tuấn', '0933139861', 1, 250),
('PH_221', 'Hồ Xuân Tuấn', '0932939890', 1, 251),
('PH_222', 'Đặng Đức Bình', '0943536522', 1, 252),
('PH_223', 'Phạm Minh Sơn', '0959106744', 1, 253),
('PH_224', 'Hồ Mỹ Nhi', '0919136081', 1, 254),
('PH_225', 'Ngô Mỹ Tuấn', '0952075741', 1, 255),
('PH_226', 'Huỳnh Hữu Nhi', '0916203095', 1, 256),
('PH_227', 'Bùi Kim An', '0981266790', 1, 257),
('PH_228', 'Nguyễn Đức Trung', '0982725289', 1, 258),
('PH_229', 'Hồ Mỹ Sơn', '0913484073', 1, 259),
('PH_23', 'Đỗ Thanh Lan', '0991091202', 1, 53),
('PH_230', 'Đỗ Thị Việt', '0928582593', 1, 260),
('PH_231', 'Ngô Hữu Vân', '0954736842', 1, 261),
('PH_232', 'Nguyễn Kim Quang', '0948273032', 1, 262),
('PH_233', 'Võ Gia Cường', '0923692321', 1, 263),
('PH_234', 'Vũ Minh Mai', '0984765454', 1, 264),
('PH_235', 'Dương Quốc Nhi', '0994647552', 1, 265),
('PH_236', 'Vũ Đức Quang', '0920568726', 1, 266),
('PH_237', 'Hồ Thanh Thủy', '0924175117', 1, 267),
('PH_238', 'Hoàng Mỹ Huy', '0949280736', 1, 268),
('PH_239', 'Phan Kim Tùng', '0941432442', 1, 269),
('PH_24', 'Trần Minh Huy', '0944907539', 1, 54),
('PH_240', 'Vũ Văn Nam', '0995965726', 1, 270),
('PH_241', 'Ngô Gia Thắng', '0954435014', 1, 271),
('PH_242', 'Đỗ Gia Sơn', '0902077083', 1, 272),
('PH_243', 'Lê Thu Long', '0934734497', 1, 273),
('PH_244', 'Phan Xuân Tuấn', '0914208807', 1, 274),
('PH_245', 'Dương Hữu Long', '0982674276', 1, 275),
('PH_246', 'Phạm Văn Cường', '0920629718', 1, 276),
('PH_247', 'Hồ Hữu Thủy', '0942061158', 1, 277),
('PH_248', 'Vũ Gia Hải', '0997569537', 1, 278),
('PH_249', 'Phạm Mỹ Phượng', '0948194639', 1, 279),
('PH_25', 'Phạm Gia Quân', '0919462375', 1, 55),
('PH_250', 'Võ Thanh Trung', '0908405680', 1, 280),
('PH_251', 'Đặng Gia Quân', '0961628876', 1, 281),
('PH_252', 'Ngô Hữu Sơn', '0955844859', 1, 282),
('PH_253', 'Vũ Gia Trung', '0921428730', 1, 283),
('PH_254', 'Võ Kim Thủy', '0984201774', 1, 284),
('PH_255', 'Vũ Văn Dũng', '0988148796', 1, 285),
('PH_256', 'Dương Hữu Phượng', '0950561648', 1, 286),
('PH_257', 'Ngô Thị Vân', '0939243681', 1, 287),
('PH_258', 'Võ Hữu Minh', '0909907519', 1, 288),
('PH_259', 'Bùi Gia Cường', '0991874231', 1, 289),
('PH_26', 'Vũ Kim Minh', '0983619988', 1, 56),
('PH_260', 'Vũ Đức Tùng', '0942248105', 1, 290),
('PH_261', 'Dương Văn Bình', '0985789928', 1, 291),
('PH_262', 'Đặng Thu Quân', '0938727689', 1, 292),
('PH_263', 'Đỗ Gia Dũng', '0936236220', 1, 293),
('PH_264', 'Lý Hữu Lan', '0953625543', 1, 294),
('PH_265', 'Đỗ Văn Phượng', '0937028679', 1, 295),
('PH_266', 'Lê Đức Cường', '0903845363', 1, 296),
('PH_267', 'Lý Thu Thắng', '0907189969', 1, 297),
('PH_268', 'Đỗ Gia Trung', '0932806579', 1, 298),
('PH_269', 'Trần Quốc Quân', '0996641156', 1, 299),
('PH_27', 'Phan Kim Bình', '0972681558', 1, 57),
('PH_270', 'Huỳnh Thị Giang', '0993238447', 1, 300),
('PH_271', 'Vũ Thanh Vy', '0987355928', 1, 301),
('PH_272', 'Hồ Mỹ Nhi', '0933869573', 1, 302),
('PH_273', 'Hoàng Gia Hùng', '0929382845', 1, 303),
('PH_274', 'Dương Thị Thảo', '0956267334', 1, 304),
('PH_275', 'Huỳnh Minh Tùng', '0902591728', 1, 305),
('PH_276', 'Hồ Mỹ Mai', '0996823122', 1, 306),
('PH_277', 'Đỗ Gia Bình', '0945650979', 1, 307),
('PH_278', 'Đặng Thanh Vy', '0989575485', 1, 308),
('PH_279', 'Lý Thu Thủy', '0967738353', 1, 309),
('PH_28', 'Vũ Đức Sơn', '0953908386', 1, 58),
('PH_280', 'Vũ Quốc Thắng', '0984363351', 1, 310),
('PH_281', 'Dương Xuân Lan', '0948538600', 1, 311),
('PH_282', 'Dương Thanh Giang', '0976178928', 1, 312),
('PH_283', 'Đỗ Thanh Khánh', '0981077691', 1, 313),
('PH_284', 'Phạm Mỹ Cường', '0922005994', 1, 314),
('PH_285', 'Hoàng Văn Tùng', '0902908084', 1, 315),
('PH_286', 'Huỳnh Quốc Dũng', '0960480060', 1, 316),
('PH_287', 'Lê Minh Thảo', '0943315111', 1, 317),
('PH_288', 'Đỗ Hữu Quân', '0936782367', 1, 318),
('PH_289', 'Dương Thị Bình', '0951592416', 1, 319),
('PH_29', 'Hồ Kim Minh', '0981565297', 1, 59),
('PH_290', 'Võ Quốc Bình', '0923543031', 1, 320),
('PH_291', 'Lý Mỹ Nga', '0983384479', 1, 321),
('PH_292', 'Lý Thu Minh', '0977251580', 1, 322),
('PH_293', 'Phạm Đức Cường', '0984842939', 1, 323),
('PH_294', 'Ngô Văn Sơn', '0933595966', 1, 324),
('PH_295', 'Dương Gia An', '0901095948', 1, 325),
('PH_296', 'Huỳnh Kim Sơn', '0925651937', 1, 326),
('PH_297', 'Huỳnh Xuân Lan', '0920924587', 1, 327),
('PH_298', 'Bùi Mỹ Hải', '0907071944', 1, 328),
('PH_299', 'Phạm Gia Linh', '0983258680', 1, 329),
('PH_3', 'Nguyễn Thanh Hùng', '0981791969', 1, 33),
('PH_30', 'Huỳnh Kim Tuấn', '0990863056', 1, 60),
('PH_300', 'Dương Hữu Trang', '0922762031', 1, 330),
('PH_31', 'Ngô Thu Tùng', '0974245758', 1, 61),
('PH_32', 'Phan Minh Tuấn', '0937224419', 1, 62),
('PH_33', 'Phạm Thị Thắng', '0928214536', 1, 63),
('PH_34', 'Võ Thanh Thảo', '0930544109', 1, 64),
('PH_35', 'Phạm Kim Việt', '0922345715', 1, 65),
('PH_36', 'Nguyễn Gia Phúc', '0999905189', 1, 66),
('PH_37', 'Huỳnh Thanh Nhi', '0972652477', 1, 67),
('PH_38', 'Ngô Minh Vy', '0990841808', 1, 68),
('PH_39', 'Lý Gia Nga', '0962550223', 1, 69),
('PH_4', 'Hoàng Mỹ Thảo', '0995830831', 1, 34),
('PH_40', 'Bùi Hữu Nam', '0919110061', 1, 70),
('PH_41', 'Phạm Văn Vy', '0920378753', 1, 71),
('PH_42', 'Phạm Văn Uyên', '0938828129', 1, 72),
('PH_43', 'Đỗ Kim Lan', '0941820044', 1, 73),
('PH_44', 'Đặng Thu Bình', '0946459251', 1, 74),
('PH_45', 'Hồ Văn Việt', '0977222480', 1, 75),
('PH_46', 'Bùi Kim Hùng', '0989585595', 1, 76),
('PH_47', 'Lê Kim Uyên', '0990577478', 1, 77),
('PH_48', 'Phạm Văn Việt', '0910097276', 1, 78),
('PH_49', 'Ngô Quốc Tùng', '0950142370', 1, 79),
('PH_5', 'Ngô Văn Thủy', '0938923309', 1, 35),
('PH_50', 'Đỗ Quốc An', '0999855820', 1, 80),
('PH_51', 'Lý Gia Uyên', '0943172756', 1, 81),
('PH_52', 'Vũ Thu Quỳnh', '0903755431', 1, 82),
('PH_53', 'Hồ Gia Tuấn', '0919588223', 1, 83),
('PH_54', 'Nguyễn Đức Quân', '0960303109', 1, 84),
('PH_55', 'Hồ Hữu Nam', '0968576438', 1, 85),
('PH_56', 'Phạm Thị Phúc', '0971660853', 1, 86),
('PH_57', 'Đỗ Đức Trang', '0965330079', 1, 87),
('PH_58', 'Bùi Thu Trung', '0977192770', 1, 88),
('PH_59', 'Lý Minh Hải', '0940031295', 1, 89),
('PH_6', 'Bùi Minh Lan', '0970762142', 1, 36),
('PH_60', 'Hoàng Thị Nhi', '0984776789', 1, 90),
('PH_61', 'Huỳnh Quốc Thảo', '0911210811', 1, 91),
('PH_62', 'Nguyễn Hữu Yến', '0920990797', 1, 92),
('PH_63', 'Trần Xuân Khánh', '0908797728', 1, 93),
('PH_64', 'Phan Thu Lan', '0964355219', 1, 94),
('PH_65', 'Phạm Văn Thảo', '0957123484', 1, 95),
('PH_66', 'Lý Văn Vy', '0956864505', 1, 96),
('PH_67', 'Nguyễn Văn Hải', '0983716785', 1, 97),
('PH_68', 'Huỳnh Thu Thắng', '0913405518', 1, 98),
('PH_69', 'Nguyễn Thanh Mai', '0973667653', 1, 99),
('PH_7', 'Hồ Thanh Nam', '0969476730', 1, 37),
('PH_70', 'Lý Thu Yến', '0987378320', 1, 100),
('PH_71', 'Nguyễn Thu Quân', '0953067802', 1, 101),
('PH_72', 'Phan Văn Mai', '0927165913', 1, 102),
('PH_73', 'Phan Thu Minh', '0989517110', 1, 103),
('PH_74', 'Huỳnh Gia Sơn', '0934216966', 1, 104),
('PH_75', 'Võ Thị Khánh', '0937431135', 1, 105),
('PH_76', 'Dương Quốc Quang', '0965764779', 1, 106),
('PH_77', 'Đỗ Thu Yến', '0924014844', 1, 107),
('PH_78', 'Vũ Kim Hải', '0901536030', 1, 108),
('PH_79', 'Bùi Mỹ Hải', '0930349420', 1, 109),
('PH_8', 'Phạm Mỹ Quang', '0985055575', 1, 38),
('PH_80', 'Nguyễn Minh Dũng', '0917122054', 1, 110),
('PH_81', 'Đỗ Thanh Mai', '0934861007', 1, 111),
('PH_82', 'Vũ Gia Khánh', '0900661701', 1, 112),
('PH_83', 'Hồ Hữu Huy', '0946882846', 1, 113),
('PH_84', 'Hồ Gia Trung', '0951288920', 1, 114),
('PH_85', 'Lý Minh Long', '0913581326', 1, 115),
('PH_86', 'Đặng Kim Sơn', '0939217619', 1, 116),
('PH_87', 'Phạm Đức Hải', '0925500574', 1, 117),
('PH_88', 'Phan Mỹ Vân', '0917550578', 1, 118),
('PH_89', 'Vũ Văn Bình', '0989120601', 1, 119),
('PH_9', 'Võ Gia Hùng', '0949586041', 1, 39),
('PH_90', 'Ngô Hữu Tuấn', '0920553882', 1, 120),
('PH_91', 'Phạm Kim An', '0937647483', 1, 121),
('PH_92', 'Hồ Mỹ Mai', '0926049608', 1, 122),
('PH_93', 'Bùi Kim Uyên', '0993468030', 1, 123),
('PH_94', 'Dương Kim Phúc', '0982366373', 1, 124),
('PH_95', 'Đỗ Văn Khánh', '0904766883', 1, 125),
('PH_96', 'Lê Thị Việt', '0976130283', 1, 126),
('PH_97', 'Dương Minh Quang', '0961132457', 1, 127),
('PH_98', 'Đỗ Văn An', '0984851787', 1, 128),
('PH_99', 'Phạm Thu Khánh', '0960595313', 1, 129),
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

--
-- Table structure for table `pickuppoints`
--

CREATE TABLE `pickuppoints` (
  `Id` int(11) NOT NULL,
  `RouteId` int(11) NOT NULL COMMENT 'Tuyến xe',
  `MaHocSinh` varchar(20) DEFAULT NULL COMMENT 'Học sinh được đón tại điểm này (NULL nếu là điểm trường)',
  `Latitude` decimal(10,8) NOT NULL COMMENT 'Vĩ độ điểm đón (copy từ hocsinh)',
  `Longitude` decimal(11,8) NOT NULL COMMENT 'Kinh độ điểm đón (copy từ hocsinh)',
  `DiaChi` text DEFAULT NULL COMMENT 'Địa chỉ điểm đón',
  `PointOrder` int(11) NOT NULL COMMENT 'Thứ tự điểm đón trên tuyến (1, 2, 3...)',
  `PointName` varchar(255) DEFAULT NULL COMMENT 'Tên điểm đón (thường là tên học sinh)',
  `TinhTrangDon` enum('Chưa đón','Đã đón','Vắng','Đã trả','Xuất phát','Điểm cuối') DEFAULT 'Chưa đón' COMMENT 'Trạng thái đón trả học sinh (Xuất phát/Điểm cuối cho điểm trường)',
  `ThoiGianDonDuKien` time DEFAULT NULL COMMENT 'Thời gian đón dự kiến',
  `ThoiGianDonThucTe` datetime DEFAULT NULL COMMENT 'Thời gian đón thực tế'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pickuppoints`
--

INSERT INTO `pickuppoints` (`Id`, `RouteId`, `MaHocSinh`, `Latitude`, `Longitude`, `DiaChi`, `PointOrder`, `PointName`, `TinhTrangDon`, `ThoiGianDonDuKien`, `ThoiGianDonThucTe`) VALUES
(166, 13, NULL, 10.76143060, 106.68216890, 'Trường ĐH Sài Gòn, Quận 5', 0, NULL, 'Xuất phát', NULL, NULL),
(167, 13, 'HS_188', 10.80389946, 106.70635505, '770 Lê Lợi, Quận 3, TP.HCM', 1, NULL, 'Chưa đón', NULL, '2025-11-26 20:26:01'),
(168, 13, 'HS_100', 10.80256797, 106.69654150, '713 Điện Biên Phủ, Quận 1, TP.HCM', 2, NULL, 'Chưa đón', NULL, '2025-11-26 20:26:13'),
(169, 13, 'HS_18', 10.80718333, 106.69324441, '340 Nam Kỳ Khởi Nghĩa, Quận 5, TP.HCM', 3, NULL, 'Chưa đón', NULL, '2025-11-26 20:26:27'),
(170, 13, 'HS_186', 10.79372615, 106.69328364, '951 Võ Thị Sáu, Quận 4, TP.HCM', 4, NULL, 'Chưa đón', NULL, '2025-11-26 20:26:49'),
(171, 13, 'HS_163', 10.79156543, 106.68164766, '698 Lê Lợi, Phú Nhuận, TP.HCM', 5, NULL, 'Chưa đón', NULL, '2025-11-26 20:27:21'),
(172, 13, 'HS_101', 10.78835787, 106.67842059, '291 Pasteur, Quận 10, TP.HCM', 6, NULL, 'Chưa đón', NULL, '2025-11-26 20:27:33'),
(173, 13, 'HS_36', 10.77739372, 106.67705090, '819 Đồng Khởi, Bình Thạnh, TP.HCM', 7, NULL, 'Chưa đón', NULL, '2025-11-26 20:27:57'),
(174, 13, 'HS_259', 10.76401881, 106.67676423, '31 Lê Duẩn, Quận 3, TP.HCM', 8, NULL, 'Chưa đón', NULL, '2025-11-26 20:28:11'),
(175, 13, 'HS_51', 10.75707225, 106.68294009, '904 Nguyễn Huệ, Quận 1, TP.HCM', 9, NULL, 'Chưa đón', NULL, '2025-11-26 20:28:23'),
(176, 13, 'HS_162', 10.74896122, 106.67142507, '838 Võ Thị Sáu, Phú Nhuận, TP.HCM', 10, NULL, 'Chưa đón', NULL, '2025-11-26 20:28:43'),
(177, 13, 'HS_288', 10.74625067, 106.66046404, '174 Lê Duẩn, Phú Nhuận, TP.HCM', 11, NULL, 'Chưa đón', NULL, '2025-11-26 20:29:09'),
(178, 13, 'HS_177', 10.74136798, 106.66203877, '213 Nguyễn Trãi, Quận 5, TP.HCM', 12, NULL, 'Chưa đón', NULL, NULL),
(179, 13, 'HS_102', 10.73200986, 106.66216702, '625 Cách Mạng Tháng 8, Quận 5, TP.HCM', 13, NULL, 'Chưa đón', NULL, '2025-11-26 20:29:47'),
(180, 13, 'HS_164', 10.72062152, 106.65376340, '502 Hai Bà Trưng, Quận 1, TP.HCM', 14, NULL, 'Chưa đón', NULL, NULL),
(181, 13, 'HS_228', 10.71834758, 106.65111484, '564 Nguyễn Trãi, Quận 10, TP.HCM', 15, NULL, 'Chưa đón', NULL, NULL),
(182, 13, 'HS_178', 10.72681088, 106.66123742, '646 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM', 16, NULL, 'Chưa đón', NULL, NULL),
(183, 13, 'HS_223', 10.72129663, 106.65695248, '359 Đồng Khởi, Quận 3, TP.HCM', 17, NULL, 'Chưa đón', NULL, '2025-11-26 20:30:40'),
(184, 13, 'HS_166', 10.73612177, 106.68908332, '320 Nguyễn Trãi, Quận 3, TP.HCM', 18, NULL, 'Chưa đón', NULL, '2025-11-26 20:31:08'),
(185, 13, 'HS_202', 10.75398772, 106.70238522, '680 Hai Bà Trưng, Quận 1, TP.HCM', 19, NULL, 'Chưa đón', NULL, '2025-11-26 20:31:28'),
(186, 13, 'HS_189', 10.77398983, 106.70396031, '372 Võ Thị Sáu, Quận 10, TP.HCM', 20, NULL, 'Chưa đón', NULL, '2025-11-26 20:31:54'),
(187, 13, 'HS_169', 10.78161098, 106.70284771, '983 Điện Biên Phủ, Quận 5, TP.HCM', 21, NULL, 'Chưa đón', NULL, NULL),
(188, 13, 'HS_183', 10.78921898, 106.70969035, '99 Võ Thị Sáu, Bình Thạnh, TP.HCM', 22, NULL, 'Chưa đón', NULL, '2025-11-26 20:32:20'),
(189, 13, NULL, 10.76143060, 106.68216890, 'Trường ĐH Sài Gòn, Quận 5 (Điểm về)', 23, NULL, 'Điểm cuối', NULL, NULL),
(190, 14, NULL, 10.76143060, 106.68216890, 'Trường ĐH Sài Gòn, Quận 5', 0, NULL, 'Xuất phát', NULL, NULL),
(191, 14, 'HS_50', 10.81188961, 106.66668034, '227 Nguyễn Trãi, Quận 4, TP.HCM', 1, NULL, 'Chưa đón', NULL, '2025-11-27 20:36:29'),
(192, 14, 'HS_49', 10.79232365, 106.65874584, '571 Nam Kỳ Khởi Nghĩa, Quận 4, TP.HCM', 2, NULL, 'Chưa đón', NULL, '2025-11-27 20:37:03'),
(193, 14, 'HS_46', 10.78470888, 106.65276333, '105 Nam Kỳ Khởi Nghĩa, Bình Thạnh, TP.HCM', 3, NULL, 'Chưa đón', NULL, '2025-11-27 20:37:21'),
(194, 14, 'HS_161', 10.77059660, 106.65718237, '879 Nguyễn Thị Minh Khai, Quận 4, TP.HCM', 4, NULL, 'Chưa đón', NULL, '2025-11-27 20:37:33'),
(195, 14, 'HS_190', 10.76895309, 106.63942439, '477 Cách Mạng Tháng 8, Bình Thạnh, TP.HCM', 5, NULL, 'Chưa đón', NULL, '2025-11-27 20:37:55'),
(196, 14, 'HS_45', 10.77381207, 106.63308015, '803 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 6, NULL, 'Chưa đón', NULL, '2025-11-27 20:38:14'),
(197, 14, 'HS_22', 10.78047688, 106.63446220, '264 Nguyễn Huệ, Phú Nhuận, TP.HCM', 7, NULL, 'Chưa đón', NULL, '2025-11-27 20:38:26'),
(198, 14, 'HS_185', 10.77466545, 106.61917993, '742 Nguyễn Huệ, Quận 1, TP.HCM', 8, NULL, 'Chưa đón', NULL, NULL),
(199, 14, 'HS_47', 10.77466646, 106.61074347, '421 Trần Hưng Đạo, Quận 3, TP.HCM', 9, NULL, 'Chưa đón', NULL, NULL),
(200, 14, 'HS_4', 10.78434996, 106.61332125, '860 Cách Mạng Tháng 8, Quận 1, TP.HCM', 10, NULL, 'Chưa đón', NULL, NULL),
(201, 14, 'HS_44', 10.79465622, 106.63451624, '206 Lê Duẩn, Quận 1, TP.HCM', 11, NULL, 'Chưa đón', NULL, NULL),
(202, 14, 'HS_231', 10.80562268, 106.63338171, '941 Cách Mạng Tháng 8, Quận 1, TP.HCM', 12, NULL, 'Chưa đón', NULL, NULL),
(203, 14, 'HS_168', 10.81169918, 106.65679595, '609 Đồng Khởi, Quận 1, TP.HCM', 13, NULL, 'Chưa đón', NULL, NULL),
(204, 14, 'HS_167', 10.78573979, 106.66025711, '479 Võ Thị Sáu, Bình Thạnh, TP.HCM', 14, NULL, 'Chưa đón', NULL, NULL),
(205, 14, NULL, 10.76143060, 106.68216890, 'Trường ĐH Sài Gòn, Quận 5 (Điểm về)', 15, NULL, 'Điểm cuối', NULL, NULL),
(206, 15, NULL, 10.76143060, 106.68216890, 'Trường ĐH Sài Gòn, Quận 5', 0, NULL, 'Xuất phát', NULL, NULL),
(207, 15, 'HS_184', 10.77249961, 106.69230923, '227 Nguyễn Trãi, Quận 3, TP.HCM', 1, NULL, 'Chưa đón', NULL, NULL),
(208, 15, 'HS_191', 10.77001147, 106.69007004, '705 Pasteur, Phú Nhuận, TP.HCM', 2, NULL, 'Chưa đón', NULL, NULL),
(209, 15, 'HS_10', 10.72631259, 106.68178227, '467 Hai Bà Trưng, Quận 4, TP.HCM', 3, NULL, 'Chưa đón', NULL, NULL),
(210, 15, 'HS_34', 10.72693574, 106.69593086, '640 Lê Lợi, Quận 5, TP.HCM', 4, NULL, 'Chưa đón', NULL, NULL),
(211, 15, 'HS_181', 10.72370241, 106.69479622, '807 Đồng Khởi, Phú Nhuận, TP.HCM', 5, NULL, 'Chưa đón', NULL, NULL),
(212, 15, 'HS_192', 10.71279264, 106.69571056, '963 Hai Bà Trưng, Quận 10, TP.HCM', 6, NULL, 'Chưa đón', NULL, NULL),
(213, 15, 'HS_292', 10.72931981, 106.64036624, '816 Lê Duẩn, Quận 5, TP.HCM', 7, NULL, 'Chưa đón', NULL, NULL),
(214, 15, 'HS_289', 10.73708710, 106.63718700, '679 Tôn Đức Thắng, Quận 10, TP.HCM', 8, NULL, 'Chưa đón', NULL, NULL),
(215, 15, 'HS_187', 10.72733783, 106.61755834, '108 Điện Biên Phủ, Phú Nhuận, TP.HCM', 9, NULL, 'Chưa đón', NULL, NULL),
(216, 15, 'HS_203', 10.71757742, 106.61457258, '275 Nguyễn Huệ, Quận 5, TP.HCM', 10, NULL, 'Chưa đón', NULL, NULL),
(217, 15, 'HS_180', 10.71732863, 106.61499695, '217 Nam Kỳ Khởi Nghĩa, Bình Thạnh, TP.HCM', 11, NULL, 'Chưa đón', NULL, NULL),
(218, 15, 'HS_165', 10.71299507, 106.61523516, '598 Nguyễn Huệ, Phú Nhuận, TP.HCM', 12, NULL, 'Chưa đón', NULL, NULL),
(219, 15, 'HS_179', 10.71702157, 106.62314769, '649 Hai Bà Trưng, Quận 4, TP.HCM', 13, NULL, 'Chưa đón', NULL, NULL),
(220, 15, 'HS_48', 10.72018652, 106.62550558, '473 Pasteur, Quận 10, TP.HCM', 14, NULL, 'Chưa đón', NULL, NULL),
(221, 15, 'HS_182', 10.72052414, 106.62346330, '144 Lý Tự Trọng, Bình Thạnh, TP.HCM', 15, NULL, 'Chưa đón', NULL, NULL),
(222, 15, 'HS_1', 10.74442427, 106.62295436, '484 Pasteur, Phú Nhuận, TP.HCM', 16, NULL, 'Chưa đón', NULL, NULL),
(223, 15, 'HS_5', 10.76618573, 106.62210104, '448 Trần Hưng Đạo, Bình Thạnh, TP.HCM', 17, NULL, 'Chưa đón', NULL, NULL),
(224, 15, 'HS_19', 10.76119935, 106.61054879, '610 Nguyễn Trãi, Quận 4, TP.HCM', 18, NULL, 'Chưa đón', NULL, NULL),
(225, 15, 'HS_216', 10.75597315, 106.63551171, '101 Nam Kỳ Khởi Nghĩa, Quận 10, TP.HCM', 19, NULL, 'Chưa đón', NULL, NULL),
(226, 15, NULL, 10.76143060, 106.68216890, 'Trường ĐH Sài Gòn, Quận 5 (Điểm về)', 20, NULL, 'Điểm cuối', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quanly`
--

CREATE TABLE `quanly` (
  `MaQuanLy` varchar(20) NOT NULL,
  `HoTen` varchar(100) NOT NULL,
  `SoDienThoai` varchar(15) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quanly`
--

INSERT INTO `quanly` (`MaQuanLy`, `HoTen`, `SoDienThoai`, `UserId`) VALUES
('QL001', 'Bùi Bích Phương', '0912345678', 1),
('QL002', 'Trần Minh Tuấn', '0913456789', 2);

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `Id` int(11) NOT NULL,
  `MaTuyen` varchar(20) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `DriverId` varchar(20) DEFAULT NULL,
  `VehicleId` int(11) DEFAULT NULL,
  `Status` enum('Chưa chạy','Đang chạy','Đã hoàn thành','Đã hủy') NOT NULL DEFAULT 'Chưa chạy',
  `TotalDistance` decimal(10,2) DEFAULT NULL COMMENT 'Tổng quãng đường (km)',
  `EstimatedTime` int(11) DEFAULT NULL COMMENT 'Thời gian ước tính (phút)',
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `currentLatitude` decimal(10,8) DEFAULT NULL COMMENT 'Vĩ độ hiện tại của xe (real-time tracking)',
  `currentLongitude` decimal(11,8) DEFAULT NULL COMMENT 'Kinh độ hiện tại của xe (real-time tracking)',
  `lastUpdated` timestamp NULL DEFAULT NULL COMMENT 'Thời gian cập nhật vị trí cuối cùng'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `routes`
--

INSERT INTO `routes` (`Id`, `MaTuyen`, `Name`, `DriverId`, `VehicleId`, `Status`, `TotalDistance`, `EstimatedTime`, `CreatedAt`, `UpdatedAt`, `currentLatitude`, `currentLongitude`, `lastUpdated`) VALUES
(13, 'AUTO001', 'Tuyến tự động 1', 'TX001', 13, 'Đã hoàn thành', 71.25, 102, '2025-11-26 10:42:45', '2025-11-29 00:52:23', NULL, NULL, '2025-11-29 00:52:21'),
(14, 'AUTO002', 'Tuyến tự động 2', 'TX001', 18, 'Đã hoàn thành', 63.59, 88, '2025-11-26 10:42:45', '2025-11-27 14:01:46', NULL, NULL, '2025-11-27 14:01:44'),
(15, 'AUTO003', 'Tuyến tự động 3', 'TX001', 20, 'Đã hoàn thành', 88.32, 117, '2025-11-26 10:42:45', '2025-11-30 05:12:36', NULL, NULL, '2025-11-30 05:12:34');

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `shift` enum('Sáng','Chiều') NOT NULL DEFAULT 'Sáng',
  `end_time` time DEFAULT NULL,
  `status` enum('Chưa phân công','Sắp diễn ra','Đang chạy','Hoàn thành','Đã hủy','Đã phân công') DEFAULT 'Chưa phân công' COMMENT 'Trạng thái lịch trình',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id`, `route_id`, `date`, `start_time`, `shift`, `end_time`, `status`, `created_at`) VALUES
(51, 15, '2025-11-30', '07:00:00', 'Sáng', '11:13:30', 'Hoàn thành', '2025-11-30 04:01:05'),
(52, 15, '2025-11-30', '16:00:00', 'Chiều', '12:12:36', 'Hoàn thành', '2025-11-30 04:01:05');

-- --------------------------------------------------------

--
-- Table structure for table `schedule_pickup_status`
--

CREATE TABLE `schedule_pickup_status` (
  `Id` int(11) NOT NULL,
  `ScheduleId` int(11) NOT NULL COMMENT 'ID của schedule',
  `PickupPointId` int(11) NOT NULL COMMENT 'ID của điểm đón',
  `TinhTrangDon` enum('Chưa đón','Đã đón','Vắng','Đã trả','Xuất phát','Điểm cuối') DEFAULT 'Chưa đón' COMMENT 'Trạng thái đón trả học sinh',
  `ThoiGianDonThucTe` datetime DEFAULT NULL COMMENT 'Thời gian đón thực tế',
  `GhiChu` text DEFAULT NULL COMMENT 'Ghi chú (lý do vắng, v.v.)',
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lưu trạng thái đón học sinh riêng cho từng schedule';

--
-- Dumping data for table `schedule_pickup_status`
--

INSERT INTO `schedule_pickup_status` (`Id`, `ScheduleId`, `PickupPointId`, `TinhTrangDon`, `ThoiGianDonThucTe`, `GhiChu`, `CreatedAt`, `UpdatedAt`) VALUES
(672, 51, 206, 'Xuất phát', NULL, NULL, '2025-11-30 04:01:05', '2025-11-30 04:01:05'),
(673, 51, 207, 'Đã đón', '2025-11-30 04:07:16', NULL, '2025-11-30 04:01:05', '2025-11-30 04:07:16'),
(674, 52, 206, 'Xuất phát', NULL, NULL, '2025-11-30 04:01:05', '2025-11-30 04:01:05'),
(675, 51, 208, 'Đã đón', '2025-11-30 04:07:24', NULL, '2025-11-30 04:01:05', '2025-11-30 04:07:24'),
(676, 52, 207, 'Đã đón', '2025-11-30 05:06:22', NULL, '2025-11-30 04:01:05', '2025-11-30 05:06:22'),
(677, 51, 209, 'Đã đón', '2025-11-30 04:07:55', NULL, '2025-11-30 04:01:05', '2025-11-30 04:07:55'),
(678, 52, 208, 'Đã đón', '2025-11-30 05:06:30', NULL, '2025-11-30 04:01:05', '2025-11-30 05:06:30'),
(679, 51, 210, 'Đã đón', '2025-11-30 04:08:25', NULL, '2025-11-30 04:01:05', '2025-11-30 04:08:25'),
(680, 52, 209, 'Đã đón', '2025-11-30 05:07:00', NULL, '2025-11-30 04:01:05', '2025-11-30 05:07:00'),
(681, 51, 211, 'Đã đón', '2025-11-30 04:09:05', NULL, '2025-11-30 04:01:05', '2025-11-30 04:09:05'),
(682, 52, 210, 'Đã đón', '2025-11-30 05:07:30', NULL, '2025-11-30 04:01:05', '2025-11-30 05:07:30'),
(683, 51, 212, 'Đã đón', '2025-11-30 04:09:19', NULL, '2025-11-30 04:01:05', '2025-11-30 04:09:19'),
(684, 52, 211, 'Đã đón', '2025-11-30 05:08:10', NULL, '2025-11-30 04:01:05', '2025-11-30 05:08:10'),
(685, 51, 213, 'Chưa đón', NULL, NULL, '2025-11-30 04:01:05', '2025-11-30 04:01:05'),
(686, 52, 212, 'Đã đón', '2025-11-30 05:08:25', NULL, '2025-11-30 04:01:05', '2025-11-30 05:08:25'),
(687, 51, 214, 'Đã đón', '2025-11-30 04:10:23', NULL, '2025-11-30 04:01:05', '2025-11-30 04:10:23'),
(688, 52, 213, 'Chưa đón', NULL, NULL, '2025-11-30 04:01:05', '2025-11-30 04:01:05'),
(689, 51, 215, 'Đã đón', '2025-11-30 04:10:37', NULL, '2025-11-30 04:01:05', '2025-11-30 04:10:37'),
(690, 52, 214, 'Đã đón', '2025-11-30 05:09:29', NULL, '2025-11-30 04:01:05', '2025-11-30 05:09:29'),
(691, 51, 216, 'Đã đón', '2025-11-30 04:10:51', NULL, '2025-11-30 04:01:05', '2025-11-30 04:10:51'),
(692, 52, 215, 'Đã đón', '2025-11-30 05:09:43', NULL, '2025-11-30 04:01:05', '2025-11-30 05:09:43'),
(693, 51, 217, 'Đã đón', '2025-11-30 04:10:53', NULL, '2025-11-30 04:01:05', '2025-11-30 04:10:53'),
(694, 52, 216, 'Đã đón', '2025-11-30 05:09:57', NULL, '2025-11-30 04:01:05', '2025-11-30 05:09:57'),
(695, 51, 218, 'Đã đón', '2025-11-30 04:11:13', NULL, '2025-11-30 04:01:05', '2025-11-30 04:11:13'),
(696, 52, 217, 'Đã đón', '2025-11-30 05:09:59', NULL, '2025-11-30 04:01:05', '2025-11-30 05:09:59'),
(697, 51, 219, 'Đã đón', '2025-11-30 04:11:31', NULL, '2025-11-30 04:01:05', '2025-11-30 04:11:31'),
(698, 52, 218, 'Đã đón', '2025-11-30 05:10:19', NULL, '2025-11-30 04:01:05', '2025-11-30 05:10:19'),
(699, 51, 220, 'Đã đón', '2025-11-30 04:11:43', NULL, '2025-11-30 04:01:05', '2025-11-30 04:11:43'),
(700, 52, 219, 'Đã đón', '2025-11-30 05:10:37', NULL, '2025-11-30 04:01:05', '2025-11-30 05:10:37'),
(701, 51, 221, 'Đã đón', '2025-11-30 04:11:51', NULL, '2025-11-30 04:01:05', '2025-11-30 04:11:51'),
(702, 52, 220, 'Đã đón', '2025-11-30 05:10:49', NULL, '2025-11-30 04:01:05', '2025-11-30 05:10:49'),
(703, 51, 222, 'Đã đón', '2025-11-30 04:12:11', NULL, '2025-11-30 04:01:05', '2025-11-30 04:12:11'),
(704, 52, 221, 'Đã đón', '2025-11-30 05:10:57', NULL, '2025-11-30 04:01:05', '2025-11-30 05:10:57'),
(705, 51, 223, 'Đã đón', '2025-11-30 04:12:21', NULL, '2025-11-30 04:01:05', '2025-11-30 04:12:21'),
(706, 52, 222, 'Vắng', NULL, 'a', '2025-11-30 04:01:05', '2025-11-30 04:48:44'),
(707, 51, 224, 'Đã đón', '2025-11-30 04:12:41', NULL, '2025-11-30 04:01:05', '2025-11-30 04:12:41'),
(708, 52, 223, 'Đã đón', '2025-11-30 05:11:27', NULL, '2025-11-30 04:01:05', '2025-11-30 05:11:27'),
(709, 51, 225, 'Đã đón', '2025-11-30 04:13:02', NULL, '2025-11-30 04:01:05', '2025-11-30 04:13:02'),
(710, 52, 224, 'Đã đón', '2025-11-30 05:11:48', NULL, '2025-11-30 04:01:05', '2025-11-30 05:11:48'),
(711, 51, 226, 'Điểm cuối', NULL, NULL, '2025-11-30 04:01:05', '2025-11-30 04:01:05'),
(712, 52, 225, 'Đã đón', '2025-11-30 05:12:08', NULL, '2025-11-30 04:01:05', '2025-11-30 05:12:08'),
(713, 52, 226, 'Điểm cuối', NULL, NULL, '2025-11-30 04:01:05', '2025-11-30 04:01:05');

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
('ABSENCE_176447701859', '📋 Đơn xin nghỉ học - Hồ Minh Hùng\n\nPhụ huynh Võ Xuân Tùng xin cho học sinh Hồ Minh Hùng nghỉ học.\n\n📅 Ngày: 30/11/2025\n🕐 Ca: Chiều - 16:00:00\n🚌 Tuyến: Tuyến tự động 3\n📍 Điểm đón: 484 Pasteur, Phú Nhuận, TP.HCM\n📝 Lý do: ốm', '2025-11-30 11:30:18', 'Vắng mặt'),
('ABSENCE_176447739205', '📋 Đơn xin nghỉ học - Hồ Minh Hùng\n\nPhụ huynh Võ Xuân Tùng xin cho học sinh Hồ Minh Hùng nghỉ học.\n\n📅 Ngày: 30/11/2025\n🕐 Ca: Chiều - 16:00:00\n🚌 Tuyến: Tuyến tự động 3\n📍 Điểm đón: 484 Pasteur, Phú Nhuận, TP.HCM\n📝 Lý do: a', '2025-11-30 11:36:32', 'Vắng mặt'),
('ABSENCE_176447755678', '📋 Đơn xin nghỉ học - Hồ Minh Hùng\n\nPhụ huynh Võ Xuân Tùng xin cho học sinh Hồ Minh Hùng nghỉ học.\n\n📅 Ngày: 30/11/2025\n🕐 Ca: Chiều - 16:00:00\n🚌 Tuyến: Tuyến tự động 3\n📍 Điểm đón: 484 Pasteur, Phú Nhuận, TP.HCM\n📝 Lý do: a', '2025-11-30 11:39:16', 'Vắng mặt'),
('ABSENCE_176447784019', '📋 Đơn xin nghỉ học - Hồ Minh Hùng\n\nPhụ huynh Võ Xuân Tùng xin cho học sinh Hồ Minh Hùng nghỉ học.\n\n📅 Ngày: 30/11/2025\n🕐 Ca: Chiều - 16:00:00\n🚌 Tuyến: Tuyến tự động 3\n📍 Điểm đón: 484 Pasteur, Phú Nhuận, TP.HCM\n📝 Lý do: ư', '2025-11-30 11:44:00', 'Vắng mặt'),
('ABSENCE_176447812442', '📋 Đơn xin nghỉ học - Hồ Minh Hùng\n\nPhụ huynh Võ Xuân Tùng xin cho học sinh Hồ Minh Hùng nghỉ học.\n\n📅 Ngày: 30/11/2025\n🕐 Ca: Chiều - 16:00:00\n🚌 Tuyến: Tuyến tự động 3\n📍 Điểm đón: 484 Pasteur, Phú Nhuận, TP.HCM\n📝 Lý do: a', '2025-11-30 11:48:44', 'Vắng mặt');

-- --------------------------------------------------------

--
-- Table structure for table `thongbao_phuhuynh`
--

CREATE TABLE `thongbao_phuhuynh` (
  `Id` int(11) NOT NULL,
  `MaThongBao` varchar(20) NOT NULL,
  `MaPhuHuynh` varchar(20) NOT NULL,
  `NoiDung` text NOT NULL,
  `ThoiGian` datetime NOT NULL DEFAULT current_timestamp(),
  `LoaiThongBao` varchar(50) DEFAULT 'Thông báo',
  `DaDoc` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `thongbao_phuhuynh`
--

INSERT INTO `thongbao_phuhuynh` (`Id`, `MaThongBao`, `MaPhuHuynh`, `NoiDung`, `ThoiGian`, `LoaiThongBao`, `DaDoc`) VALUES
(1146, 'TB1764475611803', 'PH_184', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1147, 'TB1764475611814', 'PH_191', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1148, 'TB1764475611818', 'PH_10', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1149, 'TB1764475611822', 'PH_34', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1150, 'TB1764475611826', 'PH_181', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1151, 'TB1764475611831', 'PH_192', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1152, 'TB1764475611835', 'PH_292', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1153, 'TB1764475611924', 'PH_289', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1154, 'TB1764475611929', 'PH_187', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1155, 'TB1764475611935', 'PH_203', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1156, 'TB1764475611937', 'PH_180', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1157, 'TB1764475611940', 'PH_165', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1158, 'TB1764475611942', 'PH_179', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1159, 'TB1764475611948', 'PH_48', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1160, 'TB1764475611952', 'PH_182', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1161, 'TB1764475611954', 'PH_1', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 1),
(1162, 'TB1764475611958', 'PH_5', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1163, 'TB1764475611962', 'PH_19', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1164, 'TB1764475611968', 'PH_216', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 11:06:51', 'trip_start', 0),
(1165, 'TB1764475626903', 'PH_191', '🚌 Xe sắp tới điểm đón Phan Văn Sơn!\nXe còn cách khoảng 424m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:07:06', 'approaching', 0),
(1166, 'TB1764475630907', 'PH_184', '🚌 Xe sắp tới điểm đón Phan Thị Long!\nXe còn cách khoảng 167m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:07:10', 'approaching', 0),
(1167, 'TB1764475636940', 'PH_184', '✅ Phan Thị Long đã lên xe an toàn\nCon đã được tài xế đón tại 227 Nguyễn Trãi, Quận 3, TP.HCM lúc 11:07', '2025-11-30 11:07:16', 'picked_up', 0),
(1168, 'TB1764475644917', 'PH_191', '✅ Phan Văn Sơn đã lên xe an toàn\nCon đã được tài xế đón tại 705 Pasteur, Phú Nhuận, TP.HCM lúc 11:07', '2025-11-30 11:07:24', 'picked_up', 0),
(1169, 'TB1764475658533', 'PH_184', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1170, 'TB1764475658538', 'PH_191', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1171, 'TB1764475658541', 'PH_10', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1172, 'TB1764475658543', 'PH_34', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1173, 'TB1764475658544', 'PH_181', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1174, 'TB1764475658547', 'PH_192', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1175, 'TB1764475658549', 'PH_292', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1176, 'TB1764475658553', 'PH_289', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1177, 'TB1764475658556', 'PH_187', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1178, 'TB1764475658559', 'PH_203', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1179, 'TB1764475658562', 'PH_180', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1180, 'TB1764475658565', 'PH_165', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1181, 'TB1764475658567', 'PH_179', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1182, 'TB1764475658572', 'PH_48', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1183, 'TB1764475658574', 'PH_182', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1184, 'TB1764475658577', 'PH_1', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 1),
(1185, 'TB1764475658579', 'PH_5', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1186, 'TB1764475658581', 'PH_19', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1187, 'TB1764475658584', 'PH_216', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 247 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:07:38', 'delayed', 0),
(1188, 'TB1764475671038', 'PH_10', '🚌 Xe sắp tới điểm đón Huỳnh Thanh Nhi!\nXe còn cách khoảng 445m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:07:51', 'approaching', 0),
(1189, 'TB1764475675044', 'PH_10', '✅ Huỳnh Thanh Nhi đã lên xe an toàn\nCon đã được tài xế đón tại 467 Hai Bà Trưng, Quận 4, TP.HCM lúc 11:07', '2025-11-30 11:07:55', 'picked_up', 0),
(1190, 'TB1764475689030', 'PH_34', '🚌 Xe sắp tới điểm đón Huỳnh Xuân Cường!\nXe còn cách khoảng 302m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:08:09', 'approaching', 0),
(1191, 'TB1764475691040', 'PH_181', '🚌 Xe sắp tới điểm đón Nguyễn Mỹ An!\nXe còn cách khoảng 490m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:08:11', 'approaching', 0),
(1192, 'TB1764475701071', 'PH_34', '📍 Xe đã đến điểm đón Huỳnh Xuân Cường!\nXe bus hiện đang ở rất gần (78m), con có thể lên xe ngay!', '2025-11-30 11:08:21', 'arrived', 0),
(1193, 'TB1764475705117', 'PH_34', '✅ Huỳnh Xuân Cường đã lên xe an toàn\nCon đã được tài xế đón tại 640 Lê Lợi, Quận 5, TP.HCM lúc 11:08', '2025-11-30 11:08:25', 'picked_up', 0),
(1194, 'TB1764475739209', 'PH_181', '📍 Xe đã đến điểm đón Nguyễn Mỹ An!\nXe bus hiện đang ở rất gần (99m), con có thể lên xe ngay!', '2025-11-30 11:08:59', 'arrived', 0),
(1195, 'TB1764475745263', 'PH_181', '✅ Nguyễn Mỹ An đã lên xe an toàn\nCon đã được tài xế đón tại 807 Đồng Khởi, Phú Nhuận, TP.HCM lúc 11:09', '2025-11-30 11:09:05', 'picked_up', 0),
(1196, 'TB1764475757270', 'PH_192', '🚌 Xe sắp tới điểm đón Bùi Đức An!\nXe còn cách khoảng 106m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:09:17', 'approaching', 0),
(1197, 'TB1764475759324', 'PH_192', '✅ Bùi Đức An đã lên xe an toàn\nCon đã được tài xế đón tại 963 Hai Bà Trưng, Quận 10, TP.HCM lúc 11:09', '2025-11-30 11:09:19', 'picked_up', 0),
(1198, 'TB1764475789411', 'PH_292', '🚌 Xe sắp tới điểm đón Đỗ Văn Quang!\nXe còn cách khoảng 274m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:09:49', 'approaching', 0),
(1199, 'TB1764475791379', 'PH_292', '📍 Xe đã đến điểm đón Đỗ Văn Quang!\nXe bus hiện đang ở rất gần (63m), con có thể lên xe ngay!', '2025-11-30 11:09:51', 'arrived', 0),
(1200, 'TB1764475819479', 'PH_289', '🚌 Xe sắp tới điểm đón Nguyễn Quốc Trang!\nXe còn cách khoảng 138m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:10:19', 'approaching', 0),
(1201, 'TB1764475823482', 'PH_289', '✅ Nguyễn Quốc Trang đã lên xe an toàn\nCon đã được tài xế đón tại 679 Tôn Đức Thắng, Quận 10, TP.HCM lúc 11:10', '2025-11-30 11:10:23', 'picked_up', 0),
(1202, 'TB1764475833516', 'PH_187', '🚌 Xe sắp tới điểm đón Trần Thu An!\nXe còn cách khoảng 217m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:10:33', 'approaching', 0),
(1203, 'TB1764475835567', 'PH_187', '📍 Xe đã đến điểm đón Trần Thu An!\nXe bus hiện đang ở rất gần (82m), con có thể lên xe ngay!', '2025-11-30 11:10:35', 'arrived', 0),
(1204, 'TB1764475837579', 'PH_187', '✅ Trần Thu An đã lên xe an toàn\nCon đã được tài xế đón tại 108 Điện Biên Phủ, Phú Nhuận, TP.HCM lúc 11:10', '2025-11-30 11:10:37', 'picked_up', 0),
(1205, 'TB1764475849595', 'PH_203', '📍 Xe đã đến điểm đón Hồ Xuân Quỳnh!\nXe bus hiện đang ở rất gần (81m), con có thể lên xe ngay!', '2025-11-30 11:10:49', 'arrived', 0),
(1206, 'TB1764475849605', 'PH_180', '🚌 Xe sắp tới điểm đón Lê Quốc Quân!\nXe còn cách khoảng 133m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:10:49', 'approaching', 0),
(1207, 'TB1764475851630', 'PH_203', '✅ Hồ Xuân Quỳnh đã lên xe an toàn\nCon đã được tài xế đón tại 275 Nguyễn Huệ, Quận 5, TP.HCM lúc 11:10', '2025-11-30 11:10:51', 'picked_up', 0),
(1208, 'TB1764475851633', 'PH_180', '📍 Xe đã đến điểm đón Lê Quốc Quân!\nXe bus hiện đang ở rất gần (62m), con có thể lên xe ngay!', '2025-11-30 11:10:51', 'arrived', 0),
(1209, 'TB1764475853642', 'PH_180', '✅ Lê Quốc Quân đã lên xe an toàn\nCon đã được tài xế đón tại 217 Nam Kỳ Khởi Nghĩa, Bình Thạnh, TP.HCM lúc 11:10', '2025-11-30 11:10:53', 'picked_up', 0),
(1210, 'TB1764475853645', 'PH_165', '🚌 Xe sắp tới điểm đón Nguyễn Thanh Nhi!\nXe còn cách khoảng 492m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:10:53', 'approaching', 0),
(1211, 'TB1764475871693', 'PH_165', '📍 Xe đã đến điểm đón Nguyễn Thanh Nhi!\nXe bus hiện đang ở rất gần (65m), con có thể lên xe ngay!', '2025-11-30 11:11:11', 'arrived', 0),
(1212, 'TB1764475873700', 'PH_165', '✅ Nguyễn Thanh Nhi đã lên xe an toàn\nCon đã được tài xế đón tại 598 Nguyễn Huệ, Phú Nhuận, TP.HCM lúc 11:11', '2025-11-30 11:11:13', 'picked_up', 0),
(1213, 'TB1764475887764', 'PH_179', '🚌 Xe sắp tới điểm đón Trần Kim Lan!\nXe còn cách khoảng 472m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:11:27', 'approaching', 0),
(1214, 'TB1764475887771', 'PH_182', '🚌 Xe sắp tới điểm đón Lê Minh Vân!\nXe còn cách khoảng 481m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:11:27', 'approaching', 0),
(1215, 'TB1764475889745', 'PH_179', '📍 Xe đã đến điểm đón Trần Kim Lan!\nXe bus hiện đang ở rất gần (91m), con có thể lên xe ngay!', '2025-11-30 11:11:29', 'arrived', 0),
(1216, 'TB1764475889751', 'PH_48', '🚌 Xe sắp tới điểm đón Phan Quốc An!\nXe còn cách khoảng 346m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:11:29', 'approaching', 0),
(1217, 'TB1764475891780', 'PH_179', '✅ Trần Kim Lan đã lên xe an toàn\nCon đã được tài xế đón tại 649 Hai Bà Trưng, Quận 4, TP.HCM lúc 11:11', '2025-11-30 11:11:31', 'picked_up', 0),
(1218, 'TB1764475903810', 'PH_48', '✅ Phan Quốc An đã lên xe an toàn\nCon đã được tài xế đón tại 473 Pasteur, Quận 10, TP.HCM lúc 11:11', '2025-11-30 11:11:43', 'picked_up', 0),
(1219, 'TB1764475911850', 'PH_182', '✅ Lê Minh Vân đã lên xe an toàn\nCon đã được tài xế đón tại 144 Lý Tự Trọng, Bình Thạnh, TP.HCM lúc 11:11', '2025-11-30 11:11:51', 'picked_up', 0),
(1220, 'TB1764475931868', 'PH_1', '✅ Hồ Minh Hùng đã lên xe an toàn\nCon đã được tài xế đón tại 484 Pasteur, Phú Nhuận, TP.HCM lúc 11:12', '2025-11-30 11:12:11', 'picked_up', 1),
(1221, 'TB1764475939880', 'PH_5', '🚌 Xe sắp tới điểm đón Phan Xuân Lan!\nXe còn cách khoảng 126m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:12:19', 'approaching', 0),
(1222, 'TB1764475941903', 'PH_5', '✅ Phan Xuân Lan đã lên xe an toàn\nCon đã được tài xế đón tại 448 Trần Hưng Đạo, Bình Thạnh, TP.HCM lúc 11:12', '2025-11-30 11:12:21', 'picked_up', 0),
(1223, 'TB1764475958554', 'PH_184', '✅ Phan Thị Long đã lên xe an toàn\nCon đã được tài xế đón tại 227 Nguyễn Trãi, Quận 3, TP.HCM lúc 11:12', '2025-11-30 11:12:38', 'picked_up', 0),
(1224, 'TB1764475958561', 'PH_191', '✅ Phan Văn Sơn đã lên xe an toàn\nCon đã được tài xế đón tại 705 Pasteur, Phú Nhuận, TP.HCM lúc 11:12', '2025-11-30 11:12:38', 'picked_up', 0),
(1225, 'TB1764475958584', 'PH_184', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1226, 'TB1764475958588', 'PH_191', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1227, 'TB1764475958591', 'PH_10', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1228, 'TB1764475958594', 'PH_34', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1229, 'TB1764475958598', 'PH_181', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1230, 'TB1764475958602', 'PH_192', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1231, 'TB1764475958605', 'PH_292', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1232, 'TB1764475958608', 'PH_289', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1233, 'TB1764475958612', 'PH_187', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1234, 'TB1764475958615', 'PH_203', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1235, 'TB1764475958620', 'PH_180', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1236, 'TB1764475958624', 'PH_165', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1237, 'TB1764475958627', 'PH_179', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1238, 'TB1764475958630', 'PH_48', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1239, 'TB1764475958635', 'PH_182', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1240, 'TB1764475958639', 'PH_1', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 1),
(1241, 'TB1764475958642', 'PH_5', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1242, 'TB1764475958645', 'PH_19', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1243, 'TB1764475958649', 'PH_216', '⏰ Xe Tuyến tự động 3 bị trễ\nXe đang trễ khoảng 252 phút so với dự kiến. Xin lỗi vì sự bất tiện này.', '2025-11-30 11:12:38', 'delayed', 0),
(1244, 'TB1764475961963', 'PH_19', '✅ Bùi Quốc Vy đã lên xe an toàn\nCon đã được tài xế đón tại 610 Nguyễn Trãi, Quận 4, TP.HCM lúc 11:12', '2025-11-30 11:12:41', 'picked_up', 0),
(1245, 'TB1764475974030', 'PH_216', '🚌 Xe sắp tới điểm đón Bùi Hữu Tùng!\nXe còn cách khoảng 310m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 11:12:54', 'approaching', 0),
(1246, 'TB1764475980112', 'PH_216', '📍 Xe đã đến điểm đón Bùi Hữu Tùng!\nXe bus hiện đang ở rất gần (60m), con có thể lên xe ngay!', '2025-11-30 11:13:00', 'arrived', 0),
(1247, 'TB1764475982118', 'PH_216', '✅ Bùi Hữu Tùng đã lên xe an toàn\nCon đã được tài xế đón tại 101 Nam Kỳ Khởi Nghĩa, Quận 10, TP.HCM lúc 11:13', '2025-11-30 11:13:02', 'picked_up', 0),
(1248, 'TB1764479157715', 'PH_184', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1249, 'TB1764479157728', 'PH_191', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1250, 'TB1764479157731', 'PH_10', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1251, 'TB1764479157733', 'PH_34', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1252, 'TB1764479157741', 'PH_181', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1253, 'TB1764479157744', 'PH_192', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1254, 'TB1764479157747', 'PH_292', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1255, 'TB1764479157750', 'PH_289', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1256, 'TB1764479157866', 'PH_187', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1257, 'TB1764479157871', 'PH_203', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1258, 'TB1764479157878', 'PH_180', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1259, 'TB1764479157881', 'PH_165', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1260, 'TB1764479157888', 'PH_179', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1261, 'TB1764479157893', 'PH_48', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1262, 'TB1764479157896', 'PH_182', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1263, 'TB1764479157898', 'PH_1', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 1),
(1264, 'TB1764479157903', 'PH_5', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1265, 'TB1764479157908', 'PH_19', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1266, 'TB1764479157912', 'PH_216', '🚌 Xe tuyến Tuyến tự động 3 đã xuất phát\nTài xế vừa bắt đầu chuyến đi. Theo dõi vị trí xe trên bản đồ để biết xe đang ở đâu nhé!', '2025-11-30 12:05:57', 'trip_start', 0),
(1267, 'TB1764479172331', 'PH_191', '🚌 Xe sắp tới điểm đón Phan Văn Sơn!\nXe còn cách khoảng 424m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:06:12', 'approaching', 0),
(1268, 'TB1764479176372', 'PH_184', '🚌 Xe sắp tới điểm đón Phan Thị Long!\nXe còn cách khoảng 167m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:06:16', 'approaching', 0),
(1269, 'TB1764479182422', 'PH_184', '✅ Phan Thị Long đã lên xe an toàn\nCon đã được tài xế đón tại 227 Nguyễn Trãi, Quận 3, TP.HCM lúc 12:06', '2025-11-30 12:06:22', 'picked_up', 0),
(1270, 'TB1764479190450', 'PH_191', '✅ Phan Văn Sơn đã lên xe an toàn\nCon đã được tài xế đón tại 705 Pasteur, Phú Nhuận, TP.HCM lúc 12:06', '2025-11-30 12:06:30', 'picked_up', 0),
(1271, 'TB1764479216520', 'PH_10', '🚌 Xe sắp tới điểm đón Huỳnh Thanh Nhi!\nXe còn cách khoảng 445m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:06:56', 'approaching', 0),
(1272, 'TB1764479220581', 'PH_10', '✅ Huỳnh Thanh Nhi đã lên xe an toàn\nCon đã được tài xế đón tại 467 Hai Bà Trưng, Quận 4, TP.HCM lúc 12:07', '2025-11-30 12:07:00', 'picked_up', 0),
(1273, 'TB1764479234668', 'PH_34', '🚌 Xe sắp tới điểm đón Huỳnh Xuân Cường!\nXe còn cách khoảng 302m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:07:14', 'approaching', 0),
(1274, 'TB1764479236686', 'PH_181', '🚌 Xe sắp tới điểm đón Nguyễn Mỹ An!\nXe còn cách khoảng 490m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:07:16', 'approaching', 0),
(1275, 'TB1764479246708', 'PH_34', '📍 Xe đã đến điểm đón Huỳnh Xuân Cường!\nXe bus hiện đang ở rất gần (78m), con có thể lên xe ngay!', '2025-11-30 12:07:26', 'arrived', 0),
(1276, 'TB1764479250677', 'PH_34', '✅ Huỳnh Xuân Cường đã lên xe an toàn\nCon đã được tài xế đón tại 640 Lê Lợi, Quận 5, TP.HCM lúc 12:07', '2025-11-30 12:07:30', 'picked_up', 0),
(1277, 'TB1764479284887', 'PH_181', '📍 Xe đã đến điểm đón Nguyễn Mỹ An!\nXe bus hiện đang ở rất gần (99m), con có thể lên xe ngay!', '2025-11-30 12:08:04', 'arrived', 0),
(1278, 'TB1764479290936', 'PH_181', '✅ Nguyễn Mỹ An đã lên xe an toàn\nCon đã được tài xế đón tại 807 Đồng Khởi, Phú Nhuận, TP.HCM lúc 12:08', '2025-11-30 12:08:10', 'picked_up', 0),
(1279, 'TB1764479302991', 'PH_192', '🚌 Xe sắp tới điểm đón Bùi Đức An!\nXe còn cách khoảng 106m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:08:22', 'approaching', 0),
(1280, 'TB1764479305009', 'PH_192', '✅ Bùi Đức An đã lên xe an toàn\nCon đã được tài xế đón tại 963 Hai Bà Trưng, Quận 10, TP.HCM lúc 12:08', '2025-11-30 12:08:25', 'picked_up', 0),
(1281, 'TB1764479335116', 'PH_292', '🚌 Xe sắp tới điểm đón Đỗ Văn Quang!\nXe còn cách khoảng 274m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:08:55', 'approaching', 0),
(1282, 'TB1764479337133', 'PH_292', '📍 Xe đã đến điểm đón Đỗ Văn Quang!\nXe bus hiện đang ở rất gần (63m), con có thể lên xe ngay!', '2025-11-30 12:08:57', 'arrived', 0),
(1283, 'TB1764479365319', 'PH_289', '🚌 Xe sắp tới điểm đón Nguyễn Quốc Trang!\nXe còn cách khoảng 138m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:09:25', 'approaching', 0),
(1284, 'TB1764479369304', 'PH_289', '✅ Nguyễn Quốc Trang đã lên xe an toàn\nCon đã được tài xế đón tại 679 Tôn Đức Thắng, Quận 10, TP.HCM lúc 12:09', '2025-11-30 12:09:29', 'picked_up', 0),
(1285, 'TB1764479379389', 'PH_187', '🚌 Xe sắp tới điểm đón Trần Thu An!\nXe còn cách khoảng 217m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:09:39', 'approaching', 0),
(1286, 'TB1764479381391', 'PH_187', '📍 Xe đã đến điểm đón Trần Thu An!\nXe bus hiện đang ở rất gần (82m), con có thể lên xe ngay!', '2025-11-30 12:09:41', 'arrived', 0),
(1287, 'TB1764479383407', 'PH_187', '✅ Trần Thu An đã lên xe an toàn\nCon đã được tài xế đón tại 108 Điện Biên Phủ, Phú Nhuận, TP.HCM lúc 12:09', '2025-11-30 12:09:43', 'picked_up', 0),
(1288, 'TB1764479395450', 'PH_203', '📍 Xe đã đến điểm đón Hồ Xuân Quỳnh!\nXe bus hiện đang ở rất gần (81m), con có thể lên xe ngay!', '2025-11-30 12:09:55', 'arrived', 0),
(1289, 'TB1764479395459', 'PH_180', '🚌 Xe sắp tới điểm đón Lê Quốc Quân!\nXe còn cách khoảng 133m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:09:55', 'approaching', 0),
(1290, 'TB1764479397469', 'PH_203', '✅ Hồ Xuân Quỳnh đã lên xe an toàn\nCon đã được tài xế đón tại 275 Nguyễn Huệ, Quận 5, TP.HCM lúc 12:09', '2025-11-30 12:09:57', 'picked_up', 0),
(1291, 'TB1764479397476', 'PH_180', '📍 Xe đã đến điểm đón Lê Quốc Quân!\nXe bus hiện đang ở rất gần (62m), con có thể lên xe ngay!', '2025-11-30 12:09:57', 'arrived', 0),
(1292, 'TB1764479399476', 'PH_180', '✅ Lê Quốc Quân đã lên xe an toàn\nCon đã được tài xế đón tại 217 Nam Kỳ Khởi Nghĩa, Bình Thạnh, TP.HCM lúc 12:09', '2025-11-30 12:09:59', 'picked_up', 0),
(1293, 'TB1764479399483', 'PH_165', '🚌 Xe sắp tới điểm đón Nguyễn Thanh Nhi!\nXe còn cách khoảng 492m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:09:59', 'approaching', 0),
(1294, 'TB1764479417536', 'PH_165', '📍 Xe đã đến điểm đón Nguyễn Thanh Nhi!\nXe bus hiện đang ở rất gần (65m), con có thể lên xe ngay!', '2025-11-30 12:10:17', 'arrived', 0),
(1295, 'TB1764479419513', 'PH_165', '✅ Nguyễn Thanh Nhi đã lên xe an toàn\nCon đã được tài xế đón tại 598 Nguyễn Huệ, Phú Nhuận, TP.HCM lúc 12:10', '2025-11-30 12:10:19', 'picked_up', 0),
(1296, 'TB1764479433584', 'PH_179', '🚌 Xe sắp tới điểm đón Trần Kim Lan!\nXe còn cách khoảng 472m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:10:33', 'approaching', 0),
(1297, 'TB1764479433593', 'PH_182', '🚌 Xe sắp tới điểm đón Lê Minh Vân!\nXe còn cách khoảng 481m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:10:33', 'approaching', 0),
(1298, 'TB1764479435593', 'PH_179', '📍 Xe đã đến điểm đón Trần Kim Lan!\nXe bus hiện đang ở rất gần (91m), con có thể lên xe ngay!', '2025-11-30 12:10:35', 'arrived', 0),
(1299, 'TB1764479435600', 'PH_48', '🚌 Xe sắp tới điểm đón Phan Quốc An!\nXe còn cách khoảng 346m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:10:35', 'approaching', 0),
(1300, 'TB1764479437626', 'PH_179', '✅ Trần Kim Lan đã lên xe an toàn\nCon đã được tài xế đón tại 649 Hai Bà Trưng, Quận 4, TP.HCM lúc 12:10', '2025-11-30 12:10:37', 'picked_up', 0),
(1301, 'TB1764479449689', 'PH_48', '✅ Phan Quốc An đã lên xe an toàn\nCon đã được tài xế đón tại 473 Pasteur, Quận 10, TP.HCM lúc 12:10', '2025-11-30 12:10:49', 'picked_up', 0),
(1302, 'TB1764479457710', 'PH_182', '✅ Lê Minh Vân đã lên xe an toàn\nCon đã được tài xế đón tại 144 Lý Tự Trọng, Bình Thạnh, TP.HCM lúc 12:10', '2025-11-30 12:10:57', 'picked_up', 0),
(1303, 'TB1764479485937', 'PH_5', '🚌 Xe sắp tới điểm đón Phan Xuân Lan!\nXe còn cách khoảng 126m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:11:25', 'approaching', 0),
(1304, 'TB1764479487922', 'PH_5', '✅ Phan Xuân Lan đã lên xe an toàn\nCon đã được tài xế đón tại 448 Trần Hưng Đạo, Bình Thạnh, TP.HCM lúc 12:11', '2025-11-30 12:11:27', 'picked_up', 0),
(1305, 'TB1764479494729', 'PH_184', '✅ Phan Thị Long đã lên xe an toàn\nCon đã được tài xế đón tại 227 Nguyễn Trãi, Quận 3, TP.HCM lúc 12:11', '2025-11-30 12:11:34', 'picked_up', 0),
(1306, 'TB1764479494787', 'PH_191', '✅ Phan Văn Sơn đã lên xe an toàn\nCon đã được tài xế đón tại 705 Pasteur, Phú Nhuận, TP.HCM lúc 12:11', '2025-11-30 12:11:34', 'picked_up', 0),
(1307, 'TB1764479508016', 'PH_19', '✅ Bùi Quốc Vy đã lên xe an toàn\nCon đã được tài xế đón tại 610 Nguyễn Trãi, Quận 4, TP.HCM lúc 12:11', '2025-11-30 12:11:48', 'picked_up', 0),
(1308, 'TB1764479520140', 'PH_216', '🚌 Xe sắp tới điểm đón Bùi Hữu Tùng!\nXe còn cách khoảng 310m, vui lòng chuẩn bị đón con nhé!', '2025-11-30 12:12:00', 'approaching', 0),
(1309, 'TB1764479526184', 'PH_216', '📍 Xe đã đến điểm đón Bùi Hữu Tùng!\nXe bus hiện đang ở rất gần (60m), con có thể lên xe ngay!', '2025-11-30 12:12:06', 'arrived', 0),
(1310, 'TB1764479528203', 'PH_216', '✅ Bùi Hữu Tùng đã lên xe an toàn\nCon đã được tài xế đón tại 101 Nam Kỳ Khởi Nghĩa, Quận 10, TP.HCM lúc 12:12', '2025-11-30 12:12:08', 'picked_up', 0),
(1311, 'TB1764479554761', 'PH_10', '✅ Huỳnh Thanh Nhi đã lên xe an toàn\nCon đã được tài xế đón tại 467 Hai Bà Trưng, Quận 4, TP.HCM lúc 12:12', '2025-11-30 12:12:34', 'picked_up', 0),
(1312, 'TB1764479554767', 'PH_34', '✅ Huỳnh Xuân Cường đã lên xe an toàn\nCon đã được tài xế đón tại 640 Lê Lợi, Quận 5, TP.HCM lúc 12:12', '2025-11-30 12:12:34', 'picked_up', 0);

-- --------------------------------------------------------

--
-- Table structure for table `thongbao_taixe`
--

CREATE TABLE `thongbao_taixe` (
  `Id` int(11) NOT NULL,
  `MaThongBao` varchar(50) NOT NULL,
  `MaTaiXe` varchar(10) NOT NULL,
  `NoiDung` text NOT NULL,
  `LoaiThongBao` varchar(50) DEFAULT 'Thông báo chung',
  `ThoiGian` datetime DEFAULT current_timestamp(),
  `DaDoc` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `thongbao_taixe`
--

INSERT INTO `thongbao_taixe` (`Id`, `MaThongBao`, `MaTaiXe`, `NoiDung`, `LoaiThongBao`, `ThoiGian`, `DaDoc`) VALUES
(1, 'DRIVER_NOTIF_001', 'TX001', 'Bạn có lịch trình mới vào ngày 01/12/2025 lúc 07:00 - Tuyến TU001', 'Nhiệm vụ mới', '2025-11-30 09:23:38', 1),
(2, 'DRIVER_NOTIF_002', 'TX001', 'Lịch trình ngày 30/11/2025 đã hoàn thành thành công. Cảm ơn bạn!', 'Hoàn thành', '2025-11-29 11:23:38', 1),
(3, 'DRIVER_NOTIF_003', 'TX001', 'Nhắc nhở: Kiểm tra xe trước khi khởi hành vào sáng mai', 'Nhắc nhở', '2025-11-30 08:23:38', 1),
(4, 'DRIVER_NOTIF_004', 'TX002', 'Bạn có lịch trình mới vào ngày 01/12/2025 lúc 14:00 - Tuyến TU002', 'Nhiệm vụ mới', '2025-11-30 06:23:38', 0),
(5, 'DRIVER_NOTIF_005', 'TX002', 'Xe buýt của bạn cần bảo trì định kỳ. Vui lòng liên hệ phòng kỹ thuật.', 'Bảo trì', '2025-11-28 11:23:38', 1),
(6, 'DRIVER_ABSENCE_1764477018604', 'TX001', '👤 Học sinh vắng mặt - Hồ Minh Hùng\n\nHọc sinh Hồ Minh Hùng đã xin nghỉ học.\n\n📅 Ngày: 30/11/2025\n🕐 Ca: Chiều - 16:00:00\n🚌 Tuyến: Tuyến tự động 3\n📍 Điểm đón: 484 Pasteur, Phú Nhuận, TP.HCM\n📝 Lý do: ốm\n\n⚠️ Bạn không cần đến điểm đón này.', 'Vắng mặt', '2025-11-30 11:30:18', 1),
(7, 'DRIVER_ABSENCE_1764477392065', 'TX001', '👤 Học sinh vắng mặt - Hồ Minh Hùng\n\nHọc sinh Hồ Minh Hùng đã xin nghỉ học.\n\n📅 Ngày: 30/11/2025\n🕐 Ca: Chiều - 16:00:00\n🚌 Tuyến: Tuyến tự động 3\n📍 Điểm đón: 484 Pasteur, Phú Nhuận, TP.HCM\n📝 Lý do: a\n\n⚠️ Bạn không cần đến điểm đón này.', 'Vắng mặt', '2025-11-30 11:36:32', 1),
(8, 'DRIVER_ABSENCE_1764477556806', 'TX001', '👤 Học sinh vắng mặt - Hồ Minh Hùng\n\nHọc sinh Hồ Minh Hùng đã xin nghỉ học.\n\n📅 Ngày: 30/11/2025\n🕐 Ca: Chiều - 16:00:00\n🚌 Tuyến: Tuyến tự động 3\n📍 Điểm đón: 484 Pasteur, Phú Nhuận, TP.HCM\n📝 Lý do: a\n\n⚠️ Bạn không cần đến điểm đón này.', 'Vắng mặt', '2025-11-30 11:39:16', 1),
(9, 'DRIVER_ABSENCE_1764477840210', 'TX001', '👤 Học sinh vắng mặt - Hồ Minh Hùng\n\nHọc sinh Hồ Minh Hùng đã xin nghỉ học.\n\n📅 Ngày: 30/11/2025\n🕐 Ca: Chiều - 16:00:00\n🚌 Tuyến: Tuyến tự động 3\n📍 Điểm đón: 484 Pasteur, Phú Nhuận, TP.HCM\n📝 Lý do: ư\n\n⚠️ Bạn không cần đến điểm đón này.', 'Vắng mặt', '2025-11-30 11:44:00', 1),
(10, 'DRIVER_ABSENCE_1764478124434', 'TX001', '👤 Học sinh vắng mặt - Hồ Minh Hùng\n\nHọc sinh Hồ Minh Hùng đã xin nghỉ học.\n\n📅 Ngày: 30/11/2025\n🕐 Ca: Chiều - 16:00:00\n🚌 Tuyến: Tuyến tự động 3\n📍 Điểm đón: 484 Pasteur, Phú Nhuận, TP.HCM\n📝 Lý do: a\n\n⚠️ Bạn không cần đến điểm đón này.', 'Vắng mặt', '2025-11-30 11:48:44', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('admin','driver','parent') NOT NULL,
  `ProfileId` varchar(20) NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Username`, `Password`, `Role`, `ProfileId`, `CreatedAt`) VALUES
(1, 'admin', '123456', 'admin', 'QL001', '2025-11-24 12:06:47'),
(2, 'admin2', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'admin', 'QL002', '2025-11-24 12:06:47'),
(3, 'taixe01', '123456', 'driver', 'TX001', '2025-11-24 12:06:47'),
(4, 'taixe02', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX002', '2025-11-24 12:06:47'),
(5, 'taixe03', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX003', '2025-11-24 12:06:47'),
(6, 'taixe04', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX004', '2025-11-24 12:06:47'),
(7, 'taixe05', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX005', '2025-11-24 12:06:47'),
(8, 'phuhuynh01', '123456', 'parent', 'PH001', '2025-11-24 12:06:47'),
(9, 'phuhuynh02', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH002', '2025-11-24 12:06:47'),
(10, 'phuhuynh03', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH003', '2025-11-24 12:06:47'),
(11, 'taixe__1', '123456', 'driver', 'TX_1', '2025-11-24 12:07:01'),
(12, 'taixe__2', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_2', '2025-11-24 12:07:01'),
(13, 'taixe__3', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_3', '2025-11-24 12:07:01'),
(14, 'taixe__4', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_4', '2025-11-24 12:07:01'),
(15, 'taixe__5', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_5', '2025-11-24 12:07:01'),
(16, 'taixe__6', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_6', '2025-11-24 12:07:01'),
(17, 'taixe__7', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_7', '2025-11-24 12:07:01'),
(18, 'taixe__8', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_8', '2025-11-24 12:07:01'),
(19, 'taixe__9', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_9', '2025-11-24 12:07:01'),
(20, 'taixe__10', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_10', '2025-11-24 12:07:01'),
(21, 'taixe__11', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_11', '2025-11-24 12:07:01'),
(22, 'taixe__12', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_12', '2025-11-24 12:07:01'),
(23, 'taixe__13', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_13', '2025-11-24 12:07:01'),
(24, 'taixe__14', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_14', '2025-11-24 12:07:01'),
(25, 'taixe__15', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_15', '2025-11-24 12:07:01'),
(26, 'taixe__16', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_16', '2025-11-24 12:07:01'),
(27, 'taixe__17', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_17', '2025-11-24 12:07:01'),
(28, 'taixe__18', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_18', '2025-11-24 12:07:01'),
(29, 'taixe__19', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_19', '2025-11-24 12:07:01'),
(30, 'taixe__20', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_20', '2025-11-24 12:07:01'),
(31, 'phuhuynh__1', '123456', 'parent', 'PH_1', '2025-11-24 12:07:01'),
(32, 'phuhuynh__2', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_2', '2025-11-24 12:07:01'),
(33, 'phuhuynh__3', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_3', '2025-11-24 12:07:01'),
(34, 'phuhuynh__4', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_4', '2025-11-24 12:07:01'),
(35, 'phuhuynh__5', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_5', '2025-11-24 12:07:01'),
(36, 'phuhuynh__6', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_6', '2025-11-24 12:07:01'),
(37, 'phuhuynh__7', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_7', '2025-11-24 12:07:01'),
(38, 'phuhuynh__8', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_8', '2025-11-24 12:07:01'),
(39, 'phuhuynh__9', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_9', '2025-11-24 12:07:01'),
(40, 'phuhuynh__10', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_10', '2025-11-24 12:07:01'),
(41, 'phuhuynh__11', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_11', '2025-11-24 12:07:01'),
(42, 'phuhuynh__12', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_12', '2025-11-24 12:07:01'),
(43, 'phuhuynh__13', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_13', '2025-11-24 12:07:01'),
(44, 'phuhuynh__14', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_14', '2025-11-24 12:07:01'),
(45, 'phuhuynh__15', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_15', '2025-11-24 12:07:01'),
(46, 'phuhuynh__16', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_16', '2025-11-24 12:07:01'),
(47, 'phuhuynh__17', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_17', '2025-11-24 12:07:01'),
(48, 'phuhuynh__18', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_18', '2025-11-24 12:07:01'),
(49, 'phuhuynh__19', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_19', '2025-11-24 12:07:01'),
(50, 'phuhuynh__20', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_20', '2025-11-24 12:07:01'),
(51, 'phuhuynh__21', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_21', '2025-11-24 12:07:01'),
(52, 'phuhuynh__22', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_22', '2025-11-24 12:07:01'),
(53, 'phuhuynh__23', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_23', '2025-11-24 12:07:01'),
(54, 'phuhuynh__24', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_24', '2025-11-24 12:07:01'),
(55, 'phuhuynh__25', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_25', '2025-11-24 12:07:01'),
(56, 'phuhuynh__26', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_26', '2025-11-24 12:07:01'),
(57, 'phuhuynh__27', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_27', '2025-11-24 12:07:01'),
(58, 'phuhuynh__28', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_28', '2025-11-24 12:07:01'),
(59, 'phuhuynh__29', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_29', '2025-11-24 12:07:01'),
(60, 'phuhuynh__30', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_30', '2025-11-24 12:07:01'),
(61, 'phuhuynh__31', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_31', '2025-11-24 12:07:01'),
(62, 'phuhuynh__32', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_32', '2025-11-24 12:07:01'),
(63, 'phuhuynh__33', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_33', '2025-11-24 12:07:01'),
(64, 'phuhuynh__34', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_34', '2025-11-24 12:07:01'),
(65, 'phuhuynh__35', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_35', '2025-11-24 12:07:01'),
(66, 'phuhuynh__36', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_36', '2025-11-24 12:07:01'),
(67, 'phuhuynh__37', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_37', '2025-11-24 12:07:01'),
(68, 'phuhuynh__38', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_38', '2025-11-24 12:07:01'),
(69, 'phuhuynh__39', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_39', '2025-11-24 12:07:01'),
(70, 'phuhuynh__40', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_40', '2025-11-24 12:07:01'),
(71, 'phuhuynh__41', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_41', '2025-11-24 12:07:01'),
(72, 'phuhuynh__42', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_42', '2025-11-24 12:07:01'),
(73, 'phuhuynh__43', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_43', '2025-11-24 12:07:01'),
(74, 'phuhuynh__44', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_44', '2025-11-24 12:07:01'),
(75, 'phuhuynh__45', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_45', '2025-11-24 12:07:01'),
(76, 'phuhuynh__46', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_46', '2025-11-24 12:07:01'),
(77, 'phuhuynh__47', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_47', '2025-11-24 12:07:01'),
(78, 'phuhuynh__48', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_48', '2025-11-24 12:07:01'),
(79, 'phuhuynh__49', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_49', '2025-11-24 12:07:01'),
(80, 'phuhuynh__50', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_50', '2025-11-24 12:07:01'),
(81, 'phuhuynh__51', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_51', '2025-11-24 12:07:01'),
(82, 'phuhuynh__52', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_52', '2025-11-24 12:07:01'),
(83, 'phuhuynh__53', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_53', '2025-11-24 12:07:01'),
(84, 'phuhuynh__54', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_54', '2025-11-24 12:07:01'),
(85, 'phuhuynh__55', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_55', '2025-11-24 12:07:01'),
(86, 'phuhuynh__56', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_56', '2025-11-24 12:07:01'),
(87, 'phuhuynh__57', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_57', '2025-11-24 12:07:01'),
(88, 'phuhuynh__58', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_58', '2025-11-24 12:07:01'),
(89, 'phuhuynh__59', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_59', '2025-11-24 12:07:01'),
(90, 'phuhuynh__60', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_60', '2025-11-24 12:07:01'),
(91, 'phuhuynh__61', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_61', '2025-11-24 12:07:01'),
(92, 'phuhuynh__62', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_62', '2025-11-24 12:07:01'),
(93, 'phuhuynh__63', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_63', '2025-11-24 12:07:01'),
(94, 'phuhuynh__64', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_64', '2025-11-24 12:07:02'),
(95, 'phuhuynh__65', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_65', '2025-11-24 12:07:02'),
(96, 'phuhuynh__66', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_66', '2025-11-24 12:07:02'),
(97, 'phuhuynh__67', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_67', '2025-11-24 12:07:02'),
(98, 'phuhuynh__68', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_68', '2025-11-24 12:07:02'),
(99, 'phuhuynh__69', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_69', '2025-11-24 12:07:02'),
(100, 'phuhuynh__70', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_70', '2025-11-24 12:07:02'),
(101, 'phuhuynh__71', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_71', '2025-11-24 12:07:02'),
(102, 'phuhuynh__72', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_72', '2025-11-24 12:07:02'),
(103, 'phuhuynh__73', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_73', '2025-11-24 12:07:02'),
(104, 'phuhuynh__74', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_74', '2025-11-24 12:07:02'),
(105, 'phuhuynh__75', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_75', '2025-11-24 12:07:02'),
(106, 'phuhuynh__76', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_76', '2025-11-24 12:07:02'),
(107, 'phuhuynh__77', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_77', '2025-11-24 12:07:02'),
(108, 'phuhuynh__78', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_78', '2025-11-24 12:07:02'),
(109, 'phuhuynh__79', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_79', '2025-11-24 12:07:02'),
(110, 'phuhuynh__80', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_80', '2025-11-24 12:07:02'),
(111, 'phuhuynh__81', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_81', '2025-11-24 12:07:02'),
(112, 'phuhuynh__82', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_82', '2025-11-24 12:07:02'),
(113, 'phuhuynh__83', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_83', '2025-11-24 12:07:02'),
(114, 'phuhuynh__84', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_84', '2025-11-24 12:07:02'),
(115, 'phuhuynh__85', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_85', '2025-11-24 12:07:02'),
(116, 'phuhuynh__86', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_86', '2025-11-24 12:07:02'),
(117, 'phuhuynh__87', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_87', '2025-11-24 12:07:02'),
(118, 'phuhuynh__88', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_88', '2025-11-24 12:07:02'),
(119, 'phuhuynh__89', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_89', '2025-11-24 12:07:02'),
(120, 'phuhuynh__90', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_90', '2025-11-24 12:07:02'),
(121, 'phuhuynh__91', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_91', '2025-11-24 12:07:02'),
(122, 'phuhuynh__92', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_92', '2025-11-24 12:07:02'),
(123, 'phuhuynh__93', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_93', '2025-11-24 12:07:02'),
(124, 'phuhuynh__94', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_94', '2025-11-24 12:07:02'),
(125, 'phuhuynh__95', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_95', '2025-11-24 12:07:02'),
(126, 'phuhuynh__96', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_96', '2025-11-24 12:07:02'),
(127, 'phuhuynh__97', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_97', '2025-11-24 12:07:02'),
(128, 'phuhuynh__98', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_98', '2025-11-24 12:07:02'),
(129, 'phuhuynh__99', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_99', '2025-11-24 12:07:02'),
(130, 'phuhuynh__100', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_100', '2025-11-24 12:07:02'),
(131, 'phuhuynh__101', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_101', '2025-11-24 12:07:02'),
(132, 'phuhuynh__102', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_102', '2025-11-24 12:07:02'),
(133, 'phuhuynh__103', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_103', '2025-11-24 12:07:02'),
(134, 'phuhuynh__104', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_104', '2025-11-24 12:07:02'),
(135, 'phuhuynh__105', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_105', '2025-11-24 12:07:02'),
(136, 'phuhuynh__106', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_106', '2025-11-24 12:07:02'),
(137, 'phuhuynh__107', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_107', '2025-11-24 12:07:02'),
(138, 'phuhuynh__108', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_108', '2025-11-24 12:07:02'),
(139, 'phuhuynh__109', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_109', '2025-11-24 12:07:02'),
(140, 'phuhuynh__110', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_110', '2025-11-24 12:07:02'),
(141, 'phuhuynh__111', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_111', '2025-11-24 12:07:02'),
(142, 'phuhuynh__112', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_112', '2025-11-24 12:07:02'),
(143, 'phuhuynh__113', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_113', '2025-11-24 12:07:02'),
(144, 'phuhuynh__114', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_114', '2025-11-24 12:07:02'),
(145, 'phuhuynh__115', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_115', '2025-11-24 12:07:02'),
(146, 'phuhuynh__116', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_116', '2025-11-24 12:07:02'),
(147, 'phuhuynh__117', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_117', '2025-11-24 12:07:02'),
(148, 'phuhuynh__118', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_118', '2025-11-24 12:07:02'),
(149, 'phuhuynh__119', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_119', '2025-11-24 12:07:02'),
(150, 'phuhuynh__120', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_120', '2025-11-24 12:07:02'),
(151, 'phuhuynh__121', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_121', '2025-11-24 12:07:02'),
(152, 'phuhuynh__122', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_122', '2025-11-24 12:07:02'),
(153, 'phuhuynh__123', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_123', '2025-11-24 12:07:02'),
(154, 'phuhuynh__124', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_124', '2025-11-24 12:07:02'),
(155, 'phuhuynh__125', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_125', '2025-11-24 12:07:02'),
(156, 'phuhuynh__126', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_126', '2025-11-24 12:07:02'),
(157, 'phuhuynh__127', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_127', '2025-11-24 12:07:02'),
(158, 'phuhuynh__128', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_128', '2025-11-24 12:07:02'),
(159, 'phuhuynh__129', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_129', '2025-11-24 12:07:02'),
(160, 'phuhuynh__130', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_130', '2025-11-24 12:07:02'),
(161, 'phuhuynh__131', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_131', '2025-11-24 12:07:02'),
(162, 'phuhuynh__132', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_132', '2025-11-24 12:07:02'),
(163, 'phuhuynh__133', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_133', '2025-11-24 12:07:02'),
(164, 'phuhuynh__134', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_134', '2025-11-24 12:07:02'),
(165, 'phuhuynh__135', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_135', '2025-11-24 12:07:02'),
(166, 'phuhuynh__136', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_136', '2025-11-24 12:07:02'),
(167, 'phuhuynh__137', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_137', '2025-11-24 12:07:02'),
(168, 'phuhuynh__138', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_138', '2025-11-24 12:07:02'),
(169, 'phuhuynh__139', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_139', '2025-11-24 12:07:02'),
(170, 'phuhuynh__140', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_140', '2025-11-24 12:07:02'),
(171, 'phuhuynh__141', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_141', '2025-11-24 12:07:02'),
(172, 'phuhuynh__142', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_142', '2025-11-24 12:07:02'),
(173, 'phuhuynh__143', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_143', '2025-11-24 12:07:02'),
(174, 'phuhuynh__144', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_144', '2025-11-24 12:07:02'),
(175, 'phuhuynh__145', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_145', '2025-11-24 12:07:02'),
(176, 'phuhuynh__146', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_146', '2025-11-24 12:07:02'),
(177, 'phuhuynh__147', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_147', '2025-11-24 12:07:02'),
(178, 'phuhuynh__148', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_148', '2025-11-24 12:07:02'),
(179, 'phuhuynh__149', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_149', '2025-11-24 12:07:02'),
(180, 'phuhuynh__150', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_150', '2025-11-24 12:07:02'),
(181, 'phuhuynh__151', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_151', '2025-11-24 12:07:02'),
(182, 'phuhuynh__152', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_152', '2025-11-24 12:07:02'),
(183, 'phuhuynh__153', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_153', '2025-11-24 12:07:02'),
(184, 'phuhuynh__154', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_154', '2025-11-24 12:07:02'),
(185, 'phuhuynh__155', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_155', '2025-11-24 12:07:02'),
(186, 'phuhuynh__156', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_156', '2025-11-24 12:07:02'),
(187, 'phuhuynh__157', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_157', '2025-11-24 12:07:02'),
(188, 'phuhuynh__158', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_158', '2025-11-24 12:07:02'),
(189, 'phuhuynh__159', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_159', '2025-11-24 12:07:02'),
(190, 'phuhuynh__160', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_160', '2025-11-24 12:07:02'),
(191, 'phuhuynh__161', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_161', '2025-11-24 12:07:02'),
(192, 'phuhuynh__162', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_162', '2025-11-24 12:07:02'),
(193, 'phuhuynh__163', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_163', '2025-11-24 12:07:02'),
(194, 'phuhuynh__164', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_164', '2025-11-24 12:07:02'),
(195, 'phuhuynh__165', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_165', '2025-11-24 12:07:02'),
(196, 'phuhuynh__166', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_166', '2025-11-24 12:07:02'),
(197, 'phuhuynh__167', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_167', '2025-11-24 12:07:02'),
(198, 'phuhuynh__168', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_168', '2025-11-24 12:07:02'),
(199, 'phuhuynh__169', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_169', '2025-11-24 12:07:02'),
(200, 'phuhuynh__170', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_170', '2025-11-24 12:07:02'),
(201, 'phuhuynh__171', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_171', '2025-11-24 12:07:02'),
(202, 'phuhuynh__172', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_172', '2025-11-24 12:07:02'),
(203, 'phuhuynh__173', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_173', '2025-11-24 12:07:02'),
(204, 'phuhuynh__174', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_174', '2025-11-24 12:07:02'),
(205, 'phuhuynh__175', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_175', '2025-11-24 12:07:02'),
(206, 'phuhuynh__176', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_176', '2025-11-24 12:07:02'),
(207, 'phuhuynh__177', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_177', '2025-11-24 12:07:02'),
(208, 'phuhuynh__178', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_178', '2025-11-24 12:07:02'),
(209, 'phuhuynh__179', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_179', '2025-11-24 12:07:02'),
(210, 'phuhuynh__180', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_180', '2025-11-24 12:07:02'),
(211, 'phuhuynh__181', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_181', '2025-11-24 12:07:02'),
(212, 'phuhuynh__182', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_182', '2025-11-24 12:07:02'),
(213, 'phuhuynh__183', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_183', '2025-11-24 12:07:02'),
(214, 'phuhuynh__184', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_184', '2025-11-24 12:07:02'),
(215, 'phuhuynh__185', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_185', '2025-11-24 12:07:02'),
(216, 'phuhuynh__186', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_186', '2025-11-24 12:07:02'),
(217, 'phuhuynh__187', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_187', '2025-11-24 12:07:02'),
(218, 'phuhuynh__188', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_188', '2025-11-24 12:07:02'),
(219, 'phuhuynh__189', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_189', '2025-11-24 12:07:02'),
(220, 'phuhuynh__190', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_190', '2025-11-24 12:07:02'),
(221, 'phuhuynh__191', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_191', '2025-11-24 12:07:02'),
(222, 'phuhuynh__192', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_192', '2025-11-24 12:07:02'),
(223, 'phuhuynh__193', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_193', '2025-11-24 12:07:02'),
(224, 'phuhuynh__194', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_194', '2025-11-24 12:07:02'),
(225, 'phuhuynh__195', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_195', '2025-11-24 12:07:02'),
(226, 'phuhuynh__196', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_196', '2025-11-24 12:07:02'),
(227, 'phuhuynh__197', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_197', '2025-11-24 12:07:02'),
(228, 'phuhuynh__198', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_198', '2025-11-24 12:07:02'),
(229, 'phuhuynh__199', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_199', '2025-11-24 12:07:02'),
(230, 'phuhuynh__200', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_200', '2025-11-24 12:07:02'),
(231, 'phuhuynh__201', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_201', '2025-11-24 12:07:02'),
(232, 'phuhuynh__202', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_202', '2025-11-24 12:07:02'),
(233, 'phuhuynh__203', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_203', '2025-11-24 12:07:02'),
(234, 'phuhuynh__204', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_204', '2025-11-24 12:07:02'),
(235, 'phuhuynh__205', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_205', '2025-11-24 12:07:02'),
(236, 'phuhuynh__206', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_206', '2025-11-24 12:07:02'),
(237, 'phuhuynh__207', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_207', '2025-11-24 12:07:02'),
(238, 'phuhuynh__208', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_208', '2025-11-24 12:07:02'),
(239, 'phuhuynh__209', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_209', '2025-11-24 12:07:02'),
(240, 'phuhuynh__210', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_210', '2025-11-24 12:07:02'),
(241, 'phuhuynh__211', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_211', '2025-11-24 12:07:02'),
(242, 'phuhuynh__212', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_212', '2025-11-24 12:07:02'),
(243, 'phuhuynh__213', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_213', '2025-11-24 12:07:02'),
(244, 'phuhuynh__214', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_214', '2025-11-24 12:07:02'),
(245, 'phuhuynh__215', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_215', '2025-11-24 12:07:02'),
(246, 'phuhuynh__216', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_216', '2025-11-24 12:07:02'),
(247, 'phuhuynh__217', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_217', '2025-11-24 12:07:02'),
(248, 'phuhuynh__218', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_218', '2025-11-24 12:07:02'),
(249, 'phuhuynh__219', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_219', '2025-11-24 12:07:02'),
(250, 'phuhuynh__220', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_220', '2025-11-24 12:07:02'),
(251, 'phuhuynh__221', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_221', '2025-11-24 12:07:02'),
(252, 'phuhuynh__222', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_222', '2025-11-24 12:07:02'),
(253, 'phuhuynh__223', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_223', '2025-11-24 12:07:02'),
(254, 'phuhuynh__224', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_224', '2025-11-24 12:07:02'),
(255, 'phuhuynh__225', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_225', '2025-11-24 12:07:02'),
(256, 'phuhuynh__226', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_226', '2025-11-24 12:07:02'),
(257, 'phuhuynh__227', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_227', '2025-11-24 12:07:02'),
(258, 'phuhuynh__228', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_228', '2025-11-24 12:07:02'),
(259, 'phuhuynh__229', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_229', '2025-11-24 12:07:02'),
(260, 'phuhuynh__230', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_230', '2025-11-24 12:07:02'),
(261, 'phuhuynh__231', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_231', '2025-11-24 12:07:02'),
(262, 'phuhuynh__232', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_232', '2025-11-24 12:07:02'),
(263, 'phuhuynh__233', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_233', '2025-11-24 12:07:02'),
(264, 'phuhuynh__234', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_234', '2025-11-24 12:07:02'),
(265, 'phuhuynh__235', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_235', '2025-11-24 12:07:02'),
(266, 'phuhuynh__236', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_236', '2025-11-24 12:07:02'),
(267, 'phuhuynh__237', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_237', '2025-11-24 12:07:02'),
(268, 'phuhuynh__238', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_238', '2025-11-24 12:07:02'),
(269, 'phuhuynh__239', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_239', '2025-11-24 12:07:02'),
(270, 'phuhuynh__240', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_240', '2025-11-24 12:07:02'),
(271, 'phuhuynh__241', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_241', '2025-11-24 12:07:02'),
(272, 'phuhuynh__242', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_242', '2025-11-24 12:07:02'),
(273, 'phuhuynh__243', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_243', '2025-11-24 12:07:02'),
(274, 'phuhuynh__244', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_244', '2025-11-24 12:07:02'),
(275, 'phuhuynh__245', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_245', '2025-11-24 12:07:02'),
(276, 'phuhuynh__246', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_246', '2025-11-24 12:07:02'),
(277, 'phuhuynh__247', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_247', '2025-11-24 12:07:02'),
(278, 'phuhuynh__248', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_248', '2025-11-24 12:07:02'),
(279, 'phuhuynh__249', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_249', '2025-11-24 12:07:02'),
(280, 'phuhuynh__250', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_250', '2025-11-24 12:07:02'),
(281, 'phuhuynh__251', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_251', '2025-11-24 12:07:02'),
(282, 'phuhuynh__252', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_252', '2025-11-24 12:07:02'),
(283, 'phuhuynh__253', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_253', '2025-11-24 12:07:02'),
(284, 'phuhuynh__254', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_254', '2025-11-24 12:07:02'),
(285, 'phuhuynh__255', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_255', '2025-11-24 12:07:02'),
(286, 'phuhuynh__256', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_256', '2025-11-24 12:07:02'),
(287, 'phuhuynh__257', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_257', '2025-11-24 12:07:02'),
(288, 'phuhuynh__258', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_258', '2025-11-24 12:07:02'),
(289, 'phuhuynh__259', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_259', '2025-11-24 12:07:02'),
(290, 'phuhuynh__260', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_260', '2025-11-24 12:07:02'),
(291, 'phuhuynh__261', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_261', '2025-11-24 12:07:02'),
(292, 'phuhuynh__262', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_262', '2025-11-24 12:07:02'),
(293, 'phuhuynh__263', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_263', '2025-11-24 12:07:02'),
(294, 'phuhuynh__264', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_264', '2025-11-24 12:07:02'),
(295, 'phuhuynh__265', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_265', '2025-11-24 12:07:02'),
(296, 'phuhuynh__266', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_266', '2025-11-24 12:07:02'),
(297, 'phuhuynh__267', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_267', '2025-11-24 12:07:02'),
(298, 'phuhuynh__268', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_268', '2025-11-24 12:07:02'),
(299, 'phuhuynh__269', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_269', '2025-11-24 12:07:02'),
(300, 'phuhuynh__270', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_270', '2025-11-24 12:07:02'),
(301, 'phuhuynh__271', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_271', '2025-11-24 12:07:02'),
(302, 'phuhuynh__272', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_272', '2025-11-24 12:07:02'),
(303, 'phuhuynh__273', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_273', '2025-11-24 12:07:02'),
(304, 'phuhuynh__274', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_274', '2025-11-24 12:07:02'),
(305, 'phuhuynh__275', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_275', '2025-11-24 12:07:03'),
(306, 'phuhuynh__276', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_276', '2025-11-24 12:07:03'),
(307, 'phuhuynh__277', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_277', '2025-11-24 12:07:03'),
(308, 'phuhuynh__278', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_278', '2025-11-24 12:07:03'),
(309, 'phuhuynh__279', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_279', '2025-11-24 12:07:03'),
(310, 'phuhuynh__280', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_280', '2025-11-24 12:07:03'),
(311, 'phuhuynh__281', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_281', '2025-11-24 12:07:03'),
(312, 'phuhuynh__282', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_282', '2025-11-24 12:07:03'),
(313, 'phuhuynh__283', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_283', '2025-11-24 12:07:03'),
(314, 'phuhuynh__284', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_284', '2025-11-24 12:07:03'),
(315, 'phuhuynh__285', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_285', '2025-11-24 12:07:03'),
(316, 'phuhuynh__286', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_286', '2025-11-24 12:07:03'),
(317, 'phuhuynh__287', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_287', '2025-11-24 12:07:03'),
(318, 'phuhuynh__288', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_288', '2025-11-24 12:07:03'),
(319, 'phuhuynh__289', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_289', '2025-11-24 12:07:03'),
(320, 'phuhuynh__290', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_290', '2025-11-24 12:07:03'),
(321, 'phuhuynh__291', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_291', '2025-11-24 12:07:03'),
(322, 'phuhuynh__292', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_292', '2025-11-24 12:07:03'),
(323, 'phuhuynh__293', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_293', '2025-11-24 12:07:03'),
(324, 'phuhuynh__294', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_294', '2025-11-24 12:07:03'),
(325, 'phuhuynh__295', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_295', '2025-11-24 12:07:03'),
(326, 'phuhuynh__296', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_296', '2025-11-24 12:07:03'),
(327, 'phuhuynh__297', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_297', '2025-11-24 12:07:03'),
(328, 'phuhuynh__298', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_298', '2025-11-24 12:07:03'),
(329, 'phuhuynh__299', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_299', '2025-11-24 12:07:03'),
(330, 'phuhuynh__300', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_300', '2025-11-24 12:07:03');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `Id` int(11) NOT NULL,
  `LicensePlate` varchar(20) NOT NULL,
  `Model` varchar(100) DEFAULT NULL,
  `Capacity` int(11) NOT NULL DEFAULT 16 COMMENT 'Số chỗ ngồi của xe',
  `SpeedKmh` int(11) NOT NULL DEFAULT 40 COMMENT 'Tốc độ trung bình (km/h)',
  `IsActive` tinyint(1) DEFAULT 1 COMMENT 'Xe có đang hoạt động không'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`Id`, `LicensePlate`, `Model`, `Capacity`, `SpeedKmh`, `IsActive`) VALUES
(1, '51A-123.45', 'Hyundai County 16 chỗ', 16, 50, 1),
(2, '51B-678.90', 'Toyota Coaster 29 chỗ', 29, 45, 1),
(3, '51C-555.55', 'Ford Transit 16 chỗ', 16, 55, 1),
(4, '5D-111.22', 'Mercedes Sprinter 16 chỗ', 16, 50, 1),
(5, '51E-999.88', 'Hyundai Solati 16 chỗ', 16, 45, 1),
(6, '51B-420.14', 'Hyundai County 29 chỗ', 29, 45, 1),
(7, '51B-700.10', 'Hyundai County 29 chỗ', 29, 45, 1),
(8, '51B-677.11', 'Thaco Town 29 chỗ', 29, 45, 1),
(9, '51B-863.33', 'Samco Felix 29 chỗ', 29, 45, 1),
(10, '51B-694.98', 'Thaco Town 29 chỗ', 29, 45, 1),
(11, '51B-998.59', 'Thaco Town 29 chỗ', 29, 45, 1),
(12, '51B-234.89', 'Thaco Town 29 chỗ', 29, 45, 1),
(13, '51B-735.64', 'Hyundai County 29 chỗ', 29, 45, 1),
(14, '51B-678.12', 'Toyota Coaster 29 chỗ', 29, 45, 1),
(15, '51B-122.54', 'Thaco Town 29 chỗ', 29, 45, 1),
(16, '51B-582.53', 'Samco Felix 29 chỗ', 29, 45, 1),
(17, '51B-771.98', 'Ford Transit 16 chỗ', 16, 45, 1),
(18, '51B-960.28', 'Thaco Town 29 chỗ', 29, 45, 1),
(19, '51B-953.45', 'Hyundai County 29 chỗ', 29, 45, 1),
(20, '51B-293.79', 'Thaco Town 29 chỗ', 29, 45, 1),
(21, '51B-427.30', 'Thaco Town 29 chỗ', 29, 45, 1),
(22, '51B-946.62', 'Thaco Town 29 chỗ', 29, 45, 1),
(23, '51B-841.47', 'Thaco Town 29 chỗ', 29, 45, 1),
(24, '51B-229.25', 'Ford Transit 16 chỗ', 16, 45, 1),
(25, '51B-699.13', 'Ford Transit 16 chỗ', 16, 45, 1);

--
-- Indexes for dumped tables
--

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
  ADD KEY `idx_phuhuynh` (`MaPhuHuynh`),
  ADD KEY `idx_location` (`Latitude`,`Longitude`),
  ADD KEY `idx_trangthai` (`TrangThaiHocTap`);

--
-- Indexes for table `phuhuynh`
--
ALTER TABLE `phuhuynh`
  ADD PRIMARY KEY (`MaPhuHuynh`),
  ADD UNIQUE KEY `UserId` (`UserId`);

--
-- Indexes for table `pickuppoints`
--
ALTER TABLE `pickuppoints`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `RouteId` (`RouteId`),
  ADD KEY `idx_order` (`RouteId`,`PointOrder`),
  ADD KEY `idx_tinhtrang` (`TinhTrangDon`),
  ADD KEY `MaHocSinh` (`MaHocSinh`);

--
-- Indexes for table `quanly`
--
ALTER TABLE `quanly`
  ADD PRIMARY KEY (`MaQuanLy`),
  ADD UNIQUE KEY `UserId` (`UserId`);

--
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `MaTuyen` (`MaTuyen`),
  ADD KEY `DriverId` (`DriverId`),
  ADD KEY `VehicleId` (`VehicleId`),
  ADD KEY `idx_status` (`Status`),
  ADD KEY `idx_location` (`currentLatitude`,`currentLongitude`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_route` (`route_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `schedule_pickup_status`
--
ALTER TABLE `schedule_pickup_status`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `unique_schedule_pickup` (`ScheduleId`,`PickupPointId`),
  ADD KEY `idx_schedule` (`ScheduleId`),
  ADD KEY `idx_pickuppoint` (`PickupPointId`),
  ADD KEY `idx_tinhtrang` (`TinhTrangDon`),
  ADD KEY `idx_schedule_status` (`ScheduleId`,`TinhTrangDon`),
  ADD KEY `idx_time` (`ThoiGianDonThucTe`);

--
-- Indexes for table `thongbao`
--
ALTER TABLE `thongbao`
  ADD PRIMARY KEY (`MaThongBao`);

--
-- Indexes for table `thongbao_phuhuynh`
--
ALTER TABLE `thongbao_phuhuynh`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `MaThongBao` (`MaThongBao`),
  ADD KEY `idx_phuhuynh` (`MaPhuHuynh`),
  ADD KEY `idx_dadoc` (`DaDoc`),
  ADD KEY `idx_thoigian` (`ThoiGian`);

--
-- Indexes for table `thongbao_taixe`
--
ALTER TABLE `thongbao_taixe`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `MaThongBao` (`MaThongBao`),
  ADD KEY `idx_taixe` (`MaTaiXe`),
  ADD KEY `idx_thoigian` (`ThoiGian`),
  ADD KEY `idx_dadoc` (`DaDoc`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pickuppoints`
--
ALTER TABLE `pickuppoints`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=227;

--
-- AUTO_INCREMENT for table `routes`
--
ALTER TABLE `routes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `schedule_pickup_status`
--
ALTER TABLE `schedule_pickup_status`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=718;

--
-- AUTO_INCREMENT for table `thongbao_phuhuynh`
--
ALTER TABLE `thongbao_phuhuynh`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1313;

--
-- AUTO_INCREMENT for table `thongbao_taixe`
--
ALTER TABLE `thongbao_taixe`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=332;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
  ADD CONSTRAINT `pickuppoints_ibfk_1` FOREIGN KEY (`RouteId`) REFERENCES `routes` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pickuppoints_ibfk_2` FOREIGN KEY (`MaHocSinh`) REFERENCES `hocsinh` (`MaHocSinh`) ON DELETE SET NULL;

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
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `fk_schedules_routes` FOREIGN KEY (`route_id`) REFERENCES `routes` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `schedule_pickup_status`
--
ALTER TABLE `schedule_pickup_status`
  ADD CONSTRAINT `fk_schedule_pickup_point` FOREIGN KEY (`PickupPointId`) REFERENCES `pickuppoints` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_schedule_pickup_schedule` FOREIGN KEY (`ScheduleId`) REFERENCES `schedules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `thongbao_phuhuynh`
--
ALTER TABLE `thongbao_phuhuynh`
  ADD CONSTRAINT `fk_thongbao_ph_phuhuynh` FOREIGN KEY (`MaPhuHuynh`) REFERENCES `phuhuynh` (`MaPhuHuynh`) ON DELETE CASCADE;

--
-- Constraints for table `thongbao_taixe`
--
ALTER TABLE `thongbao_taixe`
  ADD CONSTRAINT `thongbao_taixe_ibfk_1` FOREIGN KEY (`MaTaiXe`) REFERENCES `drivers` (`Id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
