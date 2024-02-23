// Reference to username/password field contents.
const username = document.querySelector("#username");
const password = document.querySelector("#password");

function handleSubmit() {
  const params = {
    username: username.value,
    password: password.value,
  };

  axios
    .post("http://localhost:3555/login", params)
    .then((res) => res.data)
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "dash.html";
      } else {
        console.log("no token provided");
      }
    });
}

function handleLogOut() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

function getDashboard() {
  let token = localStorage.getItem("token");
  axios
    .get("http://localhost:3555/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((data) => {
      let message = document.querySelector(".message");
      console.log(data.message);
      message.innerHTML = data.message;
    })
    .catch((err) => (window.location.href = "index.html"));
}
