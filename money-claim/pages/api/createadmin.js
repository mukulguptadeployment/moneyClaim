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

  let userinfo = {
    name: "Admin",
    email: "admin@moneyclaim.com",
    password: "1234",
    isAdmin: true,
    phoneNumber: "9876543210",
  };

  var val = Math.floor(1000 + Math.random() * 9000);
  var val1 = Math.floor(1000 + Math.random() * 9000);
  const existUser = await Users.findOne({
    refferalCode: val,
  });
  if (existUser) {
    userinfo["refferalCode"] = val + val1;
  } else {
    userinfo["refferalCode"] = val;
  }
  console.log("New User Data", userinfo);
  const user = new Users(userinfo);

  const newUser = await user.save();
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("UserInfo", JSON.stringify(newUser), {
      httpOnly: false,
      maxAge: 60 * 60000,
      path: "/",
    })
  );

  res.status(200).json({
    message: "Account Created Sucessfully Please Login to Continue",
    user,
  });
}
