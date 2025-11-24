const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Helper to escape SQL strings
const escape = (str) => str.replace(/'/g, "\\'");

// Data Arrays
const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const middleNames = ['Văn', 'Thị', 'Minh', 'Thanh', 'Đức', 'Hữu', 'Mỹ', 'Kim', 'Quốc', 'Gia', 'Xuân', 'Thu'];
const firstNames = ['An', 'Bình', 'Cường', 'Dũng', 'Giang', 'Hải', 'Hùng', 'Huy', 'Khánh', 'Lan', 'Linh', 'Long', 'Mai', 'Minh', 'Nam', 'Nga', 'Nhi', 'Phúc', 'Phượng', 'Quân', 'Quang', 'Quỳnh', 'Sơn', 'Thảo', 'Thắng', 'Thủy', 'Trang', 'Trung', 'Tuấn', 'Tùng', 'Uyên', 'Vân', 'Việt', 'Vy', 'Yến'];
const streets = ['Nguyễn Huệ', 'Lê Lợi', 'Pasteur', 'Nam Kỳ Khởi Nghĩa', 'Hai Bà Trưng', 'Lê Duẩn', 'Đồng Khởi', 'Tôn Đức Thắng', 'Nguyễn Thị Minh Khai', 'Cách Mạng Tháng 8', 'Điện Biên Phủ', 'Võ Thị Sáu', 'Trần Hưng Đạo', 'Nguyễn Trãi', 'Lý Tự Trọng'];
const districts = ['Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 10', 'Bình Thạnh', 'Phú Nhuận'];

// Random Helpers
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(8);
const randomPhone = () => '09' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');

// Fixed Password Hash (password: 123456)
const passwordHash = '$2b$10$2v10OALDsE2SyMOnIVl8K.Sb2Abv7TIKk9lRu/Tbn/kNCnhgFCmCS';
const timestamp = Math.floor(Date.now() / 1000); // Use timestamp to ensure uniqueness

let sql = `-- Generated Seed Data
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

`;

// 1. Generate 20 Vehicles
sql += `-- 1. Vehicles (20 records)\n`;
sql += `INSERT INTO \`vehicles\` (\`LicensePlate\`, \`Model\`, \`Capacity\`, \`SpeedKmh\`, \`IsActive\`) VALUES\n`;
const vehicles = [];
for (let i = 1; i <= 20; i++) {
    const plate = `51B-${randomInt(100, 999)}.${randomInt(10, 99)}`;
    const models = ['Hyundai County 29 chỗ', 'Ford Transit 16 chỗ', 'Toyota Coaster 29 chỗ', 'Thaco Town 29 chỗ', 'Samco Felix 29 chỗ'];
    const model = randomItem(models);
    const capacity = model.includes('16') ? 16 : 29;
    vehicles.push(`('${plate}', '${model}', ${capacity}, 45, 1)`);
}
sql += vehicles.join(',\n') + ';\n\n';

// 2. Generate 20 Drivers & Users
sql += `-- 2. Drivers & Users (20 records)\n`;
const driverValues = [];
const driverUserValues = [];
for (let i = 1; i <= 20; i++) {
    const id = `TX${(i + 5).toString().padStart(3, '0')}`; // Start from TX006 (since 5 exist)
    const fullName = `${randomItem(lastNames)} ${randomItem(middleNames)} ${randomItem(firstNames)}`;
    const username = `taixe${(i + 5).toString().padStart(2, '0')}`;
    const phone = randomPhone();
    const license = `${randomItem(['B2', 'C', 'D', 'E'])}-${randomInt(100000, 999999)}`;
    
    // User
    // Assuming IDs continue from 11 (current max is 10)
    // We won't specify ID for users to let AUTO_INCREMENT work, but we need to link them.
    // Since we can't easily know the ID in a raw SQL script without variables, 
    // we will insert Users first, then Drivers using subqueries or just assuming IDs if we reset AI.
    // For safety in this script, we'll use a variable approach or just insert assuming sequential IDs if the DB is fresh-ish.
    // Better approach: Insert User, then Insert Driver with LAST_INSERT_ID() is hard in bulk.
    // We will generate separate INSERT statements for each driver to use LAST_INSERT_ID().
}

// Re-thinking strategy for Users linking:
// We can't do bulk insert easily with foreign keys without knowing IDs.
// We will generate individual blocks.

sql += `-- Drivers and their Users\n`;
for (let i = 1; i <= 20; i++) {
    const driverId = `TX${timestamp}_${i}`;
    const fullName = `${randomItem(lastNames)} ${randomItem(middleNames)} ${randomItem(firstNames)}`;
    const username = `taixe_${timestamp}_${i}`;
    const phone = randomPhone();
    const license = `DL-${randomInt(10000, 99999)}-${i}-${timestamp}`;

    sql += `INSERT INTO \`users\` (\`Username\`, \`Password\`, \`Role\`, \`ProfileId\`) VALUES ('${username}', '${passwordHash}', 'driver', '${driverId}');\n`;
    sql += `SET @userId = LAST_INSERT_ID();\n`;
    sql += `INSERT INTO \`drivers\` (\`Id\`, \`FullName\`, \`MaBangLai\`, \`PhoneNumber\`, \`UserId\`, \`IsActive\`) VALUES ('${driverId}', '${fullName}', '${license}', '${phone}', @userId, 1);\n`;
}
sql += '\n';

// 3. Generate 300 Parents & Users
sql += `-- 3. Parents & Users (300 records)\n`;
const parentIds = [];
for (let i = 1; i <= 300; i++) {
    const parentId = `PH${timestamp}_${i}`; 
    parentIds.push(parentId);
    const fullName = `${randomItem(lastNames)} ${randomItem(middleNames)} ${randomItem(firstNames)}`;
    const username = `phuhuynh_${timestamp}_${i}`;
    const phone = randomPhone();

    sql += `INSERT INTO \`users\` (\`Username\`, \`Password\`, \`Role\`, \`ProfileId\`) VALUES ('${username}', '${passwordHash}', 'parent', '${parentId}');\n`;
    sql += `SET @userId = LAST_INSERT_ID();\n`;
    sql += `INSERT INTO \`phuhuynh\` (\`MaPhuHuynh\`, \`HoTen\`, \`SoDienThoai\`, \`Nhanthongbao\`, \`UserId\`) VALUES ('${parentId}', '${fullName}', '${phone}', 1, @userId);\n`;
}
sql += '\n';

// 4. Generate 300 Students
sql += `-- 4. Students (300 records)\n`;
sql += `INSERT INTO \`hocsinh\` (\`MaHocSinh\`, \`HoTen\`, \`Lop\`, \`MaPhuHuynh\`, \`DiaChi\`, \`Latitude\`, \`Longitude\`, \`TrangThaiHocTap\`) VALUES\n`;
const students = [];
// Center around Ho Chi Minh City (approx 10.762622, 106.660172)
// Spread within ~5-10km
const centerLat = 10.762622;
const centerLon = 106.660172;

for (let i = 1; i <= 300; i++) {
    const studentId = `HS${timestamp}_${i}`;
    const fullName = `${randomItem(lastNames)} ${randomItem(middleNames)} ${randomItem(firstNames)}`;
    const lop = `${randomInt(1, 5)}${randomItem(['A', 'B', 'C', 'D'])}${randomInt(1, 3)}`;
    const parentId = parentIds[i - 1]; // 1-to-1 mapping for simplicity
    
    // Random location within ~0.05 degrees (approx 5km)
    const lat = (centerLat + (Math.random() - 0.5) * 0.1).toFixed(8);
    const lon = (centerLon + (Math.random() - 0.5) * 0.1).toFixed(8);
    
    const address = `${randomInt(1, 999)} ${randomItem(streets)}, ${randomItem(districts)}, TP.HCM`;
    
    students.push(`('${studentId}', '${fullName}', '${lop}', '${parentId}', '${address}', ${lat}, ${lon}, 'Đang học')`);
}
sql += students.join(',\n') + ';\n\n';

// 5. Schedules (Sample)
sql += `-- 5. Schedules (Sample)\n`;
// We need RouteIds. Assuming some routes exist or we create dummy ones.
// Since we haven't created Routes in this script (user asked for students/parents/vehicles/drivers), 
// we can't reliably link schedules without routes.
// However, the user prompt implies "thêm data mấu schedule".
// I will create a few dummy routes first to link schedules.

sql += `-- Dummy Routes for Schedules\n`;
sql += `INSERT INTO \`routes\` (\`MaTuyen\`, \`Name\`, \`Status\`) VALUES 
('RT001', 'Tuyến Quận 1 - Quận 3', 'Đang chạy'),
('RT002', 'Tuyến Bình Thạnh - Quận 1', 'Chưa chạy'),
('RT003', 'Tuyến Quận 5 - Quận 10', 'Đang chạy');\n`;

// I'll use a variable for Route ID.
sql += `SET @rt1 = (SELECT Id FROM routes WHERE MaTuyen = 'RT001' LIMIT 1);\n`;
sql += `SET @rt2 = (SELECT Id FROM routes WHERE MaTuyen = 'RT002' LIMIT 1);\n`;
sql += `SET @rt3 = (SELECT Id FROM routes WHERE MaTuyen = 'RT003' LIMIT 1);\n`;

// Generate schedules for next 7 days
const scheduleValues = [];
for (let d = 0; d < 7; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    
    scheduleValues.push(`(@rt1, '${dateStr}', '06:30:00', '07:30:00', 'Sắp diễn ra')`);
    scheduleValues.push(`(@rt1, '${dateStr}', '16:30:00', '17:30:00', 'Sắp diễn ra')`);
    scheduleValues.push(`(@rt2, '${dateStr}', '06:15:00', '07:15:00', 'Sắp diễn ra')`);
    scheduleValues.push(`(@rt3, '${dateStr}', '06:45:00', '07:45:00', 'Sắp diễn ra')`);
}
// We need to construct the INSERT statement carefully with variables
// Since we can't mix values and variables easily in a simple join if we want to be clean.
// Actually MySQL allows it.
sql += `INSERT INTO \`schedules\` (\`route_id\`, \`date\`, \`start_time\`, \`end_time\`, \`status\`) VALUES \n`;
sql += scheduleValues.join(',\n') + ';\n\n';


// 6. Notifications
sql += `-- 6. Notifications\n`;
sql += `INSERT INTO \`thongbao\` (\`MaThongBao\`, \`NoiDung\`, \`ThoiGian\`, \`LoaiThongBao\`) VALUES\n`;
const notifs = [];
for (let i = 1; i <= 10; i++) {
    notifs.push(`('TB${(i).toString().padStart(3, '0')}', 'Thông báo quan trọng số ${i} về lịch trình xe buýt.', NOW(), 'Hệ thống')`);
}
sql += notifs.join(',\n') + ';\n\n';

// Link notifications to parents
sql += `-- Link Notifications to Parents\n`;
sql += `INSERT INTO \`thongbao_phuhuynh\` (\`MaThongBao\`, \`MaPhuHuynh\`, \`NoiDung\`, \`ThoiGian\`) \n`;
sql += `SELECT tb.MaThongBao, ph.MaPhuHuynh, tb.NoiDung, tb.ThoiGian FROM thongbao tb CROSS JOIN phuhuynh ph WHERE ph.MaPhuHuynh IN ('PH011', 'PH012', 'PH013', 'PH014', 'PH015');\n`;

sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;

fs.writeFileSync(path.join(__dirname, 'seed_data.sql'), sql);
console.log('Seed data generated in seed_data.sql');
