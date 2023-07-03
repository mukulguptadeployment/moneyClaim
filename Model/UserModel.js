import mongoose from "mongoose";

const user = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refferalCode: { type: String, unique: true, required: true },
  isAdmin: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  refferedBy: { type: String, required: false },
});

const Users = mongoose.models.Users || mongoose.model("Users", user);

export default Users;
