import  Match  from "../models/matchModel.js";

// Create a match (Organizer)
export const createMatch = async (req, res) => {
  const { event_id, player1_id, player2_id, umpire_id, match_date } = req.body;

  try {
    const match = await Match.create({
      event_id,
      player1_id,
      player2_id,
      umpire_id,
      match_date
    });

    await match.save();
    res.status(201).json({ message: 'Match created successfully', match });
  } catch (error) {
    res.status(500).json({ message: 'Error creating match', error });
  }
};

// Get all matches for an event
export const getMatchesForEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const matches = await Match.find({ event_id: eventId });
    res.json(matches);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Assign players to a match (Organizer)
export const assignPlayersToMatch = async (req, res) => {
  const { matchId, player1_id, player2_id } = req.body;

  try {
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    match.player1_id = player1_id;
    match.player2_id = player2_id;

    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



export const getMatchesForPlayer = async (req, res) => {
  const { playerId } = req.user._id.toString();

  try {
    const matches = await Match.find({
      $or: [{ player1_id: playerId }, { player2_id: playerId }],
    });
    res.json(matches);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific match by ID
export const getMatchById = async (req, res) => {
  const { matchId } = req.params;

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Umpire adds score to a match
export const addScoreToMatch = async (req, res) => {
  const { matchId } = req.params;
  const { score, comments } = req.body;

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    match.score = score;
    match.comments = comments;

    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Organizer or Umpire gets scores for a match
export const getMatchScores = async (req, res) => {
  const { matchId } = req.params;

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json({ score: match.score, comments: match.comments });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Organizer can update match details (e.g., reschedule, change umpire)
export const updateMatch = async (req, res) => {
  const { matchId } = req.params;
  const { umpire_id, match_date } = req.body;

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    match.umpire_id = umpire_id || match.umpire_id;
    match.match_date = match_date || match.match_date;

    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
