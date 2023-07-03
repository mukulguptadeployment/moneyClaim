import mongoose from "mongoose";

const WinningNumberModel = new mongoose.Schema({
  number: { type: String, required: true },
  time: { type: Date, required: true },
});

const WinningNumber =
  mongoose.models.WinningNumber ||
  mongoose.model("WinningNumber", WinningNumberModel);

export default WinningNumber;
