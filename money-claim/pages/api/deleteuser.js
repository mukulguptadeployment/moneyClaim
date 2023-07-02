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
  const User = await Users.findById(data._id);

  if (User) {
    const deletedUser = await User.remove();
    res
      .status(200)
      .send({ message: "User deleted sucessfuly", User: deletedUser });
  } else {
    res.status(404).json({
      message: "User Not Found",
    });
  }
}
