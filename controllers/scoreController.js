import matchModel from "../models/matchModel.js";
import  Score  from "../models/scoreModel.js";


// Add score for a match (Umpire)
export const addScore = async (req, res) => {
  const { match_id, player1_score, player2_score } = req.body;

  try {
    const score = await Score.create({
      match_id,
      player1_score,
      player2_score,
      umpire_id: req.user._id,
    });

    res.status(201).json(score);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMatchScore = async (req, res) => {
  const { matchId } = req.params;
  const { player1_score, player2_score } = req.body; // Updated field names

  try {
    // Find the match by match_id
    const score = await Score.findOne({ match_id: matchId });
    if (!score) return res.status(404).json({ message: "Score not found" });

    // Update player scores
    if (player1_score !== undefined) score.player1_score = player1_score;
    if (player2_score !== undefined) score.player2_score = player2_score;

    // Save the updated score
    await score.save();

    res.json({ message: "Scores updated successfully", score });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getMatchDetailsByEventId = async (req, res) => {
  try {
    const { id } = req.params; // Get the event_id from the request parameters

    // Fetch match details and populate event details
    const match = await matchModel.findOne({ event_id: id })
      .populate({
        path: 'event_id', // Populating the event_id reference
        select: 'name' // Only select the 'name' field from the Event model
      })
       // Populate related players and umpire details
      .exec();

    // If no match is found
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Send the match details as the response
    res.status(200).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const getMatchesAndScoresByUmpireId = async (req, res) => {
  const { umpire_id } = req.params;

  try {
    // Fetch scores where umpire_id matches
    const scores = await Score.find({ umpire_id });

    if (!scores || scores.length === 0) {
      return res.status(404).json({ message: 'No matches found for the given umpire ID' });
    }

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get score for a match
export const getMatchScore = async (req, res) => {
  const { matchId } = req.params;

  try {
    const score = await Score.findOne({ match_id: matchId });
    if (!score) return res.status(404).json({ message: "Score not found" });

    res.json(score);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
