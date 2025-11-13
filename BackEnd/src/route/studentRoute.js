import express from "express";
import { 
    getAllStudents, 
    createStudent, 
    updateStudent, 
    deleteStudent 
} from "../../../controllers/studentController.js";
import verifyToken from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken); // Bảo vệ tất cả route học sinh

router.get("/", getAllStudents);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;