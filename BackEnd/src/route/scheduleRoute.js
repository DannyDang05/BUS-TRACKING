import express from "express";
import {
  getDriverSchedules,
  getScheduleStudents,
  updateScheduleStatus
} from "../controller/scheduleController.js";
import verifyToken from "../middleWare/authMiddleware.js";

const router = express.Router();

// Lấy lịch làm việc của tài xế
router.get("/driver/:driverId", verifyToken, getDriverSchedules);

// Lấy danh sách học sinh trên tuyến của schedule
router.get("/:scheduleId/students", verifyToken, getScheduleStudents);

// Cập nhật trạng thái schedule (Bắt đầu/Hoàn thành)
router.put("/:scheduleId/status", verifyToken, updateScheduleStatus);

export default router;
