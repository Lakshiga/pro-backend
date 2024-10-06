import  Router  from "express";
import  {protect}  from "../middleware/authMiddleware.js";
import { addScore, getMatchScore } from "../controllers/scoreController.js";

const router = Router();

router.post("/add", protect, addScore); // Umpire adds score for a match
router.get("/:matchId", protect, getMatchScore); // Get score for a specific match

export default router;
