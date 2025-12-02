import express from "express";
import {
  getAllNotifications,
  createNotification,
  getNotificationDetail,
  deleteNotification,
  reportIssue,
  getAllDriversForNotification,
  getAllParentsForNotification
} from "../controller/notificationController.js";
import verifyToken from "../middleWare/authMiddleware.js";
import requireRole from "../middleWare/requireRole.js";

const router = express.Router();

// Endpoint report-issue cho tài xế (chỉ cần xác thực, không cần role admin)
router.post("/report-issue", verifyToken, reportIssue);

// Các endpoint còn lại chỉ cho admin
router.get("/", verifyToken, requireRole('admin'), getAllNotifications);
router.post("/", verifyToken, requireRole('admin'), createNotification);
router.get("/recipients/drivers", verifyToken, getAllDriversForNotification); // Bỏ requireRole để test
router.get("/recipients/parents", verifyToken, getAllParentsForNotification); // Bỏ requireRole để test
router.get("/:id", verifyToken, requireRole('admin'), getNotificationDetail);
router.delete("/:id", verifyToken, requireRole('admin'), deleteNotification);

export default router;
