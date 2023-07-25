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
  const data = req.cookies.UserInfo && JSON.parse(req.cookies.UserInfo);
  console.log(data);
  const User = await Users.findById(data._id);

  if (User) {
    User.isAdmin = data.isAdmin || User.isAdmin;
    User.name = data.name.toLowerCase() || User.name;
    User.email = data.email.toLowerCase() || User.email;
    User.refferalCode = data.refferalCode.toLowerCase() || User.refferalCode;
    User.password = JSON.parse(req.body).password;
    User.phoneNumber = data.phoneNumber || User.phoneNumber;

    const newUser = await User.save();
    console.log("New User Data", newUser);

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("UserInfo", JSON.stringify(newUser), {
        httpOnly: false,
        path: "/",
      })
    );

    res.status(200).json({
      message: "Password Changed SucessFully",
      User,
    });
  } else {
    res.status(404).json({
      message: "User Not Found",
    });
  }
}
