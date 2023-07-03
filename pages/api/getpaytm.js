import cookies from "cookie";
import mongoose from "mongoose";
import PaytmModal from "../../Model/PaytmModal";

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

  const paytmNum = await PaytmModal.find({});
  paytmNum[paytmNum.length];
  res
    .status(200)
    .send({ msg: "Sucess", Number: paytmNum[paytmNum.length - 1] });
}
