import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { verifyOrganizer, verifyUmpire } from "../controllers/adminController.js";

const router = Router();

router.post("/verify-organizer/:userId", protect, adminOnly, verifyOrganizer); // Admin verifies organizer
router.post("/verify-umpire/:userId", protect, adminOnly, verifyUmpire); // Admin verifies umpire

export default router;
