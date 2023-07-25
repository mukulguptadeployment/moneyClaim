import mongoose from "mongoose";
import GameModal from "../../Model/GameModal";

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
  const isAdmin = req.cookies.UserInfo && JSON.parse(req.cookies.UserInfo);
  console.log(isAdmin);
  if (isAdmin) {
    const Games = await GameModal.find({
      user: isAdmin._id,
    });
    if (Games) {
      res.status(200).json(Games);
    } else {
      res.status(403).json({
        message: "No Games Found",
      });
    }
  } else {
    req.status(403).send({
      msg: "UnAuthorized Access Your IP is now Blocked for admin login for next 24 hours.",
    });
  }
}
