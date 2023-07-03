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
    console.log("Admin Check")
  const isAdmin =
    req.cookies.UserInfo && JSON.parse(req.cookies.UserInfo).isAdmin;
  console.log("AdminCheckPass")
    if (isAdmin) {
    const winNum = await WinningNumber.find({});
    console.log(winNum)
    res.status(200).send(winNum);
  } else {
    res.status(403).send({ message: "Unauthorised access" });
  }
}
