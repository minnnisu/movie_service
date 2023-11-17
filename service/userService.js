const userModel = require("../model/userModel");
const createError = require("http-errors");

exports.getUser = async function (id) {
  if (id === undefined) throw createError(400, "not_contain_nessary_body");

  const user = await userModel.getUser(id);
  if (user.length < 1) throw next(createError(404, "not_exist_user_error"));

  const fiteredUser = {
    id: user[0].id,
    name: user[0].name,
    email: user[0].email,
    telephone: user[0].telephone,
  };

  return fiteredUser;
};
