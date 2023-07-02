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
  const isAdmin =
    req.cookies.UserInfo && JSON.parse(req.cookies.UserInfo).isAdmin;
  if (isAdmin === "true") {
    const Games = await GameModal.find({});
    const finalinfo=[];
    for (let i = 1; i <= Games.length; i++) {
      let gameinfo = Games.filter((x) => x.game.filter((y) => (y.number = i)));
      const arrayData = gameinfo.map((item) => item.game);
      const amountarr = arrayData.map((x) => x.map((y) => y.amount));
      let total = 0;
      for (let i = 0; i < amountarr.length; i++) {
        let sum = 0;
        if (amountarr[i].length > 0) {
          sum = amountarr[i].reduce((a, b) => parseInt(a) + parseInt(b));
        }
        total += parseInt(sum);
      }
      if(arrayData.length>0){
        finalinfo.push({
            number:arrayData[i],
            amount:total
          })
      }
      
    }

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
