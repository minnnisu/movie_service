const movieModel = require("../model/movieModel");
const userModel = require("../model/userModel");

exports.getMainPage = async function (id) {
  const movies = await movieModel.getMoviesSummary();
  const data = { user: {}, movies };

  if (id !== undefined) {
    const user = await userModel.getUser(id);
    data["user"] = { is_login_status: true, name: user[0].name };
  } else {
    data["user"] = { is_login_status: false };
  }

  return data;
};

exports.getLogInOutPage = async function (id) {
  if (id !== undefined) {
    const user = await userModel.getUser(id);
    return { is_login_status: true, name: user[0].name };
  } else {
    return { is_login_status: false };
  }
};
