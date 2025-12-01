import express from "express";
import { 
    getAllDrivers, 
    createNewDriver, 
    updateDriver, 
    deleteDriver, 
    getDriverDetail,
    getDriverNotifications,
    markDriverNotificationRead,
    markAllDriverNotificationsRead
} from "../controller/driverController.js";
import verifyToken from "../middleWare/authMiddleware.js";
import requireRole from "../middleWare/requireRole.js";

const router = express.Router();


// Chỉ cho phép role driver
// router.use(verifyToken, requireRole('driver'));

router.get("/", getAllDrivers);
router.post("/", createNewDriver);

// Thông báo cho tài xế - PHẢI ĐẶT TRƯỚC /:id để tránh conflict
router.get("/notifications/:driverId", getDriverNotifications);
router.post("/notifications/:notificationId/mark-read", markDriverNotificationRead);
router.post("/notifications/mark-all-read/:driverId", markAllDriverNotificationsRead);

// Route với dynamic :id phải đặt cuối cùng
router.get("/:id", getDriverDetail);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);
    
export default router;