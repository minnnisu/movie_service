const HttpError = require("../error/HttpError");
const paymentService = require("../service/paymentService");

exports.payMovieTicket = async function (req, res, next) {
  const info = { ...req.body, user_id: req.user };
  try {
    const orderId = await paymentService.payMovieTicket(info);
    req.session.paymentComplete = true;
    res.redirect(`/payment/complete?orderId=${orderId}`);
  } catch (error) {
    next(error);
  }
};

exports.getPaymentCompletePage = async function (req, res, next) {
  try {
    if (!req.session.paymentComplete) {
      return next(new HttpError(403, "Payment not completed"));
    }

    const orderInfo = await paymentService.getPaymentCompleteInfo(
      req.query.orderId
    );

    // 결제가 완료된 경우 세션을 초기화하고 페이지를 표시
    req.session.paymentComplete = false;
    return res.status(201).json({ orderInfo });
  } catch (error) {
    if (err instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(err);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};
