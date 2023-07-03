import cookies from "cookie";
import mongoose from "mongoose";
import WinningNumber from "../../Model/WinnerNumber";

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
  const isAdmin =
    req.cookies.UserInfo && JSON.parse(req.cookies.UserInfo).isAdmin;
  if (isAdmin) {
    const winNum = new WinningNumber({
      number: data.num,
      time: data.time,
    });
    const newnum = await winNum.save();
    res.status(200).send({ msg: "Num Set Sucess", num: newnum });
  } else {
    res.status(403).send({ message: "Unauthorised access" });
  }
}
