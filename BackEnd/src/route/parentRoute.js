import express from 'express';
import { 
  getChildrenRoutes, 
  getParentNotifications, 
  markNotificationRead,
  markAllNotificationsRead,
  getVehicleTracking,
  getParentInfo,
  getVehicleETA,
  getParentSchedules,
  requestAbsence,
  addStudent,
  createNewParent,
  updateParent
} from '../controller/parentController.js';
import verifyToken from "../middleWare/authMiddleware.js";

const router = express.Router();

// POST /api/v1/parents - Tạo phụ huynh mới (không cần verify token vì gọi từ admin)
router.post('/s', createNewParent);

// PUT /api/v1/parents/:id - Cập nhật phụ huynh
router.put('/s/:id', updateParent);

// GET /api/v1/parent/info/:parentId - Lấy thông tin phụ huynh
router.get('/info/:parentId', verifyToken, getParentInfo);

// GET /api/v1/parent/children/:parentId - Lấy danh sách con và tuyến xe
router.get('/children/:parentId', verifyToken, getChildrenRoutes);

// GET /api/v1/parent/schedules/:parentId - Lấy lịch trình của con
router.get('/schedules/:parentId', verifyToken, getParentSchedules);

// POST /api/v1/parent/schedules/:scheduleId/absence - Xin nghỉ học
router.post('/schedules/:scheduleId/absence', verifyToken, requestAbsence);

// GET /api/v1/parent/notifications/:parentId - Lấy thông báo
router.get('/notifications/:parentId', verifyToken, getParentNotifications);

// POST /api/v1/parent/notifications/:notificationId/mark-read - Đánh dấu đã đọc
router.post('/notifications/:notificationId/mark-read', verifyToken, markNotificationRead);

// POST /api/v1/parent/notifications/mark-all-read/:parentId - Đánh dấu tất cả đã đọc
router.post('/notifications/mark-all-read/:parentId', verifyToken, markAllNotificationsRead);

// GET /api/v1/parent/vehicle-tracking/:studentId - Tracking xe bus
router.get('/vehicle-tracking/:studentId', verifyToken, getVehicleTracking);

// GET /api/v1/parent/vehicle-eta/:studentId - Lấy ETA chính xác
router.get('/vehicle-eta/:studentId', verifyToken, getVehicleETA);

// POST /api/v1/parent/add-student - Thêm học sinh mới
router.post('/add-student', verifyToken, addStudent);

export default router;
