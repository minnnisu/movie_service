const userModel = require("../model/userModel");
const createError = require("http-errors");

exports.getUser = async function (req, res, next) {
  const user = await userModel.getUser(req.user);
  if (user.length > 0) {
    const data = {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      telephone: user[0].telephone,
    };

    return res.status(200).json(data);
  }

  return next(createError(404, "not_exist_user_error"));
};
