import express from "express";
import {
  getAllNotifications,
  createNotification,
  getNotificationDetail,
  deleteNotification
} from "../controller/notificationController.js";
import verifyToken from "../middleWare/authMiddleware.js";

const router = express.Router();

// router.use(verifyToken);

router.get("/", getAllNotifications);
router.post("/", createNotification);
router.get("/:id", getNotificationDetail);
router.delete("/:id", deleteNotification);

export default router;
