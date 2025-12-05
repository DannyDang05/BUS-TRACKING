import express from "express";
import { getDashboardStats, getRecentActivities } from "../controller/dashboardController.js";
import verifyToken from "../middleWare/authMiddleware.js";

const router = express.Router();

// GET /api/v1/dashboard/stats - Lấy thống kê tổng quan
router.get("/stats", verifyToken, getDashboardStats);

// GET /api/v1/dashboard/recent-activities - Lấy hoạt động gần đây
router.get("/recent-activities", verifyToken, getRecentActivities);

export default router;
