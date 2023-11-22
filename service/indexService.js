const movieModel = require("../model/movieModel");
const userModel = require("../model/userModel");

exports.getMainPage = async function (id) {
  const movies = await movieModel.getMoviesSummary();
  const responeData = { user: {}, movies };

  if (id !== undefined) {
    const user = await userModel.getUser(id);
    responeData["user"] = { is_login_status: true, name: user[0].name };
  } else {
    responeData["user"] = { is_login_status: false };
  }

  return responeData;
};
