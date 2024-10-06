import { Schema, model } from "mongoose";

const matchSchema = new Schema({
  event_id: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  player1_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  player2_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  umpire_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  match_date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["scheduled", "completed"],
    default: "scheduled",
  },
});

export default model("Match", matchSchema);
