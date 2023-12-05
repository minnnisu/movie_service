const totalRows = 12;
const totalCols = 9;

const BLOCKED_SEATS = [
  {
    seat_row: "H",
    seat_col: 9,
  },
  {
    seat_row: "H",
    seat_col: 10,
  },
  {
    seat_row: "H",
    seat_col: 11,
  },
  {
    seat_row: "H",
    seat_col: 12,
  },
  {
    seat_row: "I",
    seat_col: 9,
  },
  {
    seat_row: "I",
    seat_col: 10,
  },
  {
    seat_row: "I",
    seat_col: 11,
  },
  {
    seat_row: "I",
    seat_col: 12,
  },
];

// 각 카테고리에 대한 선택된 좌석 수를 저장할 변수
let numOfCustomer = 0;
let selectable = 0;
let selectedSeats = [];

window.onload = async () => {
  await createSeatButtons();
};

function manageSelectedSeats(seatId, action) {
  if (action === "remove") {
    const index = selectedSeats.indexOf(seatId);
    if (index !== -1) {
      selectedSeats.splice(index, 1);
      return [true, ""];
    }
    alert("오류가 발생하여 새로고침합니다.");
    return window.location.reload();
  }

  if (action === "append") {
    if (selectedSeats.length >= numOfCustomer) {
      return [false, "인원 수를 초과합니다."];
    }

    const index = selectedSeats.indexOf(seatId);
    if (index !== -1) {
      alert("오류가 발생하여 새로고침합니다.");
      return window.location.reload();
    }

    selectedSeats.push(seatId);
    return [true, ""];
  }

  return [false, "조건에 만족하지 않습니다."];
}

class Seat {
  constructor(seatRow, seatCol, seatType = "unselected") {
    this.seatCol = seatCol; // H
    this.seatRow = seatRow; // 1
    this.seatType = seatType; // selected, unselected, blocked, ordered
  }

  clickSeat(seat) {
    if (this.seatType === "selected") {
      const [isSucess, message] = manageSelectedSeats(
        `${this.seatRow}-${this.seatCol}`,
        "remove"
      );
      if (isSucess) {
        this.seatType = "unselected";
        seat.className = "seat";
        const seats = document.getElementById("seat-list");
        seats.innerHTML = selectedSeats.join(", ");
        return;
      }

      alert(message);
      return;
    }

    if (this.seatType === "unselected") {
      const [isSucess, message] = manageSelectedSeats(
        `${this.seatRow}-${this.seatCol}`,
        "append"
      );
      if (isSucess) {
        this.seatType = "selected";
        seat.className = "seat selected";
        const seats = document.getElementById("seat-list");
        seats.innerHTML = selectedSeats.join(", ");
        return;
      }

      console.log(selectedSeats);

      alert(message);
      return;
    }

    if (this.seatType === "blocked") {
      return alert("선택할 수 없는 좌석입니다.");
    }

    if (this.seatType === "ordered") {
      alert("이미 예매된 좌석입니다.");
    }
  }

  changeType(type, seat) {
    this.seatType = type;
    if (type === "selected") {
      seat.className = "seat selected";
      return;
    }

    if (type === "unselected") {
      seat.className = "seat";
      return;
    }
  }

  getSeatCol() {
    return this.seatCol;
  }

  getSeatRow() {
    return this.seatRow;
  }

  getSeatType() {
    return this.seatType;
  }
}

async function createSeatButtons() {
  // 현재 페이지의 URL에서 쿼리스트링을 가져오기
  const queryString = window.location.search;
  const queryParams = new URLSearchParams(queryString);

  const responese = await fetch(
    `http://localhost:8080/api/movie/ticketing/personSeat?movie_time_id=${queryParams.get(
      "movie_time_id"
    )}`
  );

  if (!responese.ok) {
    alert("좌석 정보를 불러오는 중에 오류가 발생하였습니다");
    return (window.location.href = "/");
  }

  const orderedSeats = await responese.json();

  for (let i = 1; i < totalRows + 1; i++) {
    const seatWrapper = document.getElementById("seat-wrapper");
    const row = document.createElement("div");
    row.className = "seat-row";

    for (let j = 1; j < totalCols + 1; j++) {
      const seat = document.createElement("div");
      seat.id = `${String.fromCharCode(64 + j)}-${i}`;
      seat.className = "seat";

      seat.seatClass = new Seat(String.fromCharCode(64 + j), i);
      seat.innerHTML = `${String.fromCharCode(64 + j)}-${i}`;
      row.appendChild(seat);

      seat.addEventListener("click", () => clickSeatButton(seat));
    }
    seatWrapper.appendChild(row);
  }

  for (const orderedSeat of orderedSeats) {
    const { seat_row, seat_col } = orderedSeat;
    const seat = document.getElementById(`${seat_row}-${seat_col}`);
    seat.className = `${seat.className} ordered`;
    seat.seatClass.changeType("ordered");
  }

  for (const blockedSeat of BLOCKED_SEATS) {
    const { seat_row, seat_col } = blockedSeat;
    const seat = document.getElementById(`${seat_row}-${seat_col}`);
    seat.className = `${seat.className} blocked`;
    seat.seatClass.changeType("blocked");
  }
}

function clickSeatButton(seat) {
  seat.seatClass.clickSeat(seat);
}

function getPrice() {
  // 가격 설정
  const adultPrice = 15000;
  const teenagerPrice = 13000;
  const seniorPrice = 11000;

  const adultsCount = parseInt(document.getElementById("adults").value);
  const teenagersCount = parseInt(document.getElementById("teenagers").value);
  const seniorsCount = parseInt(document.getElementById("seniors").value);

  // 총 인원 및 가격 계산
  const totalAdults = adultsCount * adultPrice;
  const totalTeenagers = teenagersCount * teenagerPrice;
  const totalSeniors = seniorsCount * seniorPrice;
  const totalPrice = totalAdults + totalTeenagers + totalSeniors;

  return { totalAdults, totalTeenagers, totalSeniors, totalPrice };
}

function ApplyNumOfPerson() {
  // 인원 및 가격 정보 가져오기
  const adultsCount = parseInt(document.getElementById("adults").value);
  const teenagersCount = parseInt(document.getElementById("teenagers").value);
  const seniorsCount = parseInt(document.getElementById("seniors").value);

  if (numOfCustomer > adultsCount + teenagersCount + seniorsCount) {
    for (const selectedSeat of selectedSeats) {
      const seat = document.getElementById(selectedSeat);
      seat.seatClass.changeType("unselected", seat);
    }
    selectedSeats = [];
    const seats = document.getElementById("seat-list");
    seats.innerHTML = "";
  }

  numOfCustomer = adultsCount + teenagersCount + seniorsCount;

  const { totalAdults, totalTeenagers, totalSeniors, totalPrice } = getPrice();

  console.log(totalPrice);

  document.getElementById("total-price").innerText = `${totalPrice}원`;
}

function checkPersonSeatVaild() {
  const adultsCount = parseInt(document.getElementById("adults").value);
  const teenagersCount = parseInt(document.getElementById("teenagers").value);
  const seniorsCount = parseInt(document.getElementById("seniors").value);

  if (adultsCount + teenagersCount + seniorsCount !== selectedSeats.length) {
    throw new Error("not_vaild_person_seat_error");
  }

  if (adultsCount + teenagersCount + seniorsCount < 1) {
    throw new Error("no_seat_error");
  }
}

function getPaymentData() {
  const queryString = window.location.search;
  const queryParams = new URLSearchParams(queryString);
  const seat_name_list = [];

  const adult = parseInt(document.getElementById("adults").value);
  const teenager = parseInt(document.getElementById("teenagers").value);
  const senior = parseInt(document.getElementById("seniors").value);

  for (const selectedSeat of selectedSeats) {
    const [seat_row, seat_col] = selectedSeat.split("-");
    seat_name_list.push({ r: seat_row, c: seat_col });
  }

  return {
    mid: queryParams.get("movie_time_id"),
    snl: seat_name_list,
    pt: { t: teenager, a: adult, s: senior },
    p: getPrice().totalPrice,
  };
}

function payTicket() {
  try {
    checkPersonSeatVaild();

    const data = getPaymentData();
    const paymentJson = encodeURIComponent(JSON.stringify(data));

    window.location.href = `/payment?data=${paymentJson}`;
  } catch (error) {
    if (error.message === "not_vaild_person_seat_error") {
      return alert("인원 수와 선택한 좌석의 수가 다릅니다.");
    }

    if (error.message === "no_seat_error") {
      return alert("인원 수는 0명 이상이여야합니다.");
    }

    return alert("결제 중 오류가 발생하였습니다.");
  }
}
