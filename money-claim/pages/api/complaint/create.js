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

  const data = JSON.parse(req.body);
  
  const Compaint = new ComplaintModal({
    name: data.name,
    msg: data.msg,
  });

  const info = await Compaint.save();

  res.status(200).send({ msg: "Sucess", info });
}
