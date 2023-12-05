const HttpError = require("../error/HttpError");
const paymentService = require("../service/paymentService");

exports.payMovieTicket = async function (req, res, next) {
  const info = { ...req.body, user_id: req.user };
  console.log(info.movie_time_id);
  try {
    const orderId = await paymentService.payMovieTicket(info);
    req.session.paymentComplete = true;
    return res.json({
      order_id: orderId,
      message: "Successfully paid ticket!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentCompletePage = async function (req, res, next) {
  try {
    if (!req.session.paymentComplete) {
      return next(new HttpError(403, "payment_not_completed"));
    }

    const orderInfo = await paymentService.getPaymentCompleteInfo(
      req.query.order_id
    );

    // 결제가 완료된 경우 세션을 초기화하고 페이지를 표시
    req.session.paymentComplete = false;
    return res
      .status(201)
      .render("payment_complete", { header: req.headerData, orderInfo });
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(error);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getPaymentPage = async function (req, res, next) {
  try {
    const data = await paymentService.getPaymentPage(req.user, req.query.data);
    req.session.selectedSeats = JSON.stringify(data.selectedSeatInfo);

    return res.render("payment", {
      header: req.headerData,
      userInfo: data.userInfo,
      orderInfo: data.orderInfo,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      error.option = { isShowErrPage: true };
      return next(error);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getSelectedSeatInfo = async function (req, res, next) {
  try {
    console.log(req.session.selectedSeats);
    if (req.session.selectedSeats) {
      const data = { selectedSeats: JSON.parse(req.session.selectedSeats) };
      req.session.selectedSeats = null;
      return res.json(data);
    }
    return res.json({ selectedSeats: null });
  } catch (error) {
    return next(error);
  }
};
