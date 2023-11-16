const passport = require("passport");
const createError = require("http-errors");
const authService = require("../service/authService");

exports.localLogin = function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return next(createError(400, "not_contain_nessary_body"));
  }

  passport.authenticate("local", function (err, user, userError) {
    // new LocalStrategy(async function verify(username, password, cb){...}) 이후 작업
    if (err) {
      console.error(err);
      return next(createError(500, "login_error"));
    }

    if (!user) {
      return next(userError);
    }

    // user정보 session storage에 저장
    return req.login(user, (err) => {
      if (err) {
        console.error(err);
        return next(createError(500, "login_error"));
      }

      res.redirect("/");
    });
  })(req, res, next);
};

exports.logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(createError(500, "logout_error"));
    }
    res.redirect("/");
  });
};

exports.signup = async function (req, res, next) {
  try {
    await authService.signup(req.body);
    return res.redirect("/");
  } catch (error) {
    next(error);
  }
};

exports.checkId = async function (req, res, next) {
  try {
    await authService.checkId(req.body.id);
    return res.status(200).json({ message: "this ID is valid" });
  } catch (error) {
    next(error);
  }
};
