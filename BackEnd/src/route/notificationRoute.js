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
router.use(verifyToken, requireRole('admin'));

router.get("/", getAllNotifications);
router.post("/", createNotification);
router.get("/recipients/drivers", getAllDriversForNotification);
router.get("/recipients/parents", getAllParentsForNotification);
router.get("/:id", getNotificationDetail);
router.delete("/:id", deleteNotification);

export default router;
