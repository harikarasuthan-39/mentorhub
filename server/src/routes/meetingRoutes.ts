import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as meetingController from "../controllers/meetingController";

const router = Router();
router.use(authenticate);

router.get("/", meetingController.list);
router.get("/:id", meetingController.getById);
router.post("/", authorize("MENTOR"), meetingController.create);

export default router;
