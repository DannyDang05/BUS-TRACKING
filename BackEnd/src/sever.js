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
// CORS Configuration - hỗ trợ nhiều origins
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
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

server.listen(port, '0.0.0.0', () => {
  const env = process.env.NODE_ENV || 'development';
  const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;
  
  console.log(`✅ Server (HTTP & Socket.IO) running on port ${port}`);
  console.log(`🌍 Environment: ${env}`);
  console.log(`🔗 Server URL: ${serverUrl}`);
  console.log(`✅ CORS Origins: ${allowedOrigins.join(', ')}`);
  console.log(`✅ Using in-memory storage for bus locations`);
  
  // Khởi động Parent Notification Service
  parentNotificationService.start(60000); // Check mỗi 60 giây
});