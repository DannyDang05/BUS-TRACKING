import express from "express";
import {
  getAllRoutes,
  createRoute,
  getRouteDetail,
  updateRoute,
  deleteRoute
} from "../controller/routeController.js";
import verifyToken from "../middleWare/authMiddleware.js";

const router = express.Router();

// router.use(verifyToken);

router.get("/", getAllRoutes);
router.post("/", createRoute);
router.get("/:id", getRouteDetail);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);

export default router;
