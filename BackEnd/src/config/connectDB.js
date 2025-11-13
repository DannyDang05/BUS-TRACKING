import mysql from "mysql2";

const connectDB = () => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "bustracking",
  });

  connection.connect((err) => {
    if (err) {
      console.error("❌ Lỗi kết nối MySQL:", err);
    } else {
      console.log("✅ Đã kết nối MySQL thành công!");
    }
  });

  return connection;
};

export default connectDB;
