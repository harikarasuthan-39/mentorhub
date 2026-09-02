import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as actionController from "../controllers/actionController";

const router = Router();
router.use(authenticate);

router.get("/", actionController.list);
router.post("/", authorize("MENTOR", "HOD"), actionController.create);
router.put("/:id", authorize("MENTOR", "HOD", "STUDENT"), actionController.update);

export default router;
