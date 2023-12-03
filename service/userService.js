const userModel = require("../model/userModel");
const HttpError = require("../error/HttpError");
const authService = require("../service/authService");
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

exports.updateUser = async function (userId, info) {
  const { name, email, telephone } = info;
  if (name === undefined || email === undefined || telephone === undefined) {
    throw new HttpError(400, "not_contain_nessary_body");
  }

  const user = await userModel.getUser(userId);
  if (user.length < 1) throw new HttpError(404, "not_exist_user_error");

  const patternCheckList = [
    {
      type: "email",
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      target: email,
    },
    {
      type: "telephone",
      pattern: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
      target: telephone,
    },
  ];

  const { isValid, message } = authService.checkPatterndValid(patternCheckList);
  if (!isValid) {
    throw new HttpError(422, message);
  }

  await userModel.updateUser(userId, info);
};

exports.deleteUser = async function (userId) {
  const user = await userModel.getUser(userId);
  if (user.length < 1) throw new HttpError(404, "not_exist_user_error");

  await userModel.deleteUser(userId);
};
