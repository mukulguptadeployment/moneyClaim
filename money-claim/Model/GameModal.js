import mongoose from "mongoose";

const Game = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  game: [
    {
      number: { type: String, required: true },
      amount: { type: String, required: true },
    },
  ],

  date: { type: Date, required: true },
});

const GameModal = mongoose.models.Game || mongoose.model("Game", Game);

export default GameModal;
