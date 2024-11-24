import express from "express";
import { protect } from "../middleware/authMiddleware.js"; // Import the protect middleware
import {
  createEvent,
  getActiveEvents,
  applyForEvent,
  verifyPlayerForEvent,
  getEventsByOrganizer,
  getEventsByEventId,
  generateMatches,
  getMatches
} from "../controllers/eventController.js";

const router = express.Router();

// Apply middleware to routes that require protection
router.post("/create", protect, createEvent); // Organizer creates an event
router.get("/active", protect, getActiveEvents); // Player fetches active events
router.post("/:eventId/apply", protect, applyForEvent); // Player applies for an event
router.post("/:eventId/verify/:playerId", protect, verifyPlayerForEvent); // Organizer verifies players
router.get("/getEventsByOrganizer", protect, getEventsByOrganizer);
router.get("/getEventsByEventId/:eventId",getEventsByEventId);
router.post('/:eventId/generate-matches',generateMatches);
router.post('/:eventId/get-matches',getMatches);

export default router; // Use export default for your router
