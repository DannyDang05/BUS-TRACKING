import mysql from "mysql2/promise"; // Sử dụng promise-based

// Tạo một "pool" thay vì "connection"
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'bustracking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+07:00' // Timezone Việt Nam (UTC+7) - tránh MySQL convert sang UTC
});

// Hàm kiểm tra kết nối
const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Đã kết nối MySQL thành công!");
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || 3306}`);
    console.log(`   Database: ${process.env.DB_DATABASE || 'bustracking'}`);
    connection.release();
  } catch (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
    process.exit(1);
  }
};

export { pool, checkConnection };