const userModel = require("../model/userModel");
const HttpError = require("../error/HttpError");
const common = require("../model/common");

exports.getUser = async function (id) {
  const user = await userModel.getUser(id);
  if (user.length < 1) throw new HttpError(404, "not_exist_user_error");

  const fiteredUser = {
    id: user[0].id,
    name: user[0].name,
    email: user[0].email,
    telephone: user[0].telephone,
  };

  return fiteredUser;
};

exports.getOrderList = async function (id) {
  const orderList = await common.getOrderInfoByUserID(id);
  return orderList;
};
