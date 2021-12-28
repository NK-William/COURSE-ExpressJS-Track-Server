const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === "Bearer gfddfdvgdhfvgngbgfr..."

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in" });
  }

  // assigning only the token
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, "SECRET_KEY", async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in" });
    }

    // payload is the incrypted value into the toke long string (the incryption was performed in authRoutes.js)
    const { userId } = payload;

    // the following line tells mongoose to go and take a look at mongo DB collection, to find a user with a given ID and once
    // the ID is found then it will assign user details to a user variable defined below
    const user = await User.findById(userId);

    req.user = user;
    next();
  });
};
