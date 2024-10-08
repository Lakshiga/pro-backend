import express  from "express";
// import { protect } from "../middleware/authMiddleware.js";
import {
  createEvent,
  getActiveEvents,
  applyForEvent,
  verifyPlayerForEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/create", createEvent); // Organizer creates an event
router.get("/active", getActiveEvents); // Player fetches active events
router.post("/:eventId/apply", applyForEvent); // Player applies for an event
router.post("/:eventId/verify/:playerId", verifyPlayerForEvent); // Organizer verifies players

export default router;
