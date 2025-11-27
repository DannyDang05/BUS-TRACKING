import express from "express";
import {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getDriverSchedules,
  getScheduleStudents,
  updateScheduleStatus,
  assignDriverToRoute,
  updateScheduleDriver,
  generateDaySchedules
} from "../controller/scheduleController.js";
import verifyToken from "../middleWare/authMiddleware.js";

const router = express.Router();

// CRUD cho Admin (đặt trước để tránh conflict với :scheduleId)
router.get("/", verifyToken, getAllSchedules);
router.post("/", verifyToken, createSchedule);

// Tạo lịch cho 1 ngày (2 ca: sáng + chiều cho tất cả routes)
router.post("/generate-day", verifyToken, generateDaySchedules);

// Phân công tài xế cho route (tạo 2 schedules: sáng + chiều)
router.post("/assign-driver", verifyToken, assignDriverToRoute);

// Lấy lịch làm việc của tài xế
router.get("/driver/:driverId", verifyToken, getDriverSchedules);

// Chi tiết schedule
router.get("/:id", verifyToken, getScheduleById);

// Cập nhật và xóa schedule
router.put("/:id", verifyToken, updateSchedule);
router.delete("/:id", verifyToken, deleteSchedule);

// Cập nhật tài xế cho schedule
router.put("/:id/assign-driver", verifyToken, updateScheduleDriver);

// Lấy danh sách học sinh trên tuyến của schedule
router.get("/:scheduleId/students", verifyToken, getScheduleStudents);

// Cập nhật trạng thái schedule (Bắt đầu/Hoàn thành)
router.put("/:scheduleId/status", verifyToken, updateScheduleStatus);

export default router;
