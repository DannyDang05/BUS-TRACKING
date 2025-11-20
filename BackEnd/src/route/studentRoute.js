import express from "express";
import { 
    getAllStudents, 
    createStudent, 
    updateStudent, 
    deleteStudent 
} from "../controller/studentController.js";
import verifyToken from "../middleWare/authMiddleware.js";
import requireRole from "../middleWare/requireRole.js";

const router = express.Router();


// Chỉ cho phép role admin
router.use(verifyToken, requireRole('admin'));

router.get("/", getAllStudents);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;