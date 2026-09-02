import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as issueController from "../controllers/issueController";

const router = Router();
router.use(authenticate);

router.get("/", issueController.list);
router.post("/", authorize("MENTOR"), issueController.create);
router.put("/:id", authorize("MENTOR"), issueController.update);

export default router;
