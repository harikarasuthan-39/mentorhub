import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as exportController from "../controllers/exportController";

const router = Router();
router.use(authenticate, authorize("MENTOR", "HOD"));

router.get("/student/:id/pdf", exportController.studentPdf);
router.get("/student/:id/excel", exportController.studentExcel);
router.get("/monthly/pdf", exportController.monthlyPdf);
router.get("/monthly/excel", exportController.monthlyExcel);

export default router;
