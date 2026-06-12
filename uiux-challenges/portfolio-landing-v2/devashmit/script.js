// Hamburger toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav__links");
hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open"); hamburger.setAttribute("aria-expanded","false");
}));
