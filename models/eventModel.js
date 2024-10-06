import { Schema, model } from "mongoose";

const eventSchema = new Schema({
  event_name: { type: String, required: true },
  event_date: { type: Date, required: true },
  location: { type: String, required: true },
  organizer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  umpire_ids: [{ type: Schema.Types.ObjectId, ref: "User" }],
  players_applied: [{ type: Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: ["active", "completed"], default: "active" },
});

export default model("Event", eventSchema);
