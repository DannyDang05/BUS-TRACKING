import express from "express";
import { 
    getAllDrivers, 
    createNewDriver, 
    updateDriver, 
    deleteDriver, 
    getDriverDetail 
} from "../controller/driverController.js";
import verifyToken from "../middleWare/authMiddleware.js";
import requireRole from "../middleWare/requireRole.js";

const router = express.Router();


// Chỉ cho phép role driver
router.use(verifyToken, requireRole('driver'));

router.get("/", getAllDrivers);
router.post("/", createNewDriver);
router.get("/:id", getDriverDetail);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);

export default router;