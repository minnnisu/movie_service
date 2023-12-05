let selectedSeat = null;

window.onload = async () => {
  const responese = await fetch(
    "http://localhost:8080/api/payment/selectedSeat"
  );

  if (!responese.ok) {
    alert("결제 중 오류가 발생하였습니다.");
    return (window.location.href = "/");
  }

  data = await responese.json();
  selectedSeats = data.selectedSeats;
  console.log({ ...selectedSeats });
};

async function submitForm(event) {
  event.preventDefault();
  const responese = await fetch("http://localhost:8080/api/payment/ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...selectedSeats }),
  });

  if (!responese.ok) {
    alert("결제 중 오류가 발생하였습니다.");
    return (window.location.href = "/");
  }

  data = await responese.json();
  console.log(data);

  return (window.location.href = `/payment/complete?order_id=${data.order_id}`);
}

function toggleForm(formId) {
  // 모든 폼 숨기기
  var forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.classList.add("visually-hidden");
  });

  // 선택한 폼 보이기
  var selectedForm = document.getElementById(formId);
  selectedForm.classList.remove("visually-hidden");
}
