import express from "express";
import { 
    updateLocation, 
    getLiveLocations,
    getRouteHistory // ✅ Import hàm mới
} from "../../../controllers/trackingController.js";
import verifyToken from "../../../middleware/authMiddleware.js";

const router = express.Router();

// Lấy vị trí (cho admin map)
router.get("/live", verifyToken, getLiveLocations);

// ✅ API mới: Lấy lịch sử quãng đường (cho admin map)
router.get("/history/:busId", verifyToken, getRouteHistory);

// Cập nhật vị trí (từ app tài xế)
router.post("/update-location", updateLocation); 

export default router;