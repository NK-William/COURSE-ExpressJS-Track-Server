require("./models/User");
require("./models/track");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRouters = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();

app.use(bodyParser.json());
app.use(authRouters);
app.use(trackRoutes);

const mongoUri =
  "mongodb+srv://Track-Admin:789253@cluster0.msdgh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
});

// mongoose
//   .connect(mongoUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Database connected!"))
//   .catch((err) => console.log(err));

// connecting to mongo instance
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

// for error
mongoose.connection.on("error", (err) => {
  console.error("error connecting to mongo instance", err);
});

// when a get request is made to the root route ('/') of the application the method inside will run
// req -> represents a HTTP request
// res -> represents the outgoing response
app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
