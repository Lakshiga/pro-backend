import  Router  from "express";
import  {protect}  from "../middleware/authMiddleware.js";
import { addScore, getMatchScore,getMatchesAndScoresByUmpireId,getMatchDetailsByEventId,updateMatchScore } from "../controllers/scoreController.js";

const router = Router();

router.post("/add", protect, addScore); 
router.get('/scores/umpire/:umpire_id', getMatchesAndScoresByUmpireId);
router.get('/match/:id', getMatchDetailsByEventId)
router.get("/:matchId", protect, getMatchScore); // Get score for a specific match
router.put("/updatescore/:matchId", updateMatchScore);

export default router;
