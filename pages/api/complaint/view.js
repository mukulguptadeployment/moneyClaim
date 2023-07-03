import mongoose from "mongoose";
import ComplaintModal from "../../../Model/ComplaintModal";

export default async function handler(req, res) {
  if (mongoose.connection.readyState !== 1) {
    mongoose
      .connect(process.env.NEXT_PUBLIC_DB_ROOT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((_) => {
        console.log("connected to mongodb");
      })
      .catch((error) => {
        console.log(error.reason);
      });
  }

  const Compaint = await ComplaintModal.find({});

  res.status(200).send(Compaint);
}
