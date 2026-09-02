import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as messageController from "../controllers/messageController";

const router = Router();

router.use(authenticate);

router.get("/conversations", messageController.getConversations);
router.get("/contacts", messageController.getContacts);
router.get("/unread-count", messageController.getUnreadCount);
router.get("/:otherUserId", messageController.getMessages);
router.post("/", messageController.sendMessage);
router.put("/:otherUserId/read", messageController.markRead);

export default router;
