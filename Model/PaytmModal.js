import mongoose from "mongoose";

const Paytm = new mongoose.Schema({
  number: { type: String, required: true },
  date: { type: Date, required: true },
});

const PaytmNumber = mongoose.models.Paytm || mongoose.model("Paytm", Paytm);

export default PaytmNumber;
