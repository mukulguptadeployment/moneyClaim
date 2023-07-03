import nodemailer from "nodemailer";
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
  const data = req.body;
  console.log("id", data);
  const User = await Users.findOne({
    email: data,
  });

  if (User) {
    const pass = User.password;
    const Transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_APP_ID,
        pass: process.env.NEXT_PUBLIC_APP_PASS,
      },
    });
    const opt = {
      from: "Money Claim",
      to: data,
      subject: "OTP For Verification",
      text: `Your Passwor for login in moneyclaim is ${pass}. `,
    };

    Transporter.sendMail(opt, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info.response);
      }
    });

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
