import express from "express";
import {
  getAllNotifications,
  createNotification,
  getNotificationDetail,
  deleteNotification
} from "../controller/notificationController.js";
import verifyToken from "../middleWare/authMiddleware.js";
import requireRole from "../middleWare/requireRole.js";

const router = express.Router();


// Chỉ cho phép role admin
router.use(verifyToken, requireRole('admin'));

router.get("/", getAllNotifications);
router.post("/", createNotification);
router.get("/:id", getNotificationDetail);
router.delete("/:id", deleteNotification);

export default router;
