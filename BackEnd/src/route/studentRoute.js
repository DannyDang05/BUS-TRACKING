import express from "express";
import { 
    getAllStudents, 
    createStudent, 
    updateStudent, 
    deleteStudent 
} from "../controller/studentController.js";
import verifyToken from "../middleWare/authMiddleware.js";

const router = express.Router();

// router.use(verifyToken); 

router.get("/", getAllStudents);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;