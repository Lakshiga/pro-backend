import  Router  from "express";
import  {protect}  from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  getPlayersByIds,
  getumpiresByIds,
} from "../controllers/userProfileController.js";

const router = Router();

router.get("/profile", protect, getUserProfile); // Get current user profile
router.put("/profile", protect, updateUserProfile); // Update user profile
router.post("/list", getPlayersByIds);
router.post("/umpire-list", getumpiresByIds);

export default router;
