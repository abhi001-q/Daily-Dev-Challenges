/**
 * Infinite Scroll Gallery — Unsplash API
 * Day 5 — JavaScript Challenge
 * Author: devashmit
 */

const CONFIG = { accessKey: "YOUR_ACCESS_KEY", perPage: 12 };
const API = "https://api.unsplash.com/photos";

let page = 1, fetching = false;

const gallery   = document.getElementById("gallery");
const spinner   = document.getElementById("spinner");
const sentinel  = document.getElementById("sentinel");
const lightbox  = document.getElementById("lightbox");
const lbImg     = document.getElementById("lightboxImg");
const lbCaption = document.getElementById("lightboxCaption");
const lbClose   = document.getElementById("lightboxClose");

async function loadPhotos() {
  if (fetching) return;
  fetching = true;
  spinner.classList.add("visible");
  try {
    const url = new URL(API);
    url.searchParams.set("page", page);
    url.searchParams.set("per_page", CONFIG.perPage);
    url.searchParams.set("client_id", CONFIG.accessKey);
    const res = await fetch(url);
    if (!res.ok) throw new Error("API error");
    const photos = await res.json();
    renderPhotos(photos);
    page++;
  } catch (err) {
    gallery.insertAdjacentHTML("beforeend", `<p style="color:#f66;padding:1rem;grid-column:1/-1">Failed to load. Check your API key.</p>`);
  } finally {
    spinner.classList.remove("visible");
    fetching = false;
  }
}

function renderPhotos(photos) {
  photos.forEach(p => {
    const item = document.createElement("div");
    item.className = "gallery__item";
    item.innerHTML = `
      <img src="${p.urls.regular}" alt="${p.alt_description || "Photo"}" loading="lazy" />
      <div class="gallery__overlay"><p>📷 ${p.user.name}</p></div>
    `;
    item.querySelector("img").addEventListener("load", e => e.target.classList.add("loaded"));
    item.addEventListener("click", () => openLightbox(p.urls.full, p.user.name, p.alt_description));
    gallery.appendChild(item);
  });
}

function openLightbox(src, author, alt) {
  lbImg.src = src;
  lbImg.alt = alt || "Photo";
  lbCaption.textContent = `📷 ${author}`;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lbImg.src = "";
  document.body.style.overflow = "";
}

lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) loadPhotos();
}, { rootMargin: "200px" });

observer.observe(sentinel);
loadPhotos();
