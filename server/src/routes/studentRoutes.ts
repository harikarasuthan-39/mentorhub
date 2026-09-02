import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as studentController from "../controllers/studentController";

const router = Router();
router.use(authenticate);

router.get("/", studentController.list);
router.get("/:id", studentController.getById);
router.get("/:id/financial", studentController.getFinancial);
router.post("/", authorize("MENTOR", "HOD"), studentController.create);
router.put("/:id", authorize("MENTOR", "HOD"), studentController.update);
router.delete("/:id", authorize("MENTOR", "HOD"), studentController.remove);

export default router;
