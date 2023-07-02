import cookie from "cookie";
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
  const data = req.body && JSON.parse(req.body);
  const existUser = await Users.findOne({
    email: data.username.toLowerCase(),
    password: data.password.toLowerCase(),
  });
  if (existUser) {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("UserInfo", JSON.stringify(existUser), {
        httpOnly: false,
        maxAge: 60 * 60000,
        path: "/",
      })
    );
    res.status(200).json({
      message: "Sucess",
    });
  } else {
    res.status(403).json({
      message: "Invalid Email or Password",
    });
  }
}
