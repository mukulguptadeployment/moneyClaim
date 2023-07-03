import mongoose from "mongoose";

const Complaint = new mongoose.Schema({
  name: { type: String, required: true },
  msg: { type: String, required: true },
});

const ComplaintModal = mongoose.models.Complaint || mongoose.model("Complaint", Complaint);

export default ComplaintModal;
