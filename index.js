// Reference to username/password field contents.
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");

function handleSubmit() {
  const params = {
    username: usernameInput.value,
    password: passwordInput.value,
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

function handleSignUp(e) {
  e.preventDefault();
  console.log("working!", e.target.value);
  const params = {
    username: usernameInput.value,
    password: passwordInput.value,
  };

  axios
    .post("http://localhost:3555/sign-up", params)
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
    .then((res) => {
      let message = document.querySelector(".message");
      console.log(res.data.message);
      message.innerHTML = res.data.message;
    })
    .catch((err) => {
      console.error(err);
      window.location.href = "index.html";
    });
}

/* JS Slideshow Carousel section  */

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
