import express from "express";
import { 
    getAllUsers, 
    createUser, 
    getUserDetail, 
    updateUser, 
    deleteUser 
} from "../controller/userController.js";
import verifyToken from "../middleWare/authMiddleware.js";
import requireRole from "../middleWare/requireRole.js";

const router = express.Router();

// Chỉ admin mới được quản lý user
// router.use(verifyToken, requireRole('admin'));

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getUserDetail);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
