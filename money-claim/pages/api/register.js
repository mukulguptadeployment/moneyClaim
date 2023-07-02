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
  const data = req.cookies.userData && JSON.parse(req.cookies.userData);
  if (data) {
    let userinfo = {
      name: data.name.toLowerCase(),
      email: data.username.toLowerCase(),
      password: data.password,
      isAdmin: false,
      phoneNumber: data.contactnumber,
      refferedBy:data.refferCode,
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
try{
  const newUser = await user.save();
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("UserInfo", JSON.stringify(newUser), {
      httpOnly: false,
      path: "/",
    })
  );
  if (data.password !== data.confirmpassword) {
    res.status(403).json({
      message: "Password and confirm password should be same",
    });
  } else {
    res.status(200).json({
      message: "Account Created Sucessfully Please Login to Continue",
      user,
    });
  }
}catch(err){
  res.status(409).json({
    message: "Account with this email already exist try with new email",
  });
}
    
  } else {
    res.status(500).send({ E01: "Cookie Not Found" });
  }
}
