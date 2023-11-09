const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const multer = require("multer");
const form_data = multer();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const passport = require("passport");
const passportConfig = require("./api/passport");
const authRouter = require("./api/routes/authRouter");

const app = express();
const port = 8080;

dotenv.config();
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(form_data.array());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // store: new MemoryStore({ checkPeriod: 1000 * 60 * 20 }),
    store: new SQLiteStore({ db: "session.db", dir: "./session" }),
    cookie: { maxAge: 3600000 }, // 1 hours (= 1 * 60 * 60 * 1000 ms)
  })
);

passportConfig();
app.use(passport.authenticate("session")); // authenticate the session.

app.use(function (req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !!msgs.length;
  req.session.messages = [];
  next();
});

app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status).send({ message: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
