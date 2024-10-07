import Event from "../models/eventModel.js"; // Import the Event model

// Helper functions for draw generation
const generateKnockoutDraw = (players) => {
  let shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
  let matches = [];
  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    if (i + 1 < shuffledPlayers.length) {
      matches.push(`${shuffledPlayers[i]} vs ${shuffledPlayers[i + 1]}`);
    }
  }
  return matches;
};

const generateLeagueDraw = (players) => {
  const matches = [];
  const numPlayers = players.length;

  for (let i = 0; i < numPlayers; i++) {
    for (let j = i + 1; j < numPlayers; j++) {
      matches.push(`${players[i]} vs ${players[j]}`);
    }
  }

  return matches;
};

// Create an event (Organizers only)
export const createEvent = async (req, res) => {
  const { event_name, event_date, location, players, matchType } = req.body;

  // Validate request body
  if (!event_name || !event_date || !location || !players || !matchType) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    // Generate draw based on match type
    let draw;
    if (matchType === 'knockout') {
      draw = generateKnockoutDraw(players);
    } else {
      draw = generateLeagueDraw(players);
    }

    // Create a new event document
    const event = await Event.create({
      event_name,
      event_date,
      location,
      organizer_id: req.user._id, // Assuming req.user contains the authenticated user
      players_applied: [],
      umpire_ids: [],
      status: "active",
      draw // Add the generated draw to the event document
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error' });
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
      res.status(400).json({ message: "Player has not applied for this event" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
