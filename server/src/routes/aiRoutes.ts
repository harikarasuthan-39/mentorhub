import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as aiController from "../controllers/aiController";

const router = Router();
router.use(authenticate);

// Open to all authenticated roles (STUDENT, MENTOR, HOD)
router.post("/chat", aiController.chatWithMentorAI);

// Restricted to MENTOR and HOD for student risk and meeting analytics
router.post("/summarize-meeting", authorize("MENTOR", "HOD"), aiController.summarizeMeeting);
router.post("/risk-assessment", authorize("MENTOR", "HOD"), aiController.riskAssessment);
router.post("/intervention", authorize("MENTOR", "HOD"), aiController.intervention);
router.post("/analyze-issues", authorize("MENTOR", "HOD"), aiController.analyzeIssues);

export default router;
