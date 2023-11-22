const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const multer = require("multer");
const form_data = multer();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const passport = require("passport");
const passportConfig = require("./api/passport");
const HttpError = require("./error/HttpError");

const authApiRouter = require("./api/routes/apis/authRouter");
const userPageRouter = require("./api/routes/pages/userRouter");
const paymentApiRouter = require("./api/routes/apis/paymentRouter");
const moviePageRouter = require("./api/routes/pages/movieRouter");
const indexPageRouter = require("./api/routes/pages/indexRouter");
const paymentPageRouter = require("./api/routes/pages/paymentRouter");

const app = express();
const port = 8080;

dotenv.config();
app.set("view engine", "ejs");
app.use("/", express.static(path.join(__dirname, "public")));
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

app.use("/", indexPageRouter);
app.use("/user", userPageRouter);
app.use("/movie", moviePageRouter);
app.use("/payment", paymentPageRouter);
app.use("/api/auth", authApiRouter);
app.use("/api/payment", paymentApiRouter);

app.use(function (req, res, next) {
  res.status(404).render("error404");
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof HttpError) {
    if (
      err.option?.isShowErrPage === true &&
      err.option?.isShowCustomeMsg === true
    ) {
      return res.status(err.status).render("error.ejs", {
        err_code: err.status,
        err_msg: err.option.CustomeMsg,
      });
    }

    if (err.option?.isShowErrPage === true) {
      return res.status(err.status).render("error.ejs", {
        err_code: err.status,
        err_msg:
          "일시적인 오류이거나 올바르지 않은 접근입니다. 잠시 후 다시 시도해 주세요.",
      });
    }

    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({ message: "server_error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
