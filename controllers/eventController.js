import Event from "../models/eventModel.js";

// Create an event (Organizers only)
export const createEvent = async (req, res) => {
  const { name, date, sport, ageGroup, matchType, players } = req.body;

  try {
    const event = await Event.create({
      name,
      date,
      sport,
      ageGroup,
      matchType,
      players,
      organizer_id: req.user._id,
      status: "active",
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch all active events (Players can view)
export const getActiveEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "active" });
    res.json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Apply for an event (Players)
export const applyForEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.players_applied.includes(req.user._id)) {
      event.players_applied.push(req.user._id);
      await event.save();
    }

    res.json({ message: "Applied to event successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify players for an event (Organizers)
export const verifyPlayerForEvent = async (req, res) => {
  const { eventId, playerId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.players_applied.includes(playerId)) {
      res.json({ message: `Player ${playerId} verified for event` });
    } else {
      res
        .status(400)
        .json({ message: "Player has not applied for this event" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEventsByOrganizer = async (req, res) => {
  const organizerId = req.user._id;

  try {
    const events = await Event.find({ organizer_id: organizerId });
    res.json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
