import  User  from "../models/userModel.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user profile (e.g., Organizer updates their profile)
export const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPlayersByIds = async (req, res) => {
  const { playerIds } = req.body;

  try {
    const players = await User.find({
      _id: { $in: playerIds },
      role: "player",
    });

    if (!players.length) {
      return res.status(404).json({ message: "No players found" });
    }
    
    const playerDetails = players.map((player) => ({
      id: player._id,
      username: player.username,
      email: player.email,
      isVerified: player.isVerified,
      role: player.role,
    }));

    res.json(playerDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

