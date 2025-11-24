-- Generated Seed Data
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- 1. Vehicles (20 records)
INSERT INTO `vehicles` (`LicensePlate`, `Model`, `Capacity`, `SpeedKmh`, `IsActive`) VALUES
('51B-420.14', 'Hyundai County 29 chỗ', 29, 45, 1),
('51B-700.10', 'Hyundai County 29 chỗ', 29, 45, 1),
('51B-677.11', 'Thaco Town 29 chỗ', 29, 45, 1),
('51B-863.33', 'Samco Felix 29 chỗ', 29, 45, 1),
('51B-694.98', 'Thaco Town 29 chỗ', 29, 45, 1),
('51B-998.59', 'Thaco Town 29 chỗ', 29, 45, 1),
('51B-234.89', 'Thaco Town 29 chỗ', 29, 45, 1),
('51B-735.64', 'Hyundai County 29 chỗ', 29, 45, 1),
('51B-678.12', 'Toyota Coaster 29 chỗ', 29, 45, 1),
('51B-122.54', 'Thaco Town 29 chỗ', 29, 45, 1),
('51B-582.53', 'Samco Felix 29 chỗ', 29, 45, 1),
('51B-771.98', 'Ford Transit 16 chỗ', 16, 45, 1),
('51B-960.28', 'Thaco Town 29 chỗ', 29, 45, 1),
('51B-953.45', 'Hyundai County 29 chỗ', 29, 45, 1),
('51B-293.79', 'Thaco Town 29 chỗ', 29, 45, 1),
('51B-427.30', 'Thaco Town 29 chỗ', 29, 45, 1),
('51B-946.62', 'Thaco Town 29 chỗ', 29, 45, 1),
('51B-841.47', 'Thaco Town 29 chỗ', 29, 45, 1),
('51B-229.25', 'Ford Transit 16 chỗ', 16, 45, 1),
('51B-699.13', 'Ford Transit 16 chỗ', 16, 45, 1);

-- 2. Drivers & Users (20 records)
-- Drivers and their Users
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__1', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_1');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_1', 'Nguyễn Kim Nhi', 'DL-88861-1-', '0906332966', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__2', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_2');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_2', 'Dương Gia Thảo', 'DL-43789-2-', '0903930239', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__3', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_3');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_3', 'Ngô Kim Việt', 'DL-47389-3-', '0924706259', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__4', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_4');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_4', 'Lê Quốc Quỳnh', 'DL-14000-4-', '0938328997', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__5', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_5');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_5', 'Đỗ Xuân Tuấn', 'DL-68189-5-', '0901031649', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__6', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_6');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_6', 'Bùi Thị Nam', 'DL-34156-6-', '0946674132', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__7', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_7');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_7', 'Dương Đức An', 'DL-75798-7-', '0908421450', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__8', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_8');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_8', 'Phan Thị Vy', 'DL-43801-8-', '0910017166', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__9', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_9');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_9', 'Đỗ Quốc Phượng', 'DL-65987-9-', '0922731089', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__10', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_10');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_10', 'Võ Minh Hùng', 'DL-79101-10-', '0986933920', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__11', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_11');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_11', 'Huỳnh Quốc Trang', 'DL-90917-11-', '0908007495', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__12', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_12');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_12', 'Vũ Minh Giang', 'DL-61856-12-', '0958424503', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__13', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_13');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_13', 'Dương Xuân An', 'DL-20064-13-', '0939919313', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__14', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_14');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_14', 'Lê Quốc Trung', 'DL-65029-14-', '0979414805', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__15', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_15');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_15', 'Dương Đức Vân', 'DL-26658-15-', '0995241132', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__16', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_16');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_16', 'Trần Gia Khánh', 'DL-57071-16-', '0966619959', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__17', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_17');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_17', 'Nguyễn Thị Yến', 'DL-24425-17-', '0959506302', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__18', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_18');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_18', 'Đỗ Hữu Long', 'DL-42388-18-', '0983633363', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__19', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_19');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_19', 'Võ Minh Mai', 'DL-62385-19-', '0947898889', @userId, 1);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('taixe__20', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'driver', 'TX_20');
SET @userId = LAST_INSERT_ID();
INSERT INTO `drivers` (`Id`, `FullName`, `MaBangLai`, `PhoneNumber`, `UserId`, `IsActive`) VALUES ('TX_20', 'Phạm Hữu Minh', 'DL-21268-20-', '0927092174', @userId, 1);

-- 3. Parents & Users (300 records)
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__1', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_1');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_1', 'Võ Xuân Tùng', '0975774404', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__2', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_2');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_2', 'Lý Đức Lan', '0976936529', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__3', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_3');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_3', 'Nguyễn Thanh Hùng', '0981791969', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__4', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_4');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_4', 'Hoàng Mỹ Thảo', '0995830831', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__5', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_5');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_5', 'Ngô Văn Thủy', '0938923309', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__6', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_6');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_6', 'Bùi Minh Lan', '0970762142', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__7', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_7');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_7', 'Hồ Thanh Nam', '0969476730', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__8', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_8');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_8', 'Phạm Mỹ Quang', '0985055575', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__9', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_9');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_9', 'Võ Gia Hùng', '0949586041', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__10', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_10');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_10', 'Phan Mỹ Nam', '0990678322', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__11', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_11');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_11', 'Đặng Kim Linh', '0991816675', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__12', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_12');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_12', 'Ngô Kim Tuấn', '0911433188', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__13', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_13');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_13', 'Hồ Đức Khánh', '0988589614', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__14', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_14');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_14', 'Vũ Kim Hải', '0927731284', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__15', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_15');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_15', 'Hoàng Thị Tùng', '0986854756', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__16', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_16');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_16', 'Ngô Quốc Lan', '0951233225', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__17', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_17');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_17', 'Huỳnh Thanh Huy', '0906493144', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__18', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_18');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_18', 'Hồ Hữu Tuấn', '0927609561', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__19', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_19');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_19', 'Ngô Quốc Quỳnh', '0914170205', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__20', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_20');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_20', 'Huỳnh Minh Trang', '0995637970', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__21', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_21');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_21', 'Bùi Kim Thắng', '0926590697', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__22', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_22');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_22', 'Vũ Văn Lan', '0940499474', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__23', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_23');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_23', 'Đỗ Thanh Lan', '0991091202', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__24', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_24');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_24', 'Trần Minh Huy', '0944907539', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__25', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_25');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_25', 'Phạm Gia Quân', '0919462375', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__26', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_26');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_26', 'Vũ Kim Minh', '0983619988', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__27', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_27');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_27', 'Phan Kim Bình', '0972681558', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__28', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_28');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_28', 'Vũ Đức Sơn', '0953908386', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__29', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_29');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_29', 'Hồ Kim Minh', '0981565297', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__30', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_30');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_30', 'Huỳnh Kim Tuấn', '0990863056', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__31', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_31');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_31', 'Ngô Thu Tùng', '0974245758', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__32', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_32');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_32', 'Phan Minh Tuấn', '0937224419', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__33', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_33');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_33', 'Phạm Thị Thắng', '0928214536', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__34', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_34');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_34', 'Võ Thanh Thảo', '0930544109', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__35', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_35');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_35', 'Phạm Kim Việt', '0922345715', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__36', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_36');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_36', 'Nguyễn Gia Phúc', '0999905189', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__37', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_37');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_37', 'Huỳnh Thanh Nhi', '0972652477', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__38', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_38');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_38', 'Ngô Minh Vy', '0990841808', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__39', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_39');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_39', 'Lý Gia Nga', '0962550223', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__40', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_40');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_40', 'Bùi Hữu Nam', '0919110061', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__41', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_41');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_41', 'Phạm Văn Vy', '0920378753', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__42', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_42');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_42', 'Phạm Văn Uyên', '0938828129', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__43', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_43');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_43', 'Đỗ Kim Lan', '0941820044', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__44', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_44');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_44', 'Đặng Thu Bình', '0946459251', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__45', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_45');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_45', 'Hồ Văn Việt', '0977222480', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__46', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_46');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_46', 'Bùi Kim Hùng', '0989585595', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__47', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_47');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_47', 'Lê Kim Uyên', '0990577478', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__48', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_48');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_48', 'Phạm Văn Việt', '0910097276', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__49', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_49');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_49', 'Ngô Quốc Tùng', '0950142370', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__50', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_50');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_50', 'Đỗ Quốc An', '0999855820', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__51', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_51');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_51', 'Lý Gia Uyên', '0943172756', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__52', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_52');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_52', 'Vũ Thu Quỳnh', '0903755431', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__53', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_53');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_53', 'Hồ Gia Tuấn', '0919588223', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__54', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_54');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_54', 'Nguyễn Đức Quân', '0960303109', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__55', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_55');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_55', 'Hồ Hữu Nam', '0968576438', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__56', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_56');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_56', 'Phạm Thị Phúc', '0971660853', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__57', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_57');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_57', 'Đỗ Đức Trang', '0965330079', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__58', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_58');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_58', 'Bùi Thu Trung', '0977192770', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__59', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_59');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_59', 'Lý Minh Hải', '0940031295', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__60', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_60');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_60', 'Hoàng Thị Nhi', '0984776789', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__61', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_61');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_61', 'Huỳnh Quốc Thảo', '0911210811', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__62', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_62');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_62', 'Nguyễn Hữu Yến', '0920990797', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__63', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_63');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_63', 'Trần Xuân Khánh', '0908797728', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__64', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_64');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_64', 'Phan Thu Lan', '0964355219', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__65', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_65');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_65', 'Phạm Văn Thảo', '0957123484', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__66', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_66');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_66', 'Lý Văn Vy', '0956864505', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__67', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_67');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_67', 'Nguyễn Văn Hải', '0983716785', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__68', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_68');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_68', 'Huỳnh Thu Thắng', '0913405518', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__69', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_69');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_69', 'Nguyễn Thanh Mai', '0973667653', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__70', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_70');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_70', 'Lý Thu Yến', '0987378320', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__71', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_71');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_71', 'Nguyễn Thu Quân', '0953067802', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__72', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_72');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_72', 'Phan Văn Mai', '0927165913', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__73', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_73');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_73', 'Phan Thu Minh', '0989517110', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__74', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_74');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_74', 'Huỳnh Gia Sơn', '0934216966', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__75', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_75');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_75', 'Võ Thị Khánh', '0937431135', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__76', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_76');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_76', 'Dương Quốc Quang', '0965764779', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__77', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_77');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_77', 'Đỗ Thu Yến', '0924014844', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__78', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_78');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_78', 'Vũ Kim Hải', '0901536030', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__79', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_79');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_79', 'Bùi Mỹ Hải', '0930349420', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__80', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_80');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_80', 'Nguyễn Minh Dũng', '0917122054', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__81', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_81');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_81', 'Đỗ Thanh Mai', '0934861007', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__82', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_82');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_82', 'Vũ Gia Khánh', '0900661701', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__83', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_83');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_83', 'Hồ Hữu Huy', '0946882846', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__84', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_84');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_84', 'Hồ Gia Trung', '0951288920', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__85', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_85');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_85', 'Lý Minh Long', '0913581326', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__86', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_86');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_86', 'Đặng Kim Sơn', '0939217619', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__87', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_87');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_87', 'Phạm Đức Hải', '0925500574', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__88', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_88');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_88', 'Phan Mỹ Vân', '0917550578', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__89', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_89');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_89', 'Vũ Văn Bình', '0989120601', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__90', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_90');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_90', 'Ngô Hữu Tuấn', '0920553882', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__91', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_91');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_91', 'Phạm Kim An', '0937647483', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__92', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_92');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_92', 'Hồ Mỹ Mai', '0926049608', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__93', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_93');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_93', 'Bùi Kim Uyên', '0993468030', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__94', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_94');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_94', 'Dương Kim Phúc', '0982366373', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__95', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_95');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_95', 'Đỗ Văn Khánh', '0904766883', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__96', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_96');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_96', 'Lê Thị Việt', '0976130283', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__97', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_97');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_97', 'Dương Minh Quang', '0961132457', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__98', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_98');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_98', 'Đỗ Văn An', '0984851787', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__99', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_99');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_99', 'Phạm Thu Khánh', '0960595313', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__100', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_100');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_100', 'Phan Thị Trung', '0984940996', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__101', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_101');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_101', 'Bùi Minh Trang', '0957852709', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__102', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_102');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_102', 'Lý Minh Dũng', '0978102587', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__103', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_103');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_103', 'Võ Văn Vy', '0910072766', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__104', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_104');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_104', 'Phan Mỹ Quang', '0922534074', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__105', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_105');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_105', 'Bùi Thị Trung', '0922946808', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__106', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_106');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_106', 'Phạm Kim Nam', '0925933143', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__107', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_107');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_107', 'Lê Thị Lan', '0991255447', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__108', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_108');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_108', 'Vũ Đức Việt', '0983343558', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__109', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_109');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_109', 'Phan Thanh Thảo', '0989077294', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__110', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_110');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_110', 'Huỳnh Thu Thủy', '0918317930', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__111', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_111');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_111', 'Đỗ Thanh Yến', '0952320173', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__112', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_112');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_112', 'Võ Hữu Quỳnh', '0959858446', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__113', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_113');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_113', 'Đỗ Hữu Vy', '0981385282', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__114', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_114');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_114', 'Võ Văn Bình', '0924803723', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__115', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_115');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_115', 'Phan Thanh Nam', '0944411806', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__116', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_116');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_116', 'Hồ Văn Linh', '0960995278', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__117', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_117');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_117', 'Đặng Kim Trang', '0990513175', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__118', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_118');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_118', 'Hoàng Văn Nam', '0921149782', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__119', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_119');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_119', 'Ngô Kim Nam', '0958466009', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__120', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_120');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_120', 'Trần Thu Nga', '0906201929', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__121', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_121');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_121', 'Hoàng Xuân Thảo', '0955292403', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__122', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_122');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_122', 'Ngô Văn Trang', '0954094817', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__123', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_123');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_123', 'Ngô Đức Phúc', '0992866077', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__124', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_124');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_124', 'Bùi Thị Việt', '0963921610', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__125', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_125');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_125', 'Hồ Đức Thắng', '0977882351', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__126', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_126');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_126', 'Dương Minh Long', '0912824848', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__127', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_127');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_127', 'Phan Thu Việt', '0905517602', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__128', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_128');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_128', 'Ngô Gia Vy', '0955963954', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__129', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_129');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_129', 'Trần Văn Phúc', '0985776583', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__130', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_130');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_130', 'Huỳnh Văn Long', '0972986589', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__131', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_131');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_131', 'Ngô Văn Lan', '0948958900', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__132', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_132');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_132', 'Dương Hữu Yến', '0906232256', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__133', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_133');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_133', 'Lê Gia Nhi', '0922979003', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__134', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_134');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_134', 'Hồ Hữu Quỳnh', '0985735798', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__135', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_135');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_135', 'Lý Văn Vân', '0914302251', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__136', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_136');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_136', 'Ngô Mỹ Giang', '0913923415', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__137', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_137');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_137', 'Ngô Mỹ Hùng', '0914883190', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__138', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_138');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_138', 'Võ Thị Quỳnh', '0940950893', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__139', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_139');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_139', 'Vũ Quốc Hải', '0905457205', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__140', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_140');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_140', 'Ngô Thu Phúc', '0907318728', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__141', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_141');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_141', 'Trần Thanh Linh', '0997493063', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__142', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_142');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_142', 'Hoàng Văn Dũng', '0991033981', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__143', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_143');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_143', 'Phan Minh Dũng', '0930315833', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__144', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_144');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_144', 'Phan Hữu Việt', '0957625162', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__145', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_145');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_145', 'Đặng Thu Thủy', '0924216466', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__146', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_146');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_146', 'Đặng Xuân Việt', '0920338240', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__147', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_147');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_147', 'Bùi Minh Long', '0929283561', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__148', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_148');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_148', 'Lê Thị Quân', '0961451067', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__149', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_149');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_149', 'Huỳnh Minh Khánh', '0992842589', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__150', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_150');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_150', 'Phan Thị Phượng', '0960465300', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__151', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_151');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_151', 'Dương Xuân Vy', '0934765011', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__152', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_152');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_152', 'Võ Gia Phúc', '0975703388', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__153', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_153');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_153', 'Lê Đức Sơn', '0952365985', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__154', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_154');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_154', 'Phan Minh Vân', '0961802283', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__155', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_155');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_155', 'Ngô Văn Tùng', '0974725978', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__156', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_156');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_156', 'Bùi Gia Trung', '0932235542', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__157', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_157');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_157', 'Phạm Kim Nam', '0923956417', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__158', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_158');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_158', 'Đỗ Kim Tùng', '0955799731', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__159', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_159');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_159', 'Lý Minh Nam', '0940769567', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__160', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_160');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_160', 'Võ Gia Nam', '0932959198', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__161', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_161');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_161', 'Trần Hữu Trung', '0913058918', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__162', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_162');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_162', 'Bùi Mỹ Quỳnh', '0949338870', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__163', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_163');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_163', 'Lý Quốc Vân', '0907608441', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__164', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_164');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_164', 'Ngô Kim Phượng', '0930099134', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__165', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_165');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_165', 'Hồ Xuân Dũng', '0968202928', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__166', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_166');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_166', 'Võ Mỹ Thủy', '0901479747', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__167', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_167');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_167', 'Huỳnh Thị Sơn', '0947915658', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__168', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_168');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_168', 'Đỗ Thanh Sơn', '0962160020', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__169', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_169');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_169', 'Phạm Thị Nam', '0943078841', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__170', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_170');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_170', 'Huỳnh Thanh Quỳnh', '0973951368', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__171', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_171');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_171', 'Vũ Quốc Minh', '0960939733', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__172', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_172');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_172', 'Đặng Kim Thảo', '0934552352', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__173', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_173');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_173', 'Vũ Mỹ Sơn', '0927826004', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__174', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_174');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_174', 'Ngô Quốc Thảo', '0915237238', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__175', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_175');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_175', 'Võ Xuân Trang', '0980204019', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__176', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_176');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_176', 'Phan Thanh Trang', '0957084037', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__177', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_177');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_177', 'Phạm Gia Uyên', '0926003294', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__178', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_178');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_178', 'Nguyễn Thu Trung', '0983345555', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__179', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_179');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_179', 'Phạm Gia Linh', '0907188171', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__180', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_180');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_180', 'Bùi Đức Uyên', '0955411913', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__181', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_181');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_181', 'Vũ Thị Nam', '0901657980', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__182', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_182');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_182', 'Phan Thanh Hải', '0984493216', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__183', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_183');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_183', 'Hoàng Văn Thảo', '0991822866', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__184', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_184');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_184', 'Vũ Minh Yến', '0983387470', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__185', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_185');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_185', 'Trần Văn Huy', '0995180329', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__186', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_186');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_186', 'Huỳnh Văn Dũng', '0955315001', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__187', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_187');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_187', 'Phan Thanh Trung', '0931460116', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__188', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_188');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_188', 'Phan Đức Hải', '0943039049', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__189', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_189');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_189', 'Lý Gia Hùng', '0949158020', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__190', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_190');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_190', 'Bùi Thanh Linh', '0957313603', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__191', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_191');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_191', 'Đặng Kim Lan', '0975839497', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__192', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_192');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_192', 'Bùi Gia Sơn', '0992998106', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__193', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_193');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_193', 'Đỗ Gia Thắng', '0900727480', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__194', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_194');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_194', 'Phạm Mỹ Trang', '0995828911', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__195', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_195');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_195', 'Đỗ Thanh Yến', '0912625594', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__196', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_196');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_196', 'Phan Minh Giang', '0996620427', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__197', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_197');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_197', 'Phan Hữu Mai', '0939003220', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__198', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_198');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_198', 'Bùi Hữu Thảo', '0933184380', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__199', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_199');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_199', 'Vũ Thị Khánh', '0950071702', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__200', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_200');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_200', 'Hồ Minh Quang', '0953045073', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__201', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_201');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_201', 'Vũ Xuân Lan', '0972791744', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__202', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_202');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_202', 'Hồ Gia Minh', '0993013802', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__203', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_203');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_203', 'Đặng Gia Minh', '0996662727', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__204', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_204');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_204', 'Nguyễn Hữu Linh', '0990757034', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__205', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_205');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_205', 'Đỗ Gia Lan', '0985888592', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__206', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_206');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_206', 'Bùi Thanh Nam', '0955076440', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__207', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_207');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_207', 'Lê Gia Khánh', '0979169025', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__208', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_208');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_208', 'Nguyễn Văn Lan', '0976282627', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__209', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_209');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_209', 'Lý Minh Vân', '0950619475', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__210', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_210');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_210', 'Huỳnh Xuân Việt', '0914980412', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__211', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_211');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_211', 'Hoàng Thu Trang', '0903368964', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__212', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_212');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_212', 'Dương Xuân Cường', '0987378229', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__213', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_213');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_213', 'Lê Gia Khánh', '0972445466', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__214', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_214');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_214', 'Dương Đức Yến', '0980171672', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__215', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_215');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_215', 'Vũ Thanh Uyên', '0943960772', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__216', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_216');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_216', 'Phan Văn Vy', '0938655585', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__217', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_217');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_217', 'Vũ Văn Long', '0942158117', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__218', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_218');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_218', 'Võ Quốc Trung', '0903649204', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__219', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_219');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_219', 'Võ Mỹ Tuấn', '0983108932', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__220', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_220');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_220', 'Hoàng Mỹ Tuấn', '0933139861', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__221', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_221');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_221', 'Hồ Xuân Tuấn', '0932939890', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__222', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_222');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_222', 'Đặng Đức Bình', '0943536522', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__223', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_223');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_223', 'Phạm Minh Sơn', '0959106744', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__224', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_224');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_224', 'Hồ Mỹ Nhi', '0919136081', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__225', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_225');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_225', 'Ngô Mỹ Tuấn', '0952075741', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__226', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_226');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_226', 'Huỳnh Hữu Nhi', '0916203095', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__227', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_227');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_227', 'Bùi Kim An', '0981266790', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__228', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_228');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_228', 'Nguyễn Đức Trung', '0982725289', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__229', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_229');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_229', 'Hồ Mỹ Sơn', '0913484073', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__230', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_230');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_230', 'Đỗ Thị Việt', '0928582593', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__231', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_231');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_231', 'Ngô Hữu Vân', '0954736842', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__232', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_232');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_232', 'Nguyễn Kim Quang', '0948273032', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__233', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_233');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_233', 'Võ Gia Cường', '0923692321', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__234', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_234');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_234', 'Vũ Minh Mai', '0984765454', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__235', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_235');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_235', 'Dương Quốc Nhi', '0994647552', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__236', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_236');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_236', 'Vũ Đức Quang', '0920568726', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__237', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_237');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_237', 'Hồ Thanh Thủy', '0924175117', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__238', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_238');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_238', 'Hoàng Mỹ Huy', '0949280736', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__239', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_239');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_239', 'Phan Kim Tùng', '0941432442', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__240', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_240');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_240', 'Vũ Văn Nam', '0995965726', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__241', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_241');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_241', 'Ngô Gia Thắng', '0954435014', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__242', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_242');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_242', 'Đỗ Gia Sơn', '0902077083', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__243', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_243');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_243', 'Lê Thu Long', '0934734497', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__244', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_244');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_244', 'Phan Xuân Tuấn', '0914208807', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__245', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_245');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_245', 'Dương Hữu Long', '0982674276', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__246', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_246');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_246', 'Phạm Văn Cường', '0920629718', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__247', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_247');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_247', 'Hồ Hữu Thủy', '0942061158', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__248', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_248');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_248', 'Vũ Gia Hải', '0997569537', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__249', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_249');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_249', 'Phạm Mỹ Phượng', '0948194639', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__250', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_250');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_250', 'Võ Thanh Trung', '0908405680', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__251', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_251');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_251', 'Đặng Gia Quân', '0961628876', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__252', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_252');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_252', 'Ngô Hữu Sơn', '0955844859', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__253', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_253');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_253', 'Vũ Gia Trung', '0921428730', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__254', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_254');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_254', 'Võ Kim Thủy', '0984201774', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__255', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_255');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_255', 'Vũ Văn Dũng', '0988148796', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__256', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_256');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_256', 'Dương Hữu Phượng', '0950561648', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__257', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_257');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_257', 'Ngô Thị Vân', '0939243681', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__258', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_258');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_258', 'Võ Hữu Minh', '0909907519', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__259', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_259');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_259', 'Bùi Gia Cường', '0991874231', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__260', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_260');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_260', 'Vũ Đức Tùng', '0942248105', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__261', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_261');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_261', 'Dương Văn Bình', '0985789928', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__262', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_262');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_262', 'Đặng Thu Quân', '0938727689', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__263', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_263');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_263', 'Đỗ Gia Dũng', '0936236220', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__264', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_264');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_264', 'Lý Hữu Lan', '0953625543', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__265', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_265');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_265', 'Đỗ Văn Phượng', '0937028679', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__266', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_266');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_266', 'Lê Đức Cường', '0903845363', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__267', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_267');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_267', 'Lý Thu Thắng', '0907189969', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__268', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_268');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_268', 'Đỗ Gia Trung', '0932806579', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__269', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_269');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_269', 'Trần Quốc Quân', '0996641156', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__270', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_270');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_270', 'Huỳnh Thị Giang', '0993238447', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__271', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_271');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_271', 'Vũ Thanh Vy', '0987355928', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__272', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_272');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_272', 'Hồ Mỹ Nhi', '0933869573', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__273', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_273');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_273', 'Hoàng Gia Hùng', '0929382845', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__274', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_274');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_274', 'Dương Thị Thảo', '0956267334', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__275', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_275');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_275', 'Huỳnh Minh Tùng', '0902591728', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__276', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_276');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_276', 'Hồ Mỹ Mai', '0996823122', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__277', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_277');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_277', 'Đỗ Gia Bình', '0945650979', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__278', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_278');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_278', 'Đặng Thanh Vy', '0989575485', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__279', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_279');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_279', 'Lý Thu Thủy', '0967738353', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__280', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_280');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_280', 'Vũ Quốc Thắng', '0984363351', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__281', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_281');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_281', 'Dương Xuân Lan', '0948538600', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__282', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_282');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_282', 'Dương Thanh Giang', '0976178928', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__283', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_283');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_283', 'Đỗ Thanh Khánh', '0981077691', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__284', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_284');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_284', 'Phạm Mỹ Cường', '0922005994', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__285', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_285');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_285', 'Hoàng Văn Tùng', '0902908084', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__286', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_286');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_286', 'Huỳnh Quốc Dũng', '0960480060', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__287', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_287');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_287', 'Lê Minh Thảo', '0943315111', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__288', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_288');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_288', 'Đỗ Hữu Quân', '0936782367', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__289', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_289');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_289', 'Dương Thị Bình', '0951592416', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__290', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_290');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_290', 'Võ Quốc Bình', '0923543031', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__291', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_291');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_291', 'Lý Mỹ Nga', '0983384479', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__292', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_292');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_292', 'Lý Thu Minh', '0977251580', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__293', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_293');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_293', 'Phạm Đức Cường', '0984842939', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__294', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_294');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_294', 'Ngô Văn Sơn', '0933595966', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__295', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_295');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_295', 'Dương Gia An', '0901095948', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__296', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_296');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_296', 'Huỳnh Kim Sơn', '0925651937', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__297', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_297');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_297', 'Huỳnh Xuân Lan', '0920924587', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__298', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_298');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_298', 'Bùi Mỹ Hải', '0907071944', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__299', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_299');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_299', 'Phạm Gia Linh', '0983258680', 1, @userId);
INSERT INTO `users` (`Username`, `Password`, `Role`, `ProfileId`) VALUES ('phuhuynh__300', '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS', 'parent', 'PH_300');
SET @userId = LAST_INSERT_ID();
INSERT INTO `phuhuynh` (`MaPhuHuynh`, `HoTen`, `SoDienThoai`, `Nhanthongbao`, `UserId`) VALUES ('PH_300', 'Dương Hữu Trang', '0922762031', 1, @userId);

-- 4. Students (300 records)
INSERT INTO `hocsinh` (`MaHocSinh`, `HoTen`, `Lop`, `MaPhuHuynh`, `DiaChi`, `Latitude`, `Longitude`, `TrangThaiHocTap`) VALUES
('HS_1', 'Hồ Minh Hùng', '4D1', 'PH_1', '484 Pasteur, Phú Nhuận, TP.HCM', 10.74442427, 106.62295436, 'Đang học'),
('HS_2', 'Hoàng Xuân Tuấn', '5B2', 'PH_2', '944 Nguyễn Huệ, Quận 4, TP.HCM', 10.77546566, 106.68268386, 'Đang học'),
('HS_3', 'Đỗ Mỹ Linh', '2D3', 'PH_3', '893 Lê Duẩn, Phú Nhuận, TP.HCM', 10.73138594, 106.68193511, 'Đang học'),
('HS_4', 'Dương Minh Việt', '5C3', 'PH_4', '860 Cách Mạng Tháng 8, Quận 1, TP.HCM', 10.78434996, 106.61332125, 'Đang học'),
('HS_5', 'Phan Xuân Lan', '2C2', 'PH_5', '448 Trần Hưng Đạo, Bình Thạnh, TP.HCM', 10.76618573, 106.62210104, 'Đang học'),
('HS_6', 'Đỗ Thu Lan', '4D2', 'PH_6', '895 Lê Duẩn, Quận 3, TP.HCM', 10.74588040, 106.65184557, 'Đang học'),
('HS_7', 'Phan Minh Quang', '5C3', 'PH_7', '704 Trần Hưng Đạo, Phú Nhuận, TP.HCM', 10.75775481, 106.62521266, 'Đang học'),
('HS_8', 'Nguyễn Đức Mai', '5C2', 'PH_8', '870 Võ Thị Sáu, Quận 10, TP.HCM', 10.80489845, 106.62727526, 'Đang học'),
('HS_9', 'Phan Văn Nhi', '2C3', 'PH_9', '548 Nguyễn Thị Minh Khai, Quận 1, TP.HCM', 10.80101003, 106.69659595, 'Đang học'),
('HS_10', 'Huỳnh Thanh Nhi', '5A1', 'PH_10', '467 Hai Bà Trưng, Quận 4, TP.HCM', 10.72631259, 106.68178227, 'Đang học'),
('HS_11', 'Phan Hữu Linh', '1D2', 'PH_11', '46 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM', 10.77232175, 106.69219771, 'Đang học'),
('HS_12', 'Phan Thanh Lan', '3D1', 'PH_12', '614 Nam Kỳ Khởi Nghĩa, Phú Nhuận, TP.HCM', 10.78330032, 106.70242173, 'Đang học'),
('HS_13', 'Ngô Thị Vy', '2C3', 'PH_13', '919 Cách Mạng Tháng 8, Phú Nhuận, TP.HCM', 10.77338995, 106.63910444, 'Đang học'),
('HS_14', 'Ngô Gia Vy', '2D1', 'PH_14', '18 Võ Thị Sáu, Quận 1, TP.HCM', 10.72935857, 106.65305966, 'Đang học'),
('HS_15', 'Nguyễn Văn Dũng', '5C1', 'PH_15', '318 Cách Mạng Tháng 8, Quận 3, TP.HCM', 10.74323343, 106.67099050, 'Đang học'),
('HS_16', 'Lê Quốc Phượng', '5D3', 'PH_16', '171 Cách Mạng Tháng 8, Bình Thạnh, TP.HCM', 10.73591877, 106.63900322, 'Đang học'),
('HS_17', 'Hồ Đức Thắng', '2A2', 'PH_17', '320 Đồng Khởi, Quận 3, TP.HCM', 10.78576353, 106.67795411, 'Đang học'),
('HS_18', 'Lê Mỹ Huy', '3B3', 'PH_18', '340 Nam Kỳ Khởi Nghĩa, Quận 5, TP.HCM', 10.80718333, 106.69324441, 'Đang học'),
('HS_19', 'Bùi Quốc Vy', '2C1', 'PH_19', '610 Nguyễn Trãi, Quận 4, TP.HCM', 10.76119935, 106.61054879, 'Đang học'),
('HS_20', 'Phạm Xuân Dũng', '5C3', 'PH_20', '850 Cách Mạng Tháng 8, Quận 10, TP.HCM', 10.73847335, 106.63545520, 'Đang học'),
('HS_21', 'Võ Quốc Trung', '5B2', 'PH_21', '527 Hai Bà Trưng, Quận 1, TP.HCM', 10.77662019, 106.66349322, 'Đang học'),
('HS_22', 'Vũ Đức Long', '4D3', 'PH_22', '264 Nguyễn Huệ, Phú Nhuận, TP.HCM', 10.78047688, 106.63446220, 'Đang học'),
('HS_23', 'Võ Đức Trung', '2A2', 'PH_23', '850 Pasteur, Quận 4, TP.HCM', 10.73398206, 106.61457006, 'Đang học'),
('HS_24', 'Hồ Thị Thủy', '3D2', 'PH_24', '511 Hai Bà Trưng, Quận 10, TP.HCM', 10.80746171, 106.68993957, 'Đang học'),
('HS_25', 'Bùi Thu Uyên', '3C2', 'PH_25', '34 Hai Bà Trưng, Quận 4, TP.HCM', 10.71969687, 106.65821299, 'Đang học'),
('HS_26', 'Vũ Xuân Huy', '4B2', 'PH_26', '775 Lý Tự Trọng, Quận 5, TP.HCM', 10.76251294, 106.69725280, 'Đang học'),
('HS_27', 'Dương Mỹ Quỳnh', '2A2', 'PH_27', '439 Nam Kỳ Khởi Nghĩa, Quận 10, TP.HCM', 10.75348958, 106.63707557, 'Đang học'),
('HS_28', 'Đặng Quốc Linh', '2C3', 'PH_28', '815 Cách Mạng Tháng 8, Quận 5, TP.HCM', 10.74723256, 106.64385501, 'Đang học'),
('HS_29', 'Đặng Đức Long', '1B2', 'PH_29', '338 Hai Bà Trưng, Quận 3, TP.HCM', 10.72706226, 106.65871510, 'Đang học'),
('HS_30', 'Đặng Đức Việt', '5B3', 'PH_30', '148 Nguyễn Thị Minh Khai, Quận 4, TP.HCM', 10.73019104, 106.62511563, 'Đang học'),
('HS_31', 'Đỗ Thu Thảo', '1B2', 'PH_31', '475 Hai Bà Trưng, Quận 5, TP.HCM', 10.78938208, 106.69516450, 'Đang học'),
('HS_32', 'Bùi Gia Trung', '5D2', 'PH_32', '930 Tôn Đức Thắng, Quận 4, TP.HCM', 10.76493390, 106.68799801, 'Đang học'),
('HS_33', 'Đặng Xuân Sơn', '4A2', 'PH_33', '178 Nguyễn Trãi, Quận 4, TP.HCM', 10.74692568, 106.63165570, 'Đang học'),
('HS_34', 'Huỳnh Xuân Cường', '5C2', 'PH_34', '640 Lê Lợi, Quận 5, TP.HCM', 10.72693574, 106.69593086, 'Đang học'),
('HS_35', 'Lý Minh An', '2B2', 'PH_35', '177 Nguyễn Trãi, Quận 4, TP.HCM', 10.79492920, 106.68315505, 'Đang học'),
('HS_36', 'Hoàng Đức Vân', '3A3', 'PH_36', '819 Đồng Khởi, Bình Thạnh, TP.HCM', 10.77739372, 106.67705090, 'Đang học'),
('HS_37', 'Đặng Minh Nhi', '4A3', 'PH_37', '845 Điện Biên Phủ, Quận 4, TP.HCM', 10.77028711, 106.61844861, 'Đang học'),
('HS_38', 'Lý Quốc Vân', '2A1', 'PH_38', '535 Nguyễn Thị Minh Khai, Quận 10, TP.HCM', 10.72563831, 106.64907828, 'Đang học'),
('HS_39', 'Trần Thu Sơn', '5D3', 'PH_39', '626 Trần Hưng Đạo, Quận 4, TP.HCM', 10.74287196, 106.64370154, 'Đang học'),
('HS_40', 'Huỳnh Văn Dũng', '1A1', 'PH_40', '71 Hai Bà Trưng, Quận 10, TP.HCM', 10.78843236, 106.64680032, 'Đang học'),
('HS_41', 'Đỗ Gia Trang', '1D1', 'PH_41', '453 Cách Mạng Tháng 8, Quận 3, TP.HCM', 10.73569993, 106.66452831, 'Đang học'),
('HS_42', 'Lý Kim Quang', '3B1', 'PH_42', '660 Hai Bà Trưng, Quận 4, TP.HCM', 10.73559860, 106.62379598, 'Đang học'),
('HS_43', 'Phạm Quốc Minh', '5B3', 'PH_43', '885 Nguyễn Trãi, Quận 3, TP.HCM', 10.75901282, 106.64275086, 'Đang học'),
('HS_44', 'Hồ Minh Giang', '2C2', 'PH_44', '206 Lê Duẩn, Quận 1, TP.HCM', 10.79465622, 106.63451624, 'Đang học'),
('HS_45', 'Trần Thanh Quỳnh', '5B1', 'PH_45', '803 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 10.77381207, 106.63308015, 'Đang học'),
('HS_46', 'Lê Kim Phượng', '3D3', 'PH_46', '105 Nam Kỳ Khởi Nghĩa, Bình Thạnh, TP.HCM', 10.78470888, 106.65276333, 'Đang học'),
('HS_47', 'Ngô Xuân Trang', '1C3', 'PH_47', '421 Trần Hưng Đạo, Quận 3, TP.HCM', 10.77466646, 106.61074347, 'Đang học'),
('HS_48', 'Phan Quốc An', '5C1', 'PH_48', '473 Pasteur, Quận 10, TP.HCM', 10.72018652, 106.62550558, 'Đang học'),
('HS_49', 'Bùi Hữu Long', '3C2', 'PH_49', '571 Nam Kỳ Khởi Nghĩa, Quận 4, TP.HCM', 10.79232365, 106.65874584, 'Đang học'),
('HS_50', 'Hoàng Thu Yến', '4D2', 'PH_50', '227 Nguyễn Trãi, Quận 4, TP.HCM', 10.81188961, 106.66668034, 'Đang học'),
('HS_51', 'Bùi Minh Giang', '2A1', 'PH_51', '904 Nguyễn Huệ, Quận 1, TP.HCM', 10.75707225, 106.68294009, 'Đang học'),
('HS_52', 'Dương Gia Mai', '1C2', 'PH_52', '840 Nguyễn Thị Minh Khai, Bình Thạnh, TP.HCM', 10.78464348, 106.62214716, 'Đang học'),
('HS_53', 'Phan Hữu Quỳnh', '1D2', 'PH_53', '551 Điện Biên Phủ, Quận 10, TP.HCM', 10.81168998, 106.69961149, 'Đang học'),
('HS_54', 'Đặng Thanh Hải', '4B3', 'PH_54', '113 Điện Biên Phủ, Bình Thạnh, TP.HCM', 10.78626806, 106.61115436, 'Đang học'),
('HS_55', 'Lê Thị Huy', '5C3', 'PH_55', '252 Lý Tự Trọng, Phú Nhuận, TP.HCM', 10.74831596, 106.69943207, 'Đang học'),
('HS_56', 'Vũ Hữu Hùng', '1B1', 'PH_56', '551 Nguyễn Huệ, Quận 4, TP.HCM', 10.79344982, 106.62008735, 'Đang học'),
('HS_57', 'Phạm Gia Thảo', '4B3', 'PH_57', '936 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM', 10.72556227, 106.71011847, 'Đang học'),
('HS_58', 'Trần Minh Minh', '5D2', 'PH_58', '746 Hai Bà Trưng, Quận 10, TP.HCM', 10.75542363, 106.70708022, 'Đang học'),
('HS_59', 'Vũ Quốc Quang', '1D2', 'PH_59', '78 Điện Biên Phủ, Bình Thạnh, TP.HCM', 10.75328544, 106.64439335, 'Đang học'),
('HS_60', 'Vũ Hữu Dũng', '3D2', 'PH_60', '989 Nam Kỳ Khởi Nghĩa, Quận 10, TP.HCM', 10.71853171, 106.68048794, 'Đang học'),
('HS_61', 'Lý Thị Trang', '4B2', 'PH_61', '105 Hai Bà Trưng, Quận 3, TP.HCM', 10.75190085, 106.64754179, 'Đang học'),
('HS_62', 'Hoàng Văn Long', '5A1', 'PH_62', '973 Đồng Khởi, Quận 1, TP.HCM', 10.77288116, 106.63691900, 'Đang học'),
('HS_63', 'Huỳnh Gia Nhi', '2B2', 'PH_63', '362 Lê Duẩn, Quận 4, TP.HCM', 10.79871452, 106.69660350, 'Đang học'),
('HS_64', 'Nguyễn Thu Trung', '5D1', 'PH_64', '399 Tôn Đức Thắng, Phú Nhuận, TP.HCM', 10.71437497, 106.61771405, 'Đang học'),
('HS_65', 'Hoàng Thu Quỳnh', '4A3', 'PH_65', '360 Nguyễn Thị Minh Khai, Quận 5, TP.HCM', 10.73808047, 106.68594890, 'Đang học'),
('HS_66', 'Lý Thu Yến', '1A3', 'PH_66', '407 Lý Tự Trọng, Quận 1, TP.HCM', 10.76392379, 106.68480119, 'Đang học'),
('HS_67', 'Đặng Văn Mai', '3A1', 'PH_67', '520 Hai Bà Trưng, Bình Thạnh, TP.HCM', 10.76643890, 106.64025196, 'Đang học'),
('HS_68', 'Vũ Xuân Yến', '4A2', 'PH_68', '101 Cách Mạng Tháng 8, Quận 3, TP.HCM', 10.71681881, 106.66779923, 'Đang học'),
('HS_69', 'Dương Hữu Thắng', '1B1', 'PH_69', '778 Nguyễn Huệ, Quận 1, TP.HCM', 10.77785838, 106.67005433, 'Đang học'),
('HS_70', 'Hồ Hữu Yến', '4B1', 'PH_70', '436 Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM', 10.80696782, 106.63068082, 'Đang học'),
('HS_71', 'Phạm Minh Phượng', '3C2', 'PH_71', '135 Nguyễn Huệ, Quận 3, TP.HCM', 10.73880283, 106.67274708, 'Đang học'),
('HS_72', 'Lý Xuân Nga', '1B1', 'PH_72', '477 Pasteur, Bình Thạnh, TP.HCM', 10.74579129, 106.70811496, 'Đang học'),
('HS_73', 'Ngô Gia Quang', '3B1', 'PH_73', '480 Nguyễn Thị Minh Khai, Bình Thạnh, TP.HCM', 10.72927357, 106.70793335, 'Đang học'),
('HS_74', 'Đỗ Thị Dũng', '3A3', 'PH_74', '30 Hai Bà Trưng, Quận 4, TP.HCM', 10.77773551, 106.61831883, 'Đang học'),
('HS_75', 'Đỗ Minh Quân', '2A3', 'PH_75', '779 Nguyễn Huệ, Quận 10, TP.HCM', 10.80140610, 106.68082965, 'Đang học'),
('HS_76', 'Võ Đức Khánh', '5C2', 'PH_76', '958 Pasteur, Quận 4, TP.HCM', 10.78656634, 106.67011150, 'Đang học'),
('HS_77', 'Ngô Minh Giang', '1B2', 'PH_77', '744 Nguyễn Thị Minh Khai, Quận 10, TP.HCM', 10.79542251, 106.69112163, 'Đang học'),
('HS_78', 'Lê Văn Vy', '3B1', 'PH_78', '493 Nguyễn Huệ, Bình Thạnh, TP.HCM', 10.80547125, 106.69417764, 'Đang học'),
('HS_79', 'Đỗ Đức Phượng', '1B1', 'PH_79', '937 Lê Lợi, Quận 5, TP.HCM', 10.73018977, 106.64128750, 'Đang học'),
('HS_80', 'Võ Thị An', '4A3', 'PH_80', '297 Cách Mạng Tháng 8, Bình Thạnh, TP.HCM', 10.75461106, 106.70935039, 'Đang học'),
('HS_81', 'Lý Kim Giang', '5C1', 'PH_81', '63 Lê Lợi, Quận 5, TP.HCM', 10.73250905, 106.70914394, 'Đang học'),
('HS_82', 'Nguyễn Thu Bình', '2B1', 'PH_82', '843 Trần Hưng Đạo, Phú Nhuận, TP.HCM', 10.80724246, 106.65728917, 'Đang học'),
('HS_83', 'Phan Hữu Yến', '5A2', 'PH_83', '859 Nam Kỳ Khởi Nghĩa, Bình Thạnh, TP.HCM', 10.75196632, 106.61407980, 'Đang học'),
('HS_84', 'Nguyễn Gia Long', '1A2', 'PH_84', '628 Điện Biên Phủ, Quận 3, TP.HCM', 10.80278596, 106.62046052, 'Đang học'),
('HS_85', 'Huỳnh Văn Yến', '4B1', 'PH_85', '578 Pasteur, Phú Nhuận, TP.HCM', 10.78724224, 106.62116963, 'Đang học'),
('HS_86', 'Vũ Thanh Lan', '1C1', 'PH_86', '105 Lý Tự Trọng, Quận 4, TP.HCM', 10.77942762, 106.62850285, 'Đang học'),
('HS_87', 'Trần Xuân Việt', '5B1', 'PH_87', '42 Cách Mạng Tháng 8, Phú Nhuận, TP.HCM', 10.80769539, 106.67332338, 'Đang học'),
('HS_88', 'Phan Văn Phúc', '4A1', 'PH_88', '632 Nguyễn Thị Minh Khai, Bình Thạnh, TP.HCM', 10.74042887, 106.69272715, 'Đang học'),
('HS_89', 'Hoàng Thanh Long', '4D1', 'PH_89', '630 Cách Mạng Tháng 8, Bình Thạnh, TP.HCM', 10.75864653, 106.68784630, 'Đang học'),
('HS_90', 'Đỗ Văn Yến', '1C2', 'PH_90', '164 Trần Hưng Đạo, Quận 5, TP.HCM', 10.73073008, 106.66487625, 'Đang học'),
('HS_91', 'Dương Kim Thủy', '3C1', 'PH_91', '471 Lý Tự Trọng, Bình Thạnh, TP.HCM', 10.77336718, 106.67710288, 'Đang học'),
('HS_92', 'Hoàng Thanh Trang', '3B1', 'PH_92', '867 Nam Kỳ Khởi Nghĩa, Quận 10, TP.HCM', 10.75528627, 106.65311154, 'Đang học'),
('HS_93', 'Vũ Kim Quỳnh', '5D2', 'PH_93', '669 Võ Thị Sáu, Phú Nhuận, TP.HCM', 10.72137304, 106.69695296, 'Đang học'),
('HS_94', 'Vũ Hữu Thảo', '4B1', 'PH_94', '77 Điện Biên Phủ, Quận 5, TP.HCM', 10.72708796, 106.64564458, 'Đang học'),
('HS_95', 'Phan Thanh Trang', '4C3', 'PH_95', '957 Hai Bà Trưng, Quận 5, TP.HCM', 10.78183633, 106.67353977, 'Đang học'),
('HS_96', 'Lý Thanh Tuấn', '2B3', 'PH_96', '39 Cách Mạng Tháng 8, Quận 10, TP.HCM', 10.79955291, 106.67110894, 'Đang học'),
('HS_97', 'Bùi Thị Trung', '2A2', 'PH_97', '803 Điện Biên Phủ, Bình Thạnh, TP.HCM', 10.77293887, 106.62138531, 'Đang học'),
('HS_98', 'Dương Kim Nhi', '2A3', 'PH_98', '902 Lê Lợi, Quận 3, TP.HCM', 10.73864023, 106.70644358, 'Đang học'),
('HS_99', 'Hoàng Minh Thắng', '1D1', 'PH_99', '28 Điện Biên Phủ, Phú Nhuận, TP.HCM', 10.80911905, 106.68634353, 'Đang học'),
('HS_100', 'Lê Minh Thắng', '5B2', 'PH_100', '713 Điện Biên Phủ, Quận 1, TP.HCM', 10.80256797, 106.69654150, 'Đang học'),
('HS_101', 'Lý Thanh Vy', '3B3', 'PH_101', '291 Pasteur, Quận 10, TP.HCM', 10.78835787, 106.67842059, 'Đang học'),
('HS_102', 'Ngô Đức Huy', '2A2', 'PH_102', '625 Cách Mạng Tháng 8, Quận 5, TP.HCM', 10.73200986, 106.66216702, 'Đang học'),
('HS_103', 'Hoàng Xuân Cường', '4C3', 'PH_103', '71 Hai Bà Trưng, Bình Thạnh, TP.HCM', 10.78967286, 106.65388699, 'Đang học'),
('HS_104', 'Hoàng Kim Linh', '4A3', 'PH_104', '908 Lê Duẩn, Quận 3, TP.HCM', 10.74586763, 106.63356514, 'Đang học'),
('HS_105', 'Ngô Thanh Quang', '3C1', 'PH_105', '487 Nguyễn Trãi, Quận 1, TP.HCM', 10.79007174, 106.69915704, 'Đang học'),
('HS_106', 'Lý Quốc Long', '3C2', 'PH_106', '143 Cách Mạng Tháng 8, Quận 4, TP.HCM', 10.71846862, 106.61882613, 'Đang học'),
('HS_107', 'Bùi Mỹ Lan', '4A2', 'PH_107', '814 Nguyễn Thị Minh Khai, Bình Thạnh, TP.HCM', 10.74741193, 106.66390691, 'Đang học'),
('HS_108', 'Lý Mỹ Nam', '3A1', 'PH_108', '138 Đồng Khởi, Quận 4, TP.HCM', 10.77477523, 106.70307764, 'Đang học'),
('HS_109', 'Ngô Đức Trang', '3A3', 'PH_109', '2 Lê Lợi, Quận 1, TP.HCM', 10.72262126, 106.68253009, 'Đang học'),
('HS_110', 'Lê Thanh Trung', '5A3', 'PH_110', '573 Lê Lợi, Bình Thạnh, TP.HCM', 10.80961681, 106.62413507, 'Đang học'),
('HS_111', 'Đỗ Hữu Việt', '4A1', 'PH_111', '281 Lê Duẩn, Quận 4, TP.HCM', 10.71963253, 106.63857434, 'Đang học'),
('HS_112', 'Đặng Gia Việt', '4A1', 'PH_112', '419 Nam Kỳ Khởi Nghĩa, Quận 5, TP.HCM', 10.76818078, 106.65338867, 'Đang học'),
('HS_113', 'Lý Thị Khánh', '2C1', 'PH_113', '644 Tôn Đức Thắng, Bình Thạnh, TP.HCM', 10.77134554, 106.67075980, 'Đang học'),
('HS_114', 'Lý Đức Mai', '5B1', 'PH_114', '556 Lê Duẩn, Quận 3, TP.HCM', 10.79985432, 106.69773224, 'Đang học'),
('HS_115', 'Đỗ Quốc Việt', '4A3', 'PH_115', '990 Lý Tự Trọng, Quận 3, TP.HCM', 10.77561721, 106.64547314, 'Đang học'),
('HS_116', 'Đặng Văn Tuấn', '3B3', 'PH_116', '799 Lê Duẩn, Phú Nhuận, TP.HCM', 10.80338486, 106.64111648, 'Đang học'),
('HS_117', 'Huỳnh Hữu Cường', '1C1', 'PH_117', '749 Nguyễn Thị Minh Khai, Quận 1, TP.HCM', 10.75603521, 106.61375687, 'Đang học'),
('HS_118', 'Phan Minh Phúc', '2C3', 'PH_118', '373 Điện Biên Phủ, Quận 4, TP.HCM', 10.75694181, 106.64688042, 'Đang học'),
('HS_119', 'Võ Gia Tuấn', '4A1', 'PH_119', '790 Tôn Đức Thắng, Bình Thạnh, TP.HCM', 10.71495049, 106.67902764, 'Đang học'),
('HS_120', 'Lý Quốc Thảo', '5D1', 'PH_120', '352 Đồng Khởi, Quận 4, TP.HCM', 10.80983924, 106.65731016, 'Đang học'),
('HS_121', 'Lý Đức Yến', '3C3', 'PH_121', '387 Võ Thị Sáu, Quận 4, TP.HCM', 10.74064700, 106.61642302, 'Đang học'),
('HS_122', 'Võ Gia Việt', '3D3', 'PH_122', '638 Pasteur, Quận 1, TP.HCM', 10.73770769, 106.68006032, 'Đang học'),
('HS_123', 'Hoàng Xuân Uyên', '3A2', 'PH_123', '919 Pasteur, Quận 1, TP.HCM', 10.71453591, 106.63885041, 'Đang học'),
('HS_124', 'Bùi Gia Yến', '4D3', 'PH_124', '587 Hai Bà Trưng, Quận 3, TP.HCM', 10.78965915, 106.66944320, 'Đang học'),
('HS_125', 'Hoàng Kim Thắng', '2B1', 'PH_125', '791 Nguyễn Trãi, Quận 3, TP.HCM', 10.75447053, 106.64143132, 'Đang học'),
('HS_126', 'Huỳnh Minh Lan', '5D2', 'PH_126', '557 Điện Biên Phủ, Quận 3, TP.HCM', 10.74448663, 106.68950094, 'Đang học'),
('HS_127', 'Huỳnh Kim Bình', '4C1', 'PH_127', '854 Cách Mạng Tháng 8, Quận 1, TP.HCM', 10.72991906, 106.70130276, 'Đang học'),
('HS_128', 'Vũ Mỹ Minh', '5C1', 'PH_128', '326 Nam Kỳ Khởi Nghĩa, Quận 5, TP.HCM', 10.71680947, 106.68469295, 'Đang học'),
('HS_129', 'Hoàng Xuân Giang', '5B2', 'PH_129', '302 Lê Duẩn, Quận 3, TP.HCM', 10.75856561, 106.67787154, 'Đang học'),
('HS_130', 'Nguyễn Thị Linh', '3D2', 'PH_130', '336 Lý Tự Trọng, Quận 1, TP.HCM', 10.79357046, 106.69968042, 'Đang học'),
('HS_131', 'Đỗ Hữu Khánh', '2A3', 'PH_131', '514 Nguyễn Huệ, Phú Nhuận, TP.HCM', 10.73787263, 106.69908182, 'Đang học'),
('HS_132', 'Dương Hữu Quân', '2D3', 'PH_132', '598 Lý Tự Trọng, Quận 1, TP.HCM', 10.80996310, 106.62128985, 'Đang học'),
('HS_133', 'Vũ Kim Nam', '3C1', 'PH_133', '805 Cách Mạng Tháng 8, Quận 5, TP.HCM', 10.73255503, 106.70359257, 'Đang học'),
('HS_134', 'Dương Thị Quang', '5B3', 'PH_134', '300 Lê Duẩn, Bình Thạnh, TP.HCM', 10.78941274, 106.64706720, 'Đang học'),
('HS_135', 'Hồ Thu Trung', '2A3', 'PH_135', '401 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 10.79416938, 106.62826627, 'Đang học'),
('HS_136', 'Hoàng Gia Cường', '3B1', 'PH_136', '370 Nguyễn Thị Minh Khai, Quận 5, TP.HCM', 10.77960862, 106.63261523, 'Đang học'),
('HS_137', 'Ngô Xuân Mai', '1C2', 'PH_137', '743 Đồng Khởi, Quận 5, TP.HCM', 10.75411819, 106.65575460, 'Đang học'),
('HS_138', 'Bùi Minh Khánh', '5B3', 'PH_138', '250 Nguyễn Huệ, Quận 10, TP.HCM', 10.71838225, 106.62229267, 'Đang học'),
('HS_139', 'Trần Quốc Nga', '1A1', 'PH_139', '115 Nguyễn Trãi, Bình Thạnh, TP.HCM', 10.76090165, 106.67945808, 'Đang học'),
('HS_140', 'Phan Minh Giang', '4D2', 'PH_140', '182 Cách Mạng Tháng 8, Phú Nhuận, TP.HCM', 10.74569945, 106.69020593, 'Đang học'),
('HS_141', 'Hoàng Thu Quang', '4C3', 'PH_141', '943 Pasteur, Bình Thạnh, TP.HCM', 10.72224479, 106.61678431, 'Đang học'),
('HS_142', 'Huỳnh Thu Sơn', '4B1', 'PH_142', '733 Nguyễn Thị Minh Khai, Bình Thạnh, TP.HCM', 10.78277930, 106.67511067, 'Đang học'),
('HS_143', 'Bùi Gia Dũng', '4B2', 'PH_143', '472 Cách Mạng Tháng 8, Quận 3, TP.HCM', 10.80367766, 106.68000060, 'Đang học'),
('HS_144', 'Lý Văn Thắng', '2B1', 'PH_144', '934 Hai Bà Trưng, Quận 4, TP.HCM', 10.79734617, 106.68727108, 'Đang học'),
('HS_145', 'Đặng Xuân An', '5A3', 'PH_145', '948 Cách Mạng Tháng 8, Quận 1, TP.HCM', 10.78884309, 106.69878234, 'Đang học'),
('HS_146', 'Huỳnh Thanh Nga', '2A2', 'PH_146', '517 Nguyễn Huệ, Bình Thạnh, TP.HCM', 10.74929915, 106.66543902, 'Đang học'),
('HS_147', 'Đặng Kim Long', '4A3', 'PH_147', '614 Cách Mạng Tháng 8, Quận 1, TP.HCM', 10.74059970, 106.66163544, 'Đang học'),
('HS_148', 'Hoàng Văn Trung', '2B1', 'PH_148', '201 Cách Mạng Tháng 8, Quận 10, TP.HCM', 10.79170417, 106.64498991, 'Đang học'),
('HS_149', 'Hoàng Minh Nga', '1C3', 'PH_149', '298 Hai Bà Trưng, Quận 3, TP.HCM', 10.76870210, 106.70558803, 'Đang học'),
('HS_150', 'Bùi Thanh Hùng', '4C3', 'PH_150', '508 Nam Kỳ Khởi Nghĩa, Phú Nhuận, TP.HCM', 10.74805309, 106.65552833, 'Đang học'),
('HS_151', 'Nguyễn Hữu Bình', '4D1', 'PH_151', '833 Hai Bà Trưng, Quận 5, TP.HCM', 10.79270174, 106.69839959, 'Đang học'),
('HS_152', 'Lý Quốc Khánh', '4A1', 'PH_152', '682 Tôn Đức Thắng, Phú Nhuận, TP.HCM', 10.78476102, 106.63071034, 'Đang học'),
('HS_153', 'Nguyễn Thị Quang', '1B3', 'PH_153', '643 Cách Mạng Tháng 8, Quận 1, TP.HCM', 10.74820728, 106.70670051, 'Đang học'),
('HS_154', 'Nguyễn Văn Mai', '2B2', 'PH_154', '21 Võ Thị Sáu, Quận 3, TP.HCM', 10.71867088, 106.69068316, 'Đang học'),
('HS_155', 'Võ Đức Cường', '1D1', 'PH_155', '481 Lê Duẩn, Quận 4, TP.HCM', 10.76772358, 106.70524756, 'Đang học'),
('HS_156', 'Võ Xuân Thắng', '3D2', 'PH_156', '147 Nguyễn Thị Minh Khai, Bình Thạnh, TP.HCM', 10.73589600, 106.68414235, 'Đang học'),
('HS_157', 'Nguyễn Hữu Phượng', '4D2', 'PH_157', '620 Hai Bà Trưng, Quận 10, TP.HCM', 10.80426791, 106.64201019, 'Đang học'),
('HS_158', 'Đặng Thu Trung', '3A1', 'PH_158', '382 Hai Bà Trưng, Quận 4, TP.HCM', 10.80848714, 106.61196177, 'Đang học'),
('HS_159', 'Lý Xuân Dũng', '3D3', 'PH_159', '681 Lê Lợi, Quận 10, TP.HCM', 10.73432005, 106.61586263, 'Đang học'),
('HS_160', 'Võ Thu Minh', '4C3', 'PH_160', '471 Lê Duẩn, Quận 10, TP.HCM', 10.71556077, 106.64983059, 'Đang học'),
('HS_161', 'Nguyễn Mỹ Quân', '1B2', 'PH_161', '879 Nguyễn Thị Minh Khai, Quận 4, TP.HCM', 10.77059660, 106.65718237, 'Đang học'),
('HS_162', 'Võ Minh Vân', '1A3', 'PH_162', '838 Võ Thị Sáu, Phú Nhuận, TP.HCM', 10.74896122, 106.67142507, 'Đang học'),
('HS_163', 'Đỗ Mỹ Linh', '3D3', 'PH_163', '698 Lê Lợi, Phú Nhuận, TP.HCM', 10.79156543, 106.68164766, 'Đang học'),
('HS_164', 'Võ Hữu Huy', '2B1', 'PH_164', '502 Hai Bà Trưng, Quận 1, TP.HCM', 10.72062152, 106.65376340, 'Đang học'),
('HS_165', 'Nguyễn Thanh Nhi', '1A3', 'PH_165', '598 Nguyễn Huệ, Phú Nhuận, TP.HCM', 10.71299507, 106.61523516, 'Đang học'),
('HS_166', 'Lê Mỹ Long', '4B3', 'PH_166', '320 Nguyễn Trãi, Quận 3, TP.HCM', 10.73612177, 106.68908332, 'Đang học'),
('HS_167', 'Phan Thanh Giang', '3D2', 'PH_167', '479 Võ Thị Sáu, Bình Thạnh, TP.HCM', 10.78573979, 106.66025711, 'Đang học'),
('HS_168', 'Võ Hữu Tùng', '2A3', 'PH_168', '609 Đồng Khởi, Quận 1, TP.HCM', 10.81169918, 106.65679595, 'Đang học'),
('HS_169', 'Nguyễn Quốc Nhi', '2B1', 'PH_169', '983 Điện Biên Phủ, Quận 5, TP.HCM', 10.78161098, 106.70284771, 'Đang học'),
('HS_170', 'Phạm Xuân Quang', '2C2', 'PH_170', '248 Đồng Khởi, Quận 10, TP.HCM', 10.78900071, 106.63355150, 'Đang học'),
('HS_171', 'Trần Thanh Bình', '1C2', 'PH_171', '987 Lý Tự Trọng, Quận 1, TP.HCM', 10.80638015, 106.65271296, 'Đang học'),
('HS_172', 'Bùi Thu Minh', '5A1', 'PH_172', '535 Trần Hưng Đạo, Quận 4, TP.HCM', 10.75652982, 106.61232734, 'Đang học'),
('HS_173', 'Ngô Thị Vy', '2C1', 'PH_173', '394 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM', 10.72088514, 106.62053680, 'Đang học'),
('HS_174', 'Đỗ Văn Phượng', '4D2', 'PH_174', '623 Nguyễn Thị Minh Khai, Quận 4, TP.HCM', 10.71528980, 106.66629835, 'Đang học'),
('HS_175', 'Trần Kim Long', '1C3', 'PH_175', '319 Nguyễn Huệ, Quận 4, TP.HCM', 10.79576474, 106.65580959, 'Đang học'),
('HS_176', 'Lý Thị Khánh', '5C2', 'PH_176', '244 Điện Biên Phủ, Quận 5, TP.HCM', 10.80970158, 106.66412258, 'Đang học'),
('HS_177', 'Đỗ Quốc Quang', '2C1', 'PH_177', '213 Nguyễn Trãi, Quận 5, TP.HCM', 10.74136798, 106.66203877, 'Đang học'),
('HS_178', 'Phan Mỹ Vy', '4A2', 'PH_178', '646 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM', 10.72681088, 106.66123742, 'Đang học'),
('HS_179', 'Trần Kim Lan', '2B1', 'PH_179', '649 Hai Bà Trưng, Quận 4, TP.HCM', 10.71702157, 106.62314769, 'Đang học'),
('HS_180', 'Lê Quốc Quân', '5A2', 'PH_180', '217 Nam Kỳ Khởi Nghĩa, Bình Thạnh, TP.HCM', 10.71732863, 106.61499695, 'Đang học'),
('HS_181', 'Nguyễn Mỹ An', '1B1', 'PH_181', '807 Đồng Khởi, Phú Nhuận, TP.HCM', 10.72370241, 106.69479622, 'Đang học'),
('HS_182', 'Lê Minh Vân', '2C1', 'PH_182', '144 Lý Tự Trọng, Bình Thạnh, TP.HCM', 10.72052414, 106.62346330, 'Đang học'),
('HS_183', 'Phạm Quốc Việt', '2B1', 'PH_183', '99 Võ Thị Sáu, Bình Thạnh, TP.HCM', 10.78921898, 106.70969035, 'Đang học'),
('HS_184', 'Phan Thị Long', '2D2', 'PH_184', '227 Nguyễn Trãi, Quận 3, TP.HCM', 10.77249961, 106.69230923, 'Đang học'),
('HS_185', 'Huỳnh Xuân Yến', '5A3', 'PH_185', '742 Nguyễn Huệ, Quận 1, TP.HCM', 10.77466545, 106.61917993, 'Đang học'),
('HS_186', 'Nguyễn Mỹ Dũng', '2D3', 'PH_186', '951 Võ Thị Sáu, Quận 4, TP.HCM', 10.79372615, 106.69328364, 'Đang học'),
('HS_187', 'Trần Thu An', '3B1', 'PH_187', '108 Điện Biên Phủ, Phú Nhuận, TP.HCM', 10.72733783, 106.61755834, 'Đang học'),
('HS_188', 'Hồ Quốc Uyên', '2D1', 'PH_188', '770 Lê Lợi, Quận 3, TP.HCM', 10.80389946, 106.70635505, 'Đang học'),
('HS_189', 'Huỳnh Thị Dũng', '1A3', 'PH_189', '372 Võ Thị Sáu, Quận 10, TP.HCM', 10.77398983, 106.70396031, 'Đang học'),
('HS_190', 'Võ Thị Tùng', '4A3', 'PH_190', '477 Cách Mạng Tháng 8, Bình Thạnh, TP.HCM', 10.76895309, 106.63942439, 'Đang học'),
('HS_191', 'Phan Văn Sơn', '2A2', 'PH_191', '705 Pasteur, Phú Nhuận, TP.HCM', 10.77001147, 106.69007004, 'Đang học'),
('HS_192', 'Bùi Đức An', '1B2', 'PH_192', '963 Hai Bà Trưng, Quận 10, TP.HCM', 10.71279264, 106.69571056, 'Đang học'),
('HS_193', 'Huỳnh Quốc Phượng', '5B3', 'PH_193', '217 Hai Bà Trưng, Phú Nhuận, TP.HCM', 10.72815153, 106.68666102, 'Đang học'),
('HS_194', 'Hoàng Thu Lan', '1A2', 'PH_194', '379 Lý Tự Trọng, Quận 5, TP.HCM', 10.72995712, 106.63531206, 'Đang học'),
('HS_195', 'Vũ Xuân Huy', '1A3', 'PH_195', '957 Lý Tự Trọng, Bình Thạnh, TP.HCM', 10.76596294, 106.70684073, 'Đang học'),
('HS_196', 'Đỗ Đức Thắng', '1D3', 'PH_196', '122 Nguyễn Trãi, Quận 4, TP.HCM', 10.71545487, 106.61037623, 'Đang học'),
('HS_197', 'Hồ Hữu Thắng', '5D1', 'PH_197', '439 Lê Duẩn, Bình Thạnh, TP.HCM', 10.72784663, 106.67625577, 'Đang học'),
('HS_198', 'Hồ Thanh Dũng', '2D2', 'PH_198', '860 Đồng Khởi, Bình Thạnh, TP.HCM', 10.74133829, 106.62760685, 'Đang học'),
('HS_199', 'Huỳnh Đức Thủy', '4B3', 'PH_199', '967 Võ Thị Sáu, Quận 5, TP.HCM', 10.80877781, 106.69917812, 'Đang học'),
('HS_200', 'Phạm Quốc Khánh', '3C2', 'PH_200', '926 Trần Hưng Đạo, Quận 3, TP.HCM', 10.80708907, 106.63317133, 'Đang học'),
('HS_201', 'Đặng Xuân Việt', '3D2', 'PH_201', '86 Nguyễn Huệ, Quận 3, TP.HCM', 10.80737576, 106.70487765, 'Đang học'),
('HS_202', 'Trần Quốc Phúc', '4C3', 'PH_202', '680 Hai Bà Trưng, Quận 1, TP.HCM', 10.75398772, 106.70238522, 'Đang học'),
('HS_203', 'Hồ Xuân Quỳnh', '3B2', 'PH_203', '275 Nguyễn Huệ, Quận 5, TP.HCM', 10.71757742, 106.61457258, 'Đang học'),
('HS_204', 'Bùi Thị Tùng', '4A1', 'PH_204', '257 Điện Biên Phủ, Quận 10, TP.HCM', 10.76435485, 106.67735662, 'Đang học'),
('HS_205', 'Đỗ Kim Phúc', '3B3', 'PH_205', '227 Lý Tự Trọng, Quận 1, TP.HCM', 10.80391683, 106.64431567, 'Đang học'),
('HS_206', 'Đặng Văn Thắng', '2C2', 'PH_206', '263 Pasteur, Quận 3, TP.HCM', 10.80426157, 106.65859293, 'Đang học'),
('HS_207', 'Bùi Thu Nhi', '1C2', 'PH_207', '436 Nguyễn Trãi, Quận 4, TP.HCM', 10.75491148, 106.65661939, 'Đang học'),
('HS_208', 'Dương Minh Tùng', '2A1', 'PH_208', '600 Điện Biên Phủ, Quận 4, TP.HCM', 10.79511470, 106.68389439, 'Đang học'),
('HS_209', 'Ngô Thị An', '3B2', 'PH_209', '739 Lê Duẩn, Quận 10, TP.HCM', 10.80742213, 106.70344428, 'Đang học'),
('HS_210', 'Lý Quốc An', '4C3', 'PH_210', '110 Tôn Đức Thắng, Bình Thạnh, TP.HCM', 10.79743311, 106.61343652, 'Đang học'),
('HS_211', 'Trần Đức Nga', '3D3', 'PH_211', '576 Trần Hưng Đạo, Quận 10, TP.HCM', 10.80412967, 106.68920444, 'Đang học'),
('HS_212', 'Bùi Kim Tùng', '3D3', 'PH_212', '471 Nguyễn Trãi, Bình Thạnh, TP.HCM', 10.71607099, 106.67834165, 'Đang học'),
('HS_213', 'Dương Quốc Vân', '1B2', 'PH_213', '339 Nam Kỳ Khởi Nghĩa, Bình Thạnh, TP.HCM', 10.73565060, 106.70513216, 'Đang học'),
('HS_214', 'Hồ Minh An', '1D3', 'PH_214', '380 Lê Duẩn, Quận 5, TP.HCM', 10.75179639, 106.67439932, 'Đang học'),
('HS_215', 'Lê Thị Minh', '2C1', 'PH_215', '687 Lý Tự Trọng, Quận 1, TP.HCM', 10.71682714, 106.65528482, 'Đang học'),
('HS_216', 'Bùi Hữu Tùng', '3B2', 'PH_216', '101 Nam Kỳ Khởi Nghĩa, Quận 10, TP.HCM', 10.75597315, 106.63551171, 'Đang học'),
('HS_217', 'Phan Thị Quang', '5A2', 'PH_217', '810 Hai Bà Trưng, Phú Nhuận, TP.HCM', 10.76607023, 106.65507004, 'Đang học'),
('HS_218', 'Ngô Thanh Phúc', '2B2', 'PH_218', '997 Điện Biên Phủ, Quận 3, TP.HCM', 10.72528589, 106.62615435, 'Đang học'),
('HS_219', 'Dương Thu Nam', '5A2', 'PH_219', '60 Nguyễn Trãi, Quận 3, TP.HCM', 10.74476849, 106.63909552, 'Đang học'),
('HS_220', 'Lý Quốc Tùng', '5D2', 'PH_220', '548 Lý Tự Trọng, Quận 10, TP.HCM', 10.75694251, 106.68398124, 'Đang học'),
('HS_221', 'Phạm Xuân Yến', '3C2', 'PH_221', '607 Nguyễn Thị Minh Khai, Phú Nhuận, TP.HCM', 10.80096810, 106.61363887, 'Đang học'),
('HS_222', 'Hoàng Thu Minh', '4D1', 'PH_222', '757 Võ Thị Sáu, Quận 1, TP.HCM', 10.72213278, 106.70775965, 'Đang học'),
('HS_223', 'Ngô Kim Việt', '2B2', 'PH_223', '359 Đồng Khởi, Quận 3, TP.HCM', 10.72129663, 106.65695248, 'Đang học'),
('HS_224', 'Phan Minh Uyên', '4C2', 'PH_224', '164 Điện Biên Phủ, Quận 1, TP.HCM', 10.72912653, 106.62112886, 'Đang học'),
('HS_225', 'Ngô Mỹ Minh', '3B2', 'PH_225', '676 Nam Kỳ Khởi Nghĩa, Quận 10, TP.HCM', 10.73918316, 106.68024121, 'Đang học'),
('HS_226', 'Phạm Mỹ Yến', '4C2', 'PH_226', '280 Võ Thị Sáu, Quận 1, TP.HCM', 10.80733414, 106.69468405, 'Đang học'),
('HS_227', 'Ngô Thị Cường', '1C2', 'PH_227', '564 Đồng Khởi, Quận 1, TP.HCM', 10.76845673, 106.69277183, 'Đang học'),
('HS_228', 'Đặng Gia Thảo', '4C3', 'PH_228', '564 Nguyễn Trãi, Quận 10, TP.HCM', 10.71834758, 106.65111484, 'Đang học'),
('HS_229', 'Ngô Đức Nhi', '4D3', 'PH_229', '445 Võ Thị Sáu, Bình Thạnh, TP.HCM', 10.77095569, 106.63103362, 'Đang học'),
('HS_230', 'Võ Thị Nam', '3C1', 'PH_230', '902 Nam Kỳ Khởi Nghĩa, Phú Nhuận, TP.HCM', 10.80802787, 106.66530842, 'Đang học'),
('HS_231', 'Phan Quốc An', '4B1', 'PH_231', '941 Cách Mạng Tháng 8, Quận 1, TP.HCM', 10.80562268, 106.63338171, 'Đang học'),
('HS_232', 'Ngô Thanh Nga', '4C3', 'PH_232', '418 Nguyễn Trãi, Bình Thạnh, TP.HCM', 10.71931993, 106.65692912, 'Đang học'),
('HS_233', 'Phạm Thanh Phượng', '3B2', 'PH_233', '193 Võ Thị Sáu, Quận 1, TP.HCM', 10.75809106, 106.66582535, 'Đang học'),
('HS_234', 'Ngô Hữu Quang', '2C1', 'PH_234', '469 Tôn Đức Thắng, Quận 5, TP.HCM', 10.73750287, 106.67311732, 'Đang học'),
('HS_235', 'Huỳnh Đức Thắng', '3C3', 'PH_235', '150 Pasteur, Bình Thạnh, TP.HCM', 10.71598713, 106.67246345, 'Đang học'),
('HS_236', 'Lý Văn An', '3D1', 'PH_236', '78 Nguyễn Thị Minh Khai, Quận 4, TP.HCM', 10.80652059, 106.70116312, 'Đang học'),
('HS_237', 'Hoàng Minh Vân', '2D1', 'PH_237', '487 Hai Bà Trưng, Bình Thạnh, TP.HCM', 10.77394474, 106.66017119, 'Đang học'),
('HS_238', 'Trần Hữu Phúc', '5C2', 'PH_238', '972 Cách Mạng Tháng 8, Quận 4, TP.HCM', 10.79223438, 106.64862851, 'Đang học'),
('HS_239', 'Phan Mỹ Thủy', '3C2', 'PH_239', '239 Lý Tự Trọng, Phú Nhuận, TP.HCM', 10.76181122, 106.66963725, 'Đang học'),
('HS_240', 'Hoàng Quốc Thắng', '3C2', 'PH_240', '336 Hai Bà Trưng, Quận 5, TP.HCM', 10.80421847, 106.70824281, 'Đang học'),
('HS_241', 'Phan Thanh Hải', '2B2', 'PH_241', '280 Võ Thị Sáu, Quận 4, TP.HCM', 10.81127841, 106.66918022, 'Đang học'),
('HS_242', 'Lý Minh Nga', '4D3', 'PH_242', '777 Nguyễn Trãi, Quận 5, TP.HCM', 10.78197445, 106.67754704, 'Đang học'),
('HS_243', 'Phạm Minh Khánh', '1A1', 'PH_243', '402 Pasteur, Bình Thạnh, TP.HCM', 10.73772488, 106.70091701, 'Đang học'),
('HS_244', 'Bùi Đức Hải', '1D1', 'PH_244', '718 Nguyễn Thị Minh Khai, Quận 4, TP.HCM', 10.78245598, 106.63865000, 'Đang học'),
('HS_245', 'Bùi Văn Cường', '2C2', 'PH_245', '609 Nam Kỳ Khởi Nghĩa, Phú Nhuận, TP.HCM', 10.78156760, 106.64305873, 'Đang học'),
('HS_246', 'Phạm Đức Uyên', '2B2', 'PH_246', '640 Lê Duẩn, Quận 5, TP.HCM', 10.72560002, 106.65871945, 'Đang học'),
('HS_247', 'Vũ Minh Hùng', '4A3', 'PH_247', '32 Điện Biên Phủ, Quận 5, TP.HCM', 10.73433150, 106.65642014, 'Đang học'),
('HS_248', 'Huỳnh Hữu Thắng', '5B3', 'PH_248', '721 Lý Tự Trọng, Quận 5, TP.HCM', 10.77926343, 106.67877629, 'Đang học'),
('HS_249', 'Phan Quốc Dũng', '2C2', 'PH_249', '5 Nguyễn Huệ, Quận 10, TP.HCM', 10.73937997, 106.66650967, 'Đang học'),
('HS_250', 'Huỳnh Mỹ Vy', '3C1', 'PH_250', '880 Pasteur, Quận 5, TP.HCM', 10.71777727, 106.63754653, 'Đang học'),
('HS_251', 'Đỗ Kim Linh', '2B1', 'PH_251', '875 Nguyễn Trãi, Quận 5, TP.HCM', 10.78279790, 106.62450195, 'Đang học'),
('HS_252', 'Ngô Kim Cường', '4B2', 'PH_252', '153 Đồng Khởi, Phú Nhuận, TP.HCM', 10.75319093, 106.70937834, 'Đang học'),
('HS_253', 'Nguyễn Gia Lan', '4B3', 'PH_253', '686 Lê Lợi, Quận 10, TP.HCM', 10.76388393, 106.67161102, 'Đang học'),
('HS_254', 'Phạm Quốc Trang', '3A2', 'PH_254', '21 Nguyễn Thị Minh Khai, Phú Nhuận, TP.HCM', 10.71401876, 106.65855766, 'Đang học'),
('HS_255', 'Trần Thanh Tuấn', '1A2', 'PH_255', '874 Lê Lợi, Bình Thạnh, TP.HCM', 10.74884201, 106.67865642, 'Đang học'),
('HS_256', 'Huỳnh Xuân Long', '1B1', 'PH_256', '214 Nguyễn Trãi, Quận 10, TP.HCM', 10.80552121, 106.67092457, 'Đang học'),
('HS_257', 'Nguyễn Hữu Trang', '5C1', 'PH_257', '376 Hai Bà Trưng, Quận 4, TP.HCM', 10.80601650, 106.69746429, 'Đang học'),
('HS_258', 'Lê Văn Quang', '2B3', 'PH_258', '318 Trần Hưng Đạo, Quận 5, TP.HCM', 10.73420782, 106.68122869, 'Đang học'),
('HS_259', 'Bùi Minh Nam', '2B1', 'PH_259', '31 Lê Duẩn, Quận 3, TP.HCM', 10.76401881, 106.67676423, 'Đang học'),
('HS_260', 'Phạm Mỹ Linh', '2C3', 'PH_260', '694 Lê Lợi, Phú Nhuận, TP.HCM', 10.76439412, 106.67428718, 'Đang học'),
('HS_261', 'Đặng Kim Huy', '2C3', 'PH_261', '443 Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM', 10.80995774, 106.70052201, 'Đang học'),
('HS_262', 'Nguyễn Gia Phúc', '2B3', 'PH_262', '695 Lê Duẩn, Quận 1, TP.HCM', 10.76506698, 106.62235904, 'Đang học'),
('HS_263', 'Đặng Xuân Phúc', '2C1', 'PH_263', '702 Đồng Khởi, Quận 5, TP.HCM', 10.71426111, 106.69105681, 'Đang học'),
('HS_264', 'Đỗ Mỹ Yến', '5B2', 'PH_264', '556 Tôn Đức Thắng, Quận 1, TP.HCM', 10.77098261, 106.70574489, 'Đang học'),
('HS_265', 'Lý Xuân Huy', '3D3', 'PH_265', '948 Tôn Đức Thắng, Quận 4, TP.HCM', 10.74955135, 106.66653526, 'Đang học'),
('HS_266', 'Hồ Quốc Huy', '3C2', 'PH_266', '571 Lê Duẩn, Quận 1, TP.HCM', 10.71973268, 106.65550387, 'Đang học'),
('HS_267', 'Ngô Hữu Thủy', '4A1', 'PH_267', '675 Nguyễn Thị Minh Khai, Quận 5, TP.HCM', 10.76759661, 106.65050873, 'Đang học'),
('HS_268', 'Đỗ Minh Linh', '3D1', 'PH_268', '272 Nam Kỳ Khởi Nghĩa, Phú Nhuận, TP.HCM', 10.75699813, 106.64623114, 'Đang học'),
('HS_269', 'Lý Thị Quỳnh', '4C2', 'PH_269', '574 Cách Mạng Tháng 8, Quận 3, TP.HCM', 10.75566221, 106.65353344, 'Đang học'),
('HS_270', 'Phan Đức Thắng', '5D1', 'PH_270', '170 Nguyễn Trãi, Quận 10, TP.HCM', 10.77445641, 106.68461206, 'Đang học'),
('HS_271', 'Huỳnh Thị Trung', '4B2', 'PH_271', '88 Điện Biên Phủ, Bình Thạnh, TP.HCM', 10.71324164, 106.64073207, 'Đang học'),
('HS_272', 'Phan Quốc Việt', '5C3', 'PH_272', '480 Nguyễn Trãi, Quận 1, TP.HCM', 10.78068558, 106.63304141, 'Đang học'),
('HS_273', 'Võ Hữu Sơn', '3D3', 'PH_273', '268 Pasteur, Quận 1, TP.HCM', 10.80632322, 106.69013552, 'Đang học'),
('HS_274', 'Lê Văn Phúc', '3D1', 'PH_274', '220 Nguyễn Huệ, Phú Nhuận, TP.HCM', 10.71813046, 106.67170933, 'Đang học'),
('HS_275', 'Phan Xuân Việt', '3B2', 'PH_275', '166 Nguyễn Thị Minh Khai, Quận 5, TP.HCM', 10.76957690, 106.70094427, 'Đang học'),
('HS_276', 'Phan Kim Quân', '4D3', 'PH_276', '150 Nguyễn Huệ, Quận 4, TP.HCM', 10.75991270, 106.68224803, 'Đang học'),
('HS_277', 'Nguyễn Gia Long', '5A3', 'PH_277', '557 Cách Mạng Tháng 8, Quận 10, TP.HCM', 10.79869850, 106.70920233, 'Đang học'),
('HS_278', 'Huỳnh Minh Huy', '4B1', 'PH_278', '422 Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM', 10.73606241, 106.67544065, 'Đang học'),
('HS_279', 'Vũ Thị Tùng', '2C2', 'PH_279', '47 Lê Duẩn, Quận 4, TP.HCM', 10.72854489, 106.69337487, 'Đang học'),
('HS_280', 'Phan Hữu Giang', '3C2', 'PH_280', '652 Tôn Đức Thắng, Quận 1, TP.HCM', 10.78677195, 106.68015605, 'Đang học'),
('HS_281', 'Bùi Kim Uyên', '2A2', 'PH_281', '429 Tôn Đức Thắng, Quận 1, TP.HCM', 10.73825686, 106.70831057, 'Đang học'),
('HS_282', 'Hồ Hữu Giang', '5C3', 'PH_282', '565 Lê Duẩn, Quận 4, TP.HCM', 10.80672209, 106.65636370, 'Đang học'),
('HS_283', 'Hồ Mỹ Long', '5C2', 'PH_283', '84 Pasteur, Quận 3, TP.HCM', 10.73682540, 106.64068195, 'Đang học'),
('HS_284', 'Ngô Xuân Uyên', '1A1', 'PH_284', '591 Nam Kỳ Khởi Nghĩa, Phú Nhuận, TP.HCM', 10.80830249, 106.62818471, 'Đang học'),
('HS_285', 'Huỳnh Văn Huy', '5A2', 'PH_285', '312 Đồng Khởi, Phú Nhuận, TP.HCM', 10.76764326, 106.65799050, 'Đang học'),
('HS_286', 'Trần Thu Quân', '5D2', 'PH_286', '321 Nguyễn Trãi, Quận 1, TP.HCM', 10.77872147, 106.68884344, 'Đang học'),
('HS_287', 'Lý Hữu Trung', '5D3', 'PH_287', '294 Điện Biên Phủ, Quận 3, TP.HCM', 10.78893657, 106.63345634, 'Đang học'),
('HS_288', 'Bùi Kim Bình', '1D1', 'PH_288', '174 Lê Duẩn, Phú Nhuận, TP.HCM', 10.74625067, 106.66046404, 'Đang học'),
('HS_289', 'Nguyễn Quốc Trang', '2A2', 'PH_289', '679 Tôn Đức Thắng, Quận 10, TP.HCM', 10.73708710, 106.63718700, 'Đang học'),
('HS_290', 'Dương Quốc Hùng', '3D3', 'PH_290', '270 Cách Mạng Tháng 8, Quận 5, TP.HCM', 10.80220777, 106.62950170, 'Đang học'),
('HS_291', 'Lê Minh Minh', '1A1', 'PH_291', '364 Lê Duẩn, Bình Thạnh, TP.HCM', 10.77836948, 106.63482260, 'Đang học'),
('HS_292', 'Đỗ Văn Quang', '4C1', 'PH_292', '816 Lê Duẩn, Quận 5, TP.HCM', 10.72931981, 106.64036624, 'Đang học'),
('HS_293', 'Đỗ Gia Nam', '5B1', 'PH_293', '507 Lý Tự Trọng, Quận 3, TP.HCM', 10.74954146, 106.64869829, 'Đang học'),
('HS_294', 'Phạm Quốc Yến', '1C2', 'PH_294', '472 Tôn Đức Thắng, Bình Thạnh, TP.HCM', 10.72075236, 106.68514554, 'Đang học'),
('HS_295', 'Phạm Gia Huy', '4A3', 'PH_295', '695 Nguyễn Thị Minh Khai, Quận 10, TP.HCM', 10.78038536, 106.64991849, 'Đang học'),
('HS_296', 'Hồ Kim Huy', '3C1', 'PH_296', '640 Võ Thị Sáu, Quận 1, TP.HCM', 10.71477877, 106.69596585, 'Đang học'),
('HS_297', 'Võ Thanh Giang', '2A1', 'PH_297', '537 Tôn Đức Thắng, Quận 4, TP.HCM', 10.77356914, 106.70522811, 'Đang học'),
('HS_298', 'Hoàng Đức Linh', '5B3', 'PH_298', '269 Võ Thị Sáu, Quận 10, TP.HCM', 10.77866615, 106.69128198, 'Đang học'),
('HS_299', 'Huỳnh Quốc Nam', '4C1', 'PH_299', '602 Lê Lợi, Quận 4, TP.HCM', 10.71538862, 106.63727202, 'Đang học'),
('HS_300', 'Trần Thị Sơn', '4A3', 'PH_300', '690 Pasteur, Quận 1, TP.HCM', 10.81086666, 106.66357777, 'Đang học');


-- 6. Notifications
INSERT INTO `thongbao` (`MaThongBao`, `NoiDung`, `ThoiGian`, `LoaiThongBao`) VALUES
('TB001', 'Thông báo quan trọng số 1 về lịch trình xe buýt.', NOW(), 'Hệ thống'),
('TB002', 'Thông báo quan trọng số 2 về lịch trình xe buýt.', NOW(), 'Hệ thống'),
('TB003', 'Thông báo quan trọng số 3 về lịch trình xe buýt.', NOW(), 'Hệ thống'),
('TB004', 'Thông báo quan trọng số 4 về lịch trình xe buýt.', NOW(), 'Hệ thống'),
('TB005', 'Thông báo quan trọng số 5 về lịch trình xe buýt.', NOW(), 'Hệ thống'),
('TB006', 'Thông báo quan trọng số 6 về lịch trình xe buýt.', NOW(), 'Hệ thống'),
('TB007', 'Thông báo quan trọng số 7 về lịch trình xe buýt.', NOW(), 'Hệ thống'),
('TB008', 'Thông báo quan trọng số 8 về lịch trình xe buýt.', NOW(), 'Hệ thống'),
('TB009', 'Thông báo quan trọng số 9 về lịch trình xe buýt.', NOW(), 'Hệ thống'),
('TB010', 'Thông báo quan trọng số 10 về lịch trình xe buýt.', NOW(), 'Hệ thống');

-- Link Notifications to Parents
INSERT INTO `thongbao_phuhuynh` (`MaThongBao`, `MaPhuHuynh`, `NoiDung`, `ThoiGian`) 
SELECT tb.MaThongBao, ph.MaPhuHuynh, tb.NoiDung, tb.ThoiGian FROM thongbao tb CROSS JOIN phuhuynh ph WHERE ph.MaPhuHuynh IN ('PH011', 'PH012', 'PH013', 'PH014', 'PH015');
SET FOREIGN_KEY_CHECKS = 1;
