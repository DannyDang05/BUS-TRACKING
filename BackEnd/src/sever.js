import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine.js";
import initWebRouter from "./route/web.js";
import initAPIRouter from "./route/api.js";
import { checkConnection } from "./config/connectDB.js"; // Import hàm check
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from 'http'; // ✅ Thêm HTTP server
import { initWebSocket } from "./services/webSocketService.js"; // ✅ Thêm WS

dotenv.config();
await checkConnection(); // ✅ Kiểm tra kết nối DB khi khởi động

const app = express();
const __dirname = path.resolve();

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

viewEngine(app);

// Khởi tạo các Router
initWebRouter(app);
initAPIRouter(app);

// ✅ Cấu hình Server (HTTP + WebSocket)
const port = process.env.PORT || 6969;
const server = createServer(app); // Tạo HTTP server từ app Express

initWebSocket(server); // Khởi tạo WebSocket Server

server.listen(port, () => {
  console.log(`✅ Server (HTTP & WS) đang chạy tại http://localhost:${port}`);
});