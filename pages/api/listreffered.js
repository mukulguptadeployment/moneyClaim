import mongoose from "mongoose";
import Users from "../../Model/UserModel";

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
  const isAdmin =
    req.cookies.UserInfo && JSON.parse(req.cookies.UserInfo).isAdmin;
  if (isAdmin === "true") {
    const data = req.body && JSON.parse(req.body);
    console.log("Body Data", data);
    const userMail = data
      ? {
          refferedBy: data.reffer,
        }
      : {};
    const existUser = await Users.find(userMail);
    if (existUser) {
      res.status(200).json(existUser);
    } else {
      res.status(403).json({
        message: "Invalid Email or Password",
      });
    }
  } else {
    req.status(403).send({
      msg: "UnAuthorized Access Your IP is now Blocked for admin login for next 24 hours.",
    });
  }
}
