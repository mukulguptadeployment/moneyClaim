import cookies from "cookie";
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
  const data = req.body && JSON.parse(req.body);
  const isLoggedin = req.cookies.UserInfo && JSON.parse(req.cookies.UserInfo);
  if (isLoggedin) {
    console.log("Request body --> ", data);
    const game = new GameModal({
      user: isLoggedin._id,
      game: data.game,
      date: data.date,
    });
    const newgame = await game.save();
    res.status(200).send({ msg: "Sucess", Game: newgame });
  } else {
    res.status(403).send({ message: "Unauthorised access" });
  }
}
