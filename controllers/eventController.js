import Event from "../models/eventModel.js"; // Import the Event model
import Match  from "../models/matchModel.js"; // Adjust based on actual export
import { generateMatchDraw }  from '../utils/generateMatchDraw.js'; // Ensure this is correct as well

// Helper function to generate matches based on match type
const generateMatches = (players, matchType, eventId) => {
  const matches = [];

  if (matchType === 'league') {
    // For league format: Each player plays against each other
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        matches.push({ player1: players[i], player2: players[j], event: eventId });
      }
    }
  } else if (matchType === 'knockout') {
    // For knockout format: Pair players sequentially
    let shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (shuffledPlayers[i + 1]) { // Ensure there's a second player
        matches.push({ player1: shuffledPlayers[i], player2: shuffledPlayers[i + 1], event: eventId });
      }
    }
  }

  return matches;
};

// Create an event (Organizers only)
export const createEvent = async (req, res) => {
  const { name, date, sport, ageGroup, matchType, players } = req.body;

  // Validate input
  if (!name || !date || !sport || !ageGroup || !matchType || !players || players.length < 2) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    // Create the event
    const newEvent = new Event({ name, date, sport, ageGroup, matchType, players });
    await newEvent.save();

    // Generate matches
    const matches = generateMatches(players, matchType, newEvent._id);
    await Match.insertMany(matches);

    // Add matches to the event
    newEvent.matches = matches.map(match => match._id);
    await newEvent.save();

    // Generate the match draw image and save it
    const matchDrawImagePath = `./match_draws/${name.replace(/\s+/g, '_')}_draw.png`;
    await generateMatchDraw(matches, matchDrawImagePath); // Pass matches and name to your function

    // Save the path of the match draw image to the event
    newEvent.matchDraw = matchDrawImagePath;
    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
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
    console.error('Error fetching events:', error);
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
    console.error('Error applying for event:', error);
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
    console.error('Error verifying player:', error);
    res.status(400).json({ message: error.message });
  }
};
