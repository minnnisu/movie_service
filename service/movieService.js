require("dotenv").config();
const movieModel = require("../model/movieModel");
const movieVideoModel = require("../model/movieVideoModel");
const movieScheduleModel = require("../model/movieScheduleModel");
const orderedSeatModel = require("../model/orderedSeatModel");
const HttpError = require("../error/HttpError");

exports.getMovieSummaryList = async function () {
  const movies = await movieModel.getMoviesSummary();
  return movies;
};

exports.getMovieInfo = async function (title) {
  const movie = await movieModel.getMovieByTitle(title);
  const trailers = await movieVideoModel.getMovieTrailers(title);

  return { movie, trailers };
};

exports.getMovieInfoByMovieTimeId = async function (movieTimeId) {
  const movie = await movieModel.getMovieByMovieTimeId(movieTimeId);

  return movie;
};

function getToday_Y_M_D() {
  const today = new Date();

  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  const formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
}

function groupMoviesSchedule(moviesSchedule) {
  const groupedMovie = [];

  moviesSchedule.forEach((movie) => {
    const {
      title,
      age_limit,
      running_time,
      released_date,
      movie_time_id,
      room_id,
      start_time,
      end_time,
      ordered_seat_count,
    } = movie;

    // title을 찾기
    let movieInfo = groupedMovie.find((item) => item.title === title);

    // title이 없다면 새로운 객체 추가
    if (!movieInfo) {
      movieInfo = {
        title,
        age_limit,
        running_time,
        released_date,
        rooms: [],
      };
      groupedMovie.push(movieInfo);
    }

    // room_id를 찾기
    let roomInfo = movieInfo.rooms.find((room) => room.room_id === room_id);

    // room_id가 없다면 새로운 객체 추가
    if (!roomInfo) {
      roomInfo = {
        room_id,
        schedules: [],
      };
      movieInfo.rooms.push(roomInfo);
    }

    // 해당 정보 추가
    roomInfo.schedules.push({
      movie_time_id,
      start_time,
      end_time,
      ordered_seat_count,
    });
  });

  return groupedMovie;
}

exports.getMovieScheduleByDate = async function (date) {
  if (date === undefined) date = getToday_Y_M_D();
  const moviesSchedule = await movieScheduleModel.getMovieScheduleByDate(date);
  const groupedMovieSchedule = groupMoviesSchedule(moviesSchedule);
  return groupedMovieSchedule;
};

exports.getMoviePersonSeatByMovieTimeId = async function (movie_time_id) {
  if (movie_time_id === undefined) {
    throw new HttpError(404, "not_contain_nessary_query", {
      isShowErrPage: true,
    });
  }
  const seats = await orderedSeatModel.getOrderedSeatsByMovieTime(
    movie_time_id
  );
  return seats;
};
