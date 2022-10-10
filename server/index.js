require("dotenv").config({ path: ".env" });
const MONGODB_URL = process.env.MONGODB_URL;

const cors = require("cors");

const express = require("express");
const session = require("express-session");
const FireStore = require("session-file-store")(session);

const app = express();
const fileStoreOptions = {};

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(
  session({
    store: new FireStore(fileStoreOptions),
    secret: "@signupapp",
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //   path: "/",
    //   maxAge: null,
    //   sameSite: "none",
    //   secure: true,
    // },
  })
);

const userRouter = require("./routes/User");
// 매우 중요...
app.use("/user", userRouter);

const port = 8000;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    const mongoose = require("mongoose");

    mongoose
      .connect(MONGODB_URL, { useNewUrlParser: true })
      .then(() => console.log("connected"))
      .catch((err) => console.log("failed connection cause", err));
  }
});
