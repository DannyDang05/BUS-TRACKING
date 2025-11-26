import express from "express";
import { getStudentByParent, getParentInformation, getNotificationsByParent } from "../controller/parentController.js";
const router = express.Router();

// Define your parent-related routes here
router.get("/:parentId", getParentInformation);
router.get("/:parentId/students", getStudentByParent);
router.get("/:parentId/notifications", getNotificationsByParent);
export default router;