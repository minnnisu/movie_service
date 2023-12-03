const passport = require("passport");
const local = require("./localStrategy");
const google = require("./googleStrategy");

module.exports = () => {
  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, user.id); // sessiond에 user.id 저장
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user); // req.user에 저장
    });
  });

  local();
  google();
};
