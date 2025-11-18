import express from "express";
import { login, checkSession, logout } from "../controller/authController.js";
import verifyToken from "../middleWare/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
// router.get("/check-session", verifyToken, checkSession); 

export default router;