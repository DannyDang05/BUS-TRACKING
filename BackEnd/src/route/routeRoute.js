import express from "express";
import {
  getAllRoutes,
  createRoute,
  getRouteDetail,
  updateRoute,
  deleteRoute
} from "../controller/routeController.js";
import verifyToken from "../middleWare/authMiddleware.js";
import requireRole from "../middleWare/requireRole.js";

const router = express.Router();


// Chỉ cho phép role admin
router.use(verifyToken, requireRole('admin'));

router.get("/", getAllRoutes);
router.post("/", createRoute);
router.get("/:id", getRouteDetail);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);

export default router;
