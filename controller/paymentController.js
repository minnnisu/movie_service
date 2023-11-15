const createError = require("http-errors");
const movieScheduleModel = require("../model/movieScheduleModel");
const orderModel = require("../model/orderModel");
const orderedSeatModel = require("../model/orderedSeatModel");
const personTypeModel = require("../model/personTypeModel");

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

exports.payMovieTicket = async function (req, res, next) {
  if (
    !req.body.movie_time_id ||
    !req.body.seat_name_list ||
    !req.body.person_type
  ) {
    return next(createError(400, "not_contain_nessary_body"));
  }

  try {
    const { movie_time_id, seat_name_list, person_type } = req.body;

    const movieSchedule = await movieScheduleModel.getMovieSchedule(
      movie_time_id
    );

    if (movieSchedule.length < 0) {
      return next(createError(404, "not_exist_movie_time_id_error"));
    }

    if (movieSchedule["ordered_seat_count"] >= 100) {
      return next(createError(400, "seat_count_overflow_error"));
    }

    if (!checkSeatNameValid(seat_name_list)) {
      return next(createError(400, "not_exist_seat_name_error"));
    }

    const seats = await orderedSeatModel.getOrderedSeatsAboutMovieTime(
      movie_time_id
    );
    if (hasCommonSeats(seats, seat_name_list)) {
      return next(createError(400, "already_ordered_seat_error"));
    }

    if (
      person_type.teenager === undefined ||
      !person_type.adult === undefined ||
      !person_type.senior === undefined
    ) {
      return next(createError(400, "nessary_person_type_property_error"));
    }

    const { teenager, adult, senior } = person_type;
    if (teenager + adult + senior !== seat_name_list.length) {
      return next(createError(400, "seat_count_consistency_error"));
    }

    const ticketPrice = await personTypeModel.calcTotalTicketPrice(person_type);
    const seatNameListWithPersonType = concateSeatNameAndPersonType(
      seat_name_list,
      person_type
    );

    await orderModel.addNewOrder({
      user_id: req.user,
      movie_time_id,
      seat_count: seat_name_list.length,
      price: ticketPrice,
      seatNameList: seatNameListWithPersonType,
    });

    res.status(201).json({ message: "Successfully ordered" });
  } catch (error) {
    console.error(error);
    return next(createError(500, "server_error"));
  }
};
