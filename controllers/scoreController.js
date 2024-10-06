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
