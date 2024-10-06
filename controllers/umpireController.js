import { Event } from "../models/eventModel.js";

// Assign an umpire to an event
exports.assignUmpireToEvent = async (req, res) => {
  const { eventId } = req.params;
  const { umpireId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Add umpire to the event if not already assigned
    if (!event.umpire_ids.includes(umpireId)) {
      event.umpire_ids.push(umpireId);
      await event.save();
      res.json({ message: "Umpire assigned to event" });
    } else {
      res.status(400).json({ message: "Umpire already assigned" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
