import express from "express";
import {
  getAllVehicles,
  createVehicle,
  getVehicleDetail,
  updateVehicle,
  deleteVehicle
} from "../controller/vehicleController.js";
import verifyToken from "../middleWare/authMiddleware.js";
import requireRole from "../middleWare/requireRole.js";

const router = express.Router();


// Chỉ cho phép role admin
router.use(verifyToken, requireRole('admin'));

router.get("/", getAllVehicles);
router.post("/", createVehicle);
router.get("/:id", getVehicleDetail);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
