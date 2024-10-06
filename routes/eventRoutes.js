import  Router  from "express";
import  protect  from "../middleware/authMiddleware.js";
import {
  createEvent,
  getActiveEvents,
  applyForEvent,
  verifyPlayerForEvent,
} from "../controllers/eventController.js";

const router = Router();

router.post("/create", protect, createEvent); // Organizer creates an event
router.get("/active", protect, getActiveEvents); // Player fetches active events
router.post("/:eventId/apply", protect, applyForEvent); // Player applies for an event
router.post("/:eventId/verify/:playerId", protect, verifyPlayerForEvent); // Organizer verifies players

export default router;
