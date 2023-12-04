const movieScheduleModel = require("../model/movieScheduleModel");
const orderModel = require("../model/orderModel");
const userModel = require("../model/userModel");
const orderedSeatModel = require("../model/orderedSeatModel");
const personTypeModel = require("../model/personTypeModel");
const commonQuery = require("../model/common");
const HttpError = require("../error/HttpError");

function checkSeatNameValid(seats) {
  for (let i = 0; i < seats.length; i++) {
    const seat = seats[i];
    if (!seat["seat_row"] || !seat["seat_col"]) {
      return false;
    }

    const { seat_row, seat_col } = seat;

    if (seat_row !== seat_row.toUpperCase()) {
      return false;
    }

    if (seat_row > "I" || seat_row < "A") {
      return false;
    } else {
      if (seat_row <= "G" && (seat_col < 1 || seat_col > 12)) {
        return false;
      } else if (
        (seat_row === "H" || seat_row === "I") &&
        (seat_col < 1 || seat_col > 8)
      ) {
        return false;
      }
    }
  }

  return true;
}

function convertSeatObjToString(seatObjList) {
  return seatObjList.map((seat) => `${seat["seat_row"]}${seat["seat_col"]}`);
}

function hasCommonSeats(seatList1, seatList2) {
  const s_seatList1 = convertSeatObjToString(seatList1);
  const s_seatList2 = convertSeatObjToString(seatList2);

  for (let i = 0; i < s_seatList1.length; i++) {
    for (let j = 0; j < s_seatList2.length; j++) {
      if (s_seatList1[i] === s_seatList2[j]) {
        return true;
      }
    }
  }
  return false;
}

function concateSeatNameAndPersonType(seatNameList, personType) {
  let sI = 0;
  for (let i = 0; i < personType.teenager; i++) {
    seatNameList[sI]["person_type"] = "teenager";
    sI++;
  }

  for (let i = 0; i < personType.adult; i++) {
    seatNameList[sI]["person_type"] = "adult";
    sI++;
  }

  for (let i = 0; i < personType.senior; i++) {
    seatNameList[sI]["person_type"] = "senior";
    sI++;
  }

  return seatNameList;
}

exports.payMovieTicket = async function (info) {
  if (
    info.movie_time_id === undefined ||
    info.seat_name_list === undefined ||
    info.person_type === undefined
  ) {
    throw new HttpError(400, "not_contain_nessary_body");
  }

  const { movie_time_id, seat_name_list, person_type, user_id } = info;

  const movieSchedule = await movieScheduleModel.getMovieScheduleByMovieTimeId(
    movie_time_id
  );

  if (movieSchedule.length < 0)
    throw new HttpError(404, "not_exist_movie_time_id_error");

  if (movieSchedule["ordered_seat_count"] >= 100)
    throw new HttpError(400, "seat_count_overflow_error");

  if (!checkSeatNameValid(seat_name_list))
    throw new HttpError(400, "not_exist_seat_name_error");

  const seats = await orderedSeatModel.getOrderedSeatsByMovieTime(
    movie_time_id
  );
  if (hasCommonSeats(seats, seat_name_list))
    throw new HttpError(400, "already_ordered_seat_error");

  if (
    person_type.teenager === undefined ||
    person_type.adult === undefined ||
    person_type.senior === undefined
  )
    throw new HttpError(400, "nessary_person_type_property_error");

  const { teenager, adult, senior } = person_type;
  if (teenager + adult + senior !== seat_name_list.length)
    throw new HttpError(400, "seat_count_consistency_error");

  const ticketPrice = await personTypeModel.calcTotalTicketPrice(person_type);
  const seatNameListWithPersonType = concateSeatNameAndPersonType(
    seat_name_list,
    person_type
  );

  const orderId = await orderModel.addNewOrder({
    user_id,
    movie_time_id,
    seat_count: seat_name_list.length,
    price: ticketPrice,
    seatNameList: seatNameListWithPersonType,
  });

  return orderId[0].orderId;
};

exports.getPaymentCompleteInfo = async function (orderId) {
  if (orderId === undefined) {
    throw new HttpError(400, "not_contain_nessary_query_string");
  }

  const orderAndSchedule = await commonQuery.getpaymentCompleteInfoByOrderID(
    orderId
  );
  const { title, room_id, start_time, end_time, price } = orderAndSchedule[0];

  const seats = await orderedSeatModel.getSeatNameByOrderId(orderId);
  const seats_s = convertSeatObjToString(seats);

  return {
    order_id: orderId,
    title,
    room_id,
    seats_s,
    start_time,
    end_time,
    price,
  };
};

exports.getPaymentPage = async function (id, data) {
  if (data === undefined) {
    throw new HttpError(400, "not_contain_nessary_body");
  }

  const user = await userModel.getUser(id);
  const orderData = JSON.parse(data);
  const seat_name_list = orderData.snl.map((seat) => ({
    seat_row: seat.r,
    seat_col: seat.c,
  }));

  const { t, a, s } = orderData.pt;
  const person_type = { teenager: t, adult: a, senior: s };
  const movieSchedule = await movieScheduleModel.getMovieScheduleByMovieTimeId(
    orderData.mid
  );

  return {
    userInfo: {
      name: user[0].name,
      email: user[0].email,
      telephone: user[0].telephone,
    },
    orderInfo: {
      title: movieSchedule[0].title,
      room_id: movieSchedule[0].room_id,
      start_time: movieSchedule[0].start_time,
      end_time: movieSchedule[0].end_time,
      seat_name_list,
      price: orderData.p,
    },
    selectedSeatInfo: {
      movie_time_id: movieSchedule[0].movie_time_id,
      person_type,
      seat_name_list,
    },
  };
};
