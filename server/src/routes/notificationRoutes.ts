import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as notificationController from "../controllers/notificationController";

const router = Router();
router.use(authenticate);

router.get("/", notificationController.list);
router.post("/compose", notificationController.broadcast);
router.post("/broadcast", notificationController.broadcast);
router.put("/:id/read", notificationController.markRead);
router.put("/read-all", notificationController.markAllRead);
router.delete("/:id", notificationController.remove);

export default router;
