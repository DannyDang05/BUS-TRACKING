import mysql from "mysql2/promise"; // Sử dụng promise-based

// Railway cung cấp các biến: MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE
// Ưu tiên dùng biến Railway, fallback về biến custom, cuối cùng là default
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_DATABASE || 'bustracking',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_POOL_MAX || '10'),
  queueLimit: 0,
  connectTimeout: 60000,
  timezone: '+07:00', // Timezone Việt Nam (UTC+7) - tránh MySQL convert sang UTC
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false
    }
  })
});

// Hàm kiểm tra kết nối
const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    const host = process.env.MYSQLHOST || process.env.DB_HOST || 'localhost';
    const port = process.env.MYSQLPORT || process.env.DB_PORT || 3306;
    const database = process.env.MYSQLDATABASE || process.env.DB_DATABASE || 'bustracking';
    const env = process.env.NODE_ENV || 'development';
    
    console.log("✅ Đã kết nối MySQL thành công!");
    console.log(`   Environment: ${env}`);
    console.log(`   Host: ${host}`);
    console.log(`   Port: ${port}`);
    console.log(`   Database: ${database}`);
    connection.release();
  } catch (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
    console.error("   Kiểm tra lại các biến môi trường:");
    console.error(`   - MYSQLHOST/DB_HOST: ${process.env.MYSQLHOST || process.env.DB_HOST}`);
    console.error(`   - MYSQLPORT/DB_PORT: ${process.env.MYSQLPORT || process.env.DB_PORT}`);
    console.error(`   - MYSQLDATABASE/DB_DATABASE: ${process.env.MYSQLDATABASE || process.env.DB_DATABASE}`);
    process.exit(1);
  }
};

export { pool, checkConnection };