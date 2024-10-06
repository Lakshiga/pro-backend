import  User  from "../models/userModel.js";

// Verify organizer by admin
exports.verifyOrganizer = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "organizer") {
      return res.status(404).json({ message: "Organizer not found" });
    }

    user.isVerified = true;
    await user.save();
    res.json({ message: "Organizer verified" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify umpire by admin
exports.verifyUmpire = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "umpire") {
      return res.status(404).json({ message: "Umpire not found" });
    }

    user.isVerified = true;
    await user.save();
    res.json({ message: "Umpire verified" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
