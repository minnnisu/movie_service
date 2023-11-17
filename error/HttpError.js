// 예제: CustomError 클래스 정의
class HttpError extends Error {
  constructor(status, message, option) {
    super(message);
    this.status = status;
    this.option = option;
  }
}

module.exports = HttpError;

// // HttpError 객체 생성
// try {
//   const myError = new HttpError(404, "http_error");
//   throw myError;
// } catch (error) {
//   console.log(error instanceof HttpError);
//   console.log(error.status);
//   console.log(error.message);
//   console.log(error.option?.isErrShow);
// }
