import { Schema, model } from "mongoose";

const eventSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  sport: { type: String, required: true },
  ageGroup: { type: String, required: true },
  matchType: { type: String, enum: ['knockout', 'league'], required: true },
  players: [{ type: String, required: true }], // Array of player names
  organizer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  umpire_ids: [{ type: Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: ["active", "completed"], default: "active" },
});

export default model("Event", eventSchema);
