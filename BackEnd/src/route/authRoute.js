import express from "express";
import { login, checkSession, logout } from "../../../controllers/authController.js";
import verifyToken from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/check-session", verifyToken, checkSession); // Bảo vệ route này

export default router;