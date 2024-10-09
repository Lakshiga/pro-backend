import Router from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { verifyOrganizer, getAllUsers } from "../controllers/adminController.js";

const router = Router();

router.get("/users", protect, adminOnly, getAllUsers); // Get all users
router.post("/verify-organizer/:userId", protect, adminOnly, verifyOrganizer); // Admin verifies organizer

export default router;
