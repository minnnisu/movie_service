function submitForm() {
  // 입력된 정보를 가져와 JSON 만듬
  var formData = {
    id: document.getElementById("id").value,
    password: document.getElementById("password").value,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phoneNum: document.getElementById("phoneNum").value,
  };

  // JSON 데이터를 서버로 전송할 수 있는 형태로 변환
  var jsonData = JSON.stringify(formData);

  fetch("your-server-endpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  })
    .then((response) => response.json())
    .then((data) => {
      // 서버의 응답에 따른 동작을 수행합니다.
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
