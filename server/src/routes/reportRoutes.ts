import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as reportController from "../controllers/reportController";

const router = Router();
router.use(authenticate, authorize("MENTOR", "HOD"));

router.get("/student/:id", reportController.studentReport);
router.get("/mentor/:id", reportController.mentorReport);
router.get("/monthly", reportController.monthlyReport);
router.get("/semester", reportController.semesterReport);
router.get("/issues", reportController.issuesReport);
router.get("/actions", reportController.actionsReport);

export default router;
