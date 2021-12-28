const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// pre-save hook
userSchema.pre("save", function (next) {
  // the user that we are trying to save is available as 'this'
  const user = this; // as long as  we used a function of a function key-word, the value of "this" is a "user" model.
  if (!user.isModified("password")) {
    // if the user has not modified their password the we don't salt anything
    return next();
  }

  // on sign up
  // now generating the salt and hashing it
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  }); // the number 10 is a reference to how complex the salt is that we're going to generate.
});

// on sign-in
userSchema.methods.comparePassword = function (candidatePassword) {
  // candidatePassword(just a parameter identity) is the password that a user is trying to login with.
  const user = this; // "this" retrieves the user stored inside the mongo db.
  return new Promise((resolve, reject) => {
    // below, the user.password is a salted and hashed password that is stored inside of Mongo db
    // comparing the password entered(candidatePassword) by the user and the one stored inside the database
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

mongoose.model("User", userSchema);
