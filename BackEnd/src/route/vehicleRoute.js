import express from "express";
import {
  getAllVehicles,
  createVehicle,
  getVehicleDetail,
  updateVehicle,
  deleteVehicle
} from "../controller/vehicleController.js";
import verifyToken from "../middleWare/authMiddleware.js";

const router = express.Router();

// router.use(verifyToken);

router.get("/", getAllVehicles);
router.post("/", createVehicle);
router.get("/:id", getVehicleDetail);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
