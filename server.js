import express from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // Importing admin
import eventRoutes from './routes/eventRoutes.js'; // Importing event
import matchRoutes from './routes/matchRoutes.js'; // Importing
import scoreRoutes from './routes/scoreRoutes.js'; // Importing
import umpireRoutes from './routes/umpireRoutes.js'; // Importing
import userProfileRoutes from './routes/userProfileRoutes.js'; // Importing user
import cors from "cors";

config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/umpire", umpireRoutes);
app.use("/api/user-profile", userProfileRoutes);

// MongoDB Connection
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(`Error: ${error.message}`));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
