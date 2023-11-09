const passport = require("passport");
const local = require("./localStrategy");

module.exports = () => {
  passport.serializeUser(function (user, cb) {
    const { id, username } = user;
    process.nextTick(function () {
      cb(null, { id, username });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  local();
};
