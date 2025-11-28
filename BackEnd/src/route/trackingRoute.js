import express from "express";
import { 
    updateLocation, 
    getLiveLocations,
    getRouteHistory,
    getSchedulePickupPoints
} from "../controller/trackingController.js";
import {
    getLocationFromMemory,
    getActiveBuses,
    getLocationHistory
} from "../controller/redisTrackingController.js";
import verifyToken from "../middleWare/authMiddleware.js";

const router = express.Router();

// ===== MySQL-based tracking (Legacy) =====
// Lấy vị trí (cho admin map)
router.get("/live", verifyToken, getLiveLocations);

// Lấy pickup points theo schedule (cho map driver và admin khi đang chạy)
router.get("/pickup-points/:scheduleId", verifyToken, getSchedulePickupPoints);

// Lấy lịch sử quãng đường (cho admin map)
router.get("/history/:busId", verifyToken, getRouteHistory);

// Cập nhật vị trí (từ app tài xế)
router.post("/update-location", updateLocation); 

// ===== Memory-based tracking (Real-time) =====
// Lấy vị trí hiện tại của 1 xe từ memory
router.get("/memory/location/:busId", verifyToken, getLocationFromMemory);

// Lấy danh sách tất cả xe đang hoạt động
router.get("/memory/active-buses", verifyToken, getActiveBuses);

// Lấy lịch sử vị trí (không khả dụng với memory storage)
router.get("/memory/history/:busId", verifyToken, getLocationHistory);

export default router;