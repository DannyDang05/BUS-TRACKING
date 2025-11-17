import mysql from "mysql2/promise"; // Sử dụng promise-based

// Tạo một "pool" thay vì "connection"
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_DATABASE || 'school_bus_db', // ✅ THAY ĐỔI Ở ĐÂY
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Hàm kiểm tra kết nối
const checkConnection = async () => {
  try {
    const connection = await pool.getConnection(); // Lấy 1 kết nối từ pool
    console.log("✅ Đã kết nối MySQL thành công (sử dụng Pool)!");
    connection.release(); // Trả kết nối về pool
  } catch (err) {
    console.error("❌ Lỗi kết nối MySQL:", err);
  }
};

export { pool, checkConnection };