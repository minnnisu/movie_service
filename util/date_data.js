const date = new Date();
// console.log(date.getFullYear());
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
const reserveDate = document.querySelector(".reserve-date");

const weekOfDay = ["일", "월", "화", "수", "목", "금", "토"];
const year = date.getFullYear();
const month = date.getMonth();
for (i = date.getDate(); i <= lastDay.getDate(); i++) {
  const button = document.createElement("button");
  const spanWeekOfDay = document.createElement("span");
  const spanDay = document.createElement("span");

  //class넣기
  button.classList = "movie-date-wrapper";
  spanWeekOfDay.classList = "movie-week-of-day";
  spanDay.classList = "movie-day";

  //weekOfDay[new Date]
  const dayOfWeek = weekOfDay[new Date(year + "-" + month + "-" + i).getDay()];

  //요일 넣기
  if (dayOfWeek === "토") {
    spanWeekOfDay.classList.add("saturday");
    spanDay.classList.add("saturday");
  } else if (dayOfWeek === "일") {
    spanWeekOfDay.classList.add("sunday");
    spanDay.classList.add("sunday");
  }
  spanWeekOfDay.innerHTML = dayOfWeek;
  button.append(spanWeekOfDay);
  //날짜 넣기
  spanDay.innerHTML = i;
  button.append(spanDay);
  //button.append(i);
  reserveDate.append(button);

  dayClickEvent(button);
}

function dayClickEvent(button) {
  button.addEventListener("click", function () {
    const movieDateWrapperActive = document.querySelectorAll(
      ".movie-date-wrapper-active"
    );
    movieDateWrapperActive.forEach((list) => {
      list.classList.remove("movie-date-wrapper-active");
    });
    button.classList.add("movie-date-wrapper-active");
  });
}
