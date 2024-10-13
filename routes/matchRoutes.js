import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createMatch,
  getMatchesForEvent,
  assignPlayersToMatch,
  getMatchById,
  addScoreToMatch,
  getMatchScores,
  updateMatch,
} from "../controllers/matchController";

const router = express.Router();

// Match management
router.post("/create", protect, createMatch); // Organizer creates a match
router.get("/event/:eventId", protect, getMatchesForEvent); // Organizer gets matches for an event
router.post("/assign", protect, assignPlayersToMatch); // Organizer assigns players to a match

// Match details and score management
router.get("/:matchId", protect, getMatchById); // Get match details by ID
router.put("/:matchId/score", protect, addScoreToMatch); // Umpire adds score to match
router.get("/:matchId/score", protect, getMatchScores); // Organizer/Umpire gets scores for a match

// Organizer can update match details (reschedule, assign umpire, etc.)
router.put("/:matchId/update", protect, updateMatch);

module.exports = router;