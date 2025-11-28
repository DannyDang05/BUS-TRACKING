import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine.js";
import initWebRouter from "./route/web.js";
import initAPIRouter from "./route/Api.js";
import { checkConnection } from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from 'http';
import { initSocketIO } from "./service/SocketService.js";
import parentNotificationService from "./service/ParentNotificationService.js";

dotenv.config();
await checkConnection();

const app = express();
const __dirname = path.resolve();

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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

// ✅ Cấu hình Server (HTTP + Socket.IO)
const port = process.env.PORT || 6969;
const server = createServer(app);

initSocketIO(server);

server.listen(port, () => {
  console.log(`✅ Server (HTTP & Socket.IO) running on http://localhost:${port}`);
  console.log(`✅ Using in-memory storage for bus locations`);
  
  // Khởi động Parent Notification Service
  parentNotificationService.start(60000); // Check mỗi 60 giây
});