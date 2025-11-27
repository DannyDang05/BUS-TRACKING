import express from 'express';
import { 
  getChildrenRoutes, 
  getParentNotifications, 
  markNotificationRead,
  markAllNotificationsRead,
  getVehicleTracking 
} from '../controller/parentController.js';
import verifyToken from "../middleWare/authMiddleware.js";

const router = express.Router();

// GET /api/v1/parent/children/:parentId - Lấy danh sách con và tuyến xe
router.get('/children/:parentId', verifyToken, getChildrenRoutes);

// GET /api/v1/parent/notifications/:parentId - Lấy thông báo
router.get('/notifications/:parentId', verifyToken, getParentNotifications);

// POST /api/v1/parent/notifications/:notificationId/mark-read - Đánh dấu đã đọc
router.post('/notifications/:notificationId/mark-read', verifyToken, markNotificationRead);

// POST /api/v1/parent/notifications/mark-all-read/:parentId - Đánh dấu tất cả đã đọc
router.post('/notifications/mark-all-read/:parentId', verifyToken, markAllNotificationsRead);

// GET /api/v1/parent/vehicle-tracking/:studentId - Tracking xe bus
router.get('/vehicle-tracking/:studentId', verifyToken, getVehicleTracking);

export default router;
