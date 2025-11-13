import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine.js";
import initWebRouter from "./route/web.js";   // ✅ giờ import này hợp lệ
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

viewEngine(app);
initWebRouter(app);
connectDB(app);

const port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${port}`);
});
