import { Schema, model } from "mongoose";

const scoreSchema = new Schema({
  match_id: { type: Schema.Types.ObjectId, ref: "Match", required: true },
  player1_score: { type: Number, required: true, default: 0 },
  player2_score: { type: Number, required: true , default:0},
  umpire_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recorded_at: { type: Date, default: Date.now },
});

export default model("Score", scoreSchema);
