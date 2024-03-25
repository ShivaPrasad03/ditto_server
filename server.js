const express = require("express");
const mongoose = require("mongoose");
const User = require("./model/user_model");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());
mongoose
  .connect(
    `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@atlascluster.ci2lv2t.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`
  )
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  return res.send("hello new wenb");
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const bool = await User.findOne({ email });
  if (bool) {
    return res
      .status(400)
      .send({ message: "This email is already registered with Ditto." });
  }
  const new_data = new User({ username, email, password });
  new_data.save();
  return res
    .status(200)
    .send({ message: "Your Ditto Account Created Successfully!!" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const data = await User.findOne({ email });

  if (!data) {
    return res
    .status(401)
    .send({message:"The Details You Entered Are Incorrect"});
  }
  if (password !== data.password) {
    return res.status(401).send({message:"The Password You Entered is Incorrect"});
  }
  const payload = {
    user: {
      id: data.id,
    },
  };
  jwt.sign(payload, "jwtToken", { expiresIn: 3600000 }, (err, token) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.send({ token });
  });

});

app.listen(3001, () => console.log("server started"));
