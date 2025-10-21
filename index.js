// ==================== ELEMENTS ====================
const music = document.getElementById("bg-music");
const title = document.getElementById("title");
const touch = document.getElementById("touch");
const intro = document.getElementById("intro");
const pages = {
  home: document.getElementById("home"),
  faqs: document.getElementById("faqs"),
  rsvp: document.getElementById("rsvp"),
};
const navLinks = document.querySelectorAll(".nav-link");

// ==================== INTRO & TAP TO CONTINUE ====================
if (sessionStorage.getItem("introPassed")) {
  // Skip intro if already passed in this session
  intro.style.display = "none";
  showPage("home");

  // Reset and play music from start
  music.currentTime = 0;
  music.play().catch(() => {
    console.log("Autoplay blocked, click anywhere to play music.");
  });
} else {
  // Show intro animations
  setTimeout(() => title.classList.add("show"), 500);
  setTimeout(() => touch.classList.add("show", "blink"), 2500);

  // Tap to continue
  touch.addEventListener("click", () => {
    music.currentTime = 0;
    music.play();
    intro.classList.add("fade-out");
    setTimeout(() => {
      intro.style.display = "none";
      showPage("home");
      sessionStorage.setItem("introPassed", "true");
    }, 1000);
  });
}

// Optional: If autoplay is blocked, allow user to click anywhere to start music
document.addEventListener("click", () => {
  if (music.paused) {
    music.currentTime = 0;
    music.play().catch(() => {});
  }
});

// ==================== SHOW PAGE FUNCTION ====================
function showPage(pageId) {
  // Hide all sections
  document
    .querySelectorAll("section")
    .forEach((sec) => (sec.style.display = "none"));

  // Show selected section
  document.getElementById(pageId).style.display = "block";

  // Update active navbar link
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("data-page") === pageId);
  });

  window.scrollTo(0, 0);
}

// ==================== NAVBAR LINK CLICK ====================
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const pageId = link.getAttribute("data-page");
    showPage(pageId);
  });
});

// ==================== COUNTDOWN TIMER ====================
const targetDate = new Date("2025-11-08T08:00:00").getTime();
setInterval(() => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("timer").innerHTML = "💍 It's your wedding day! 🎉";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days
    .toString()
    .padStart(2, "0");
  document.getElementById("hours").textContent = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("minutes").textContent = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds").textContent = seconds
    .toString()
    .padStart(2, "0");
}, 1000);

// ==================== INVITATION ENVELOPE ====================
const envelope = document.querySelector(".envelope-wrapper");
if (envelope) {
  envelope.addEventListener("click", () => envelope.classList.toggle("flap"));
}

// ==================== FAQ TOGGLE ====================
document.querySelectorAll(".faq").forEach((faq) => {
  faq.addEventListener("click", () => faq.classList.toggle("active"));
});

// ==================== RSVP FORM ====================
(function () {
  emailjs.init("TDg0Kx_ARB4-J3KEt"); // EmailJS Public Key
})();

const form = document.getElementById("rsvp-form");
const popup = document.getElementById("popup");

if (form && popup) {
  const popupTitle = popup.querySelector("h3");
  const popupText = popup.querySelector("p");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const attendance = form.attendance.value;

    emailjs.sendForm("service_fwdjli6", "template_g3cappk", form).then(
      () => {
        if (attendance === "Sorry, I can’t make it.") {
          popupTitle.textContent = "Thank you for letting us know 💚";
          popupText.textContent =
            "We’ll miss you on our special day, but we appreciate your warm wishes!";
        } else {
          popupTitle.textContent = "Thank you for your RSVP! 💚";
          popupText.textContent =
            "We’re so happy to celebrate this special day with you.";
        }
        popup.style.display = "flex";
        form.reset();
      },
      (error) => {
        alert("Oops! Something went wrong. Please try again.");
        console.error("EmailJS Error:", error);
      }
    );
  });
}

// Close popup
function closePopup() {
  if (popup) popup.style.display = "none";
}

// ==================== PAGE LOAD FADE-IN ====================
window.addEventListener("load", () => document.body.classList.add("fade-in"));
