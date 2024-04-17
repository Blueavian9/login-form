

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
