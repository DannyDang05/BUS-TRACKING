import express from "express";
import { 
    getAllDrivers, 
    createNewDriver, 
    updateDriver, 
    deleteDriver, 
    getDriverDetail 
} from "../../../controllers/driverController.js";
import verifyToken from "../../../middleware/authMiddleware.js";

const router = express.Router();

// Tất cả các route tài xế đều cần xác thực
router.use(verifyToken);

router.get("/", getAllDrivers);
router.post("/", createNewDriver);
router.get("/:id", getDriverDetail);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);

export default router;