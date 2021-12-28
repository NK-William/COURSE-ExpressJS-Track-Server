const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

const router = express.Router();

// signup
router.post("/signup", async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();

    // creating a token
    const token = jwt.sign({ userId: user._id }, "SECRET_KEY");
    res.send({ token: token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

// signin
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }

  try {
    await user.comparePassword(password);
    // creating a token
    const token = jwt.sign({ userId: user._id }, "SECRET_KEY");
    res.send({ token: token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

module.exports = router;
