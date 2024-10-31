import Event from "../models/eventModel.js";
import Match from "../models/matchModel.js";


// Create an event (Organizers only)
export const createEvent = async (req, res) => {
  const { name, date, sport, ageGroup, matchType, players } = req.body;
console.log(req.body);

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

    if (!event.players.includes(req.user._id)) {
      event.players.push(req.user._id);
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

    if (event.players.includes(playerId)) {
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

export const getEventsByEventId = async (req, res) => {
  const {eventId} = req.params;

  try {
    const events = await Event.findOne({ _id: eventId });
    res.json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const generateMatches =async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId);
    if (!event || !event.players || event.players.length < 2 || !event.umpire_ids || event.umpire_ids.length === 0) {
      return res.status(404).json({ error: "Event not found, not enough players, or no umpires assigned" });
    }

    const shuffledPlayers = event.players.sort(() => 0.5 - Math.random());
    const matchPairs = [];

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (i + 1 < shuffledPlayers.length) {
        matchPairs.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
      }
    }

    const getRandomUmpire = () => {
      const randomIndex = Math.floor(Math.random() * event.umpire_ids.length);
      return event.umpire_ids[randomIndex];
    };

    const createdMatches = [];
    for (const [player1, player2] of matchPairs) {
      const match = new Match({
        event_id: event._id,
        player1_id: player1,
        player2_id: player2,
        umpire_id: getRandomUmpire(),
        match_date: event.date,
        status: 'scheduled',
      });
      await match.save();
      createdMatches.push(match);
    }

    res.status(201).json({ message: "Matches created successfully", matches: createdMatches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate matches" });
  }
};
