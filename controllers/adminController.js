import User from "../models/userModel.js";

// Get all users (including organizers)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify organizer by admin
export const verifyOrganizer = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "organizer") {
      return res.status(404).json({ message: "Organizer not found" });
    }

    user.isVerified = true; // Verify organizer
    await user.save();
    res.json({ message: "Organizer verified" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
