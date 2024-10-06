import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { assignUmpireToEvent } from'../controllers/umpireController.js';

const router = Router();

// Assign umpire to an event (Organizer only)
router.post('/:eventId/assign', protect, assignUmpireToEvent);

export default router;
