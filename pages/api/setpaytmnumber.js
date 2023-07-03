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
  const data = req.body && JSON.parse(req.body);
  console.log("Number", data);
  const isLoggedin = req.cookies.UserInfo && JSON.parse(req.cookies.UserInfo);
  if (isLoggedin.isAdmin && data) {
    const PaytmNum = new PaytmModal({
      number: data,
      date: new Date(),
    });
    const newNumber = await PaytmNum.save();
    res.status(200).send({ msg: "Sucess", Number: newNumber });
  } else {
    res.status(403).send({ message: "Unauthorised access" });
  }
}
