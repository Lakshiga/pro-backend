import User from '../models/userModel.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Get all users
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const verifyOrganizer = async (req, res) => {
  const { id } = req.params;
  try {
    const organizer = await User.findById(id);
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }
    organizer.isVerified = true;
    await organizer.save();
    res.status(200).json({ message: 'Organizer verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying organizer' });
  }
};
