/**
 * Real-time Search Filter with Highlighting — Day 6 JavaScript Challenge
 * Author: devashmit
 */

const COUNTRIES = [
  {name:"Afghanistan",continent:"Asia"},{name:"Albania",continent:"Europe"},
  {name:"Algeria",continent:"Africa"},{name:"Argentina",continent:"Americas"},
  {name:"Australia",continent:"Oceania"},{name:"Austria",continent:"Europe"},
  {name:"Bangladesh",continent:"Asia"},{name:"Belgium",continent:"Europe"},
  {name:"Bolivia",continent:"Americas"},{name:"Brazil",continent:"Americas"},
  {name:"Cambodia",continent:"Asia"},{name:"Canada",continent:"Americas"},
  {name:"Chile",continent:"Americas"},{name:"China",continent:"Asia"},
  {name:"Colombia",continent:"Americas"},{name:"Croatia",continent:"Europe"},
  {name:"Czech Republic",continent:"Europe"},{name:"Denmark",continent:"Europe"},
  {name:"Ecuador",continent:"Americas"},{name:"Egypt",continent:"Africa"},
  {name:"Ethiopia",continent:"Africa"},{name:"Finland",continent:"Europe"},
  {name:"France",continent:"Europe"},{name:"Germany",continent:"Europe"},
  {name:"Ghana",continent:"Africa"},{name:"Greece",continent:"Europe"},
  {name:"India",continent:"Asia"},{name:"Indonesia",continent:"Asia"},
  {name:"Iran",continent:"Asia"},{name:"Iraq",continent:"Asia"},
  {name:"Ireland",continent:"Europe"},{name:"Italy",continent:"Europe"},
  {name:"Japan",continent:"Asia"},{name:"Jordan",continent:"Asia"},
  {name:"Kenya",continent:"Africa"},{name:"Malaysia",continent:"Asia"},
  {name:"Mexico",continent:"Americas"},{name:"Morocco",continent:"Africa"},
  {name:"Nepal",continent:"Asia"},{name:"Netherlands",continent:"Europe"},
  {name:"New Zealand",continent:"Oceania"},{name:"Nigeria",continent:"Africa"},
  {name:"Norway",continent:"Europe"},{name:"Pakistan",continent:"Asia"},
  {name:"Peru",continent:"Americas"},{name:"Philippines",continent:"Asia"},
  {name:"Poland",continent:"Europe"},{name:"Portugal",continent:"Europe"},
  {name:"Russia",continent:"Europe"},{name:"Saudi Arabia",continent:"Asia"},
  {name:"South Africa",continent:"Africa"},{name:"South Korea",continent:"Asia"},
  {name:"Spain",continent:"Europe"},{name:"Sweden",continent:"Europe"},
  {name:"Thailand",continent:"Asia"},{name:"Turkey",continent:"Asia"},
  {name:"Ukraine",continent:"Europe"},{name:"United Kingdom",continent:"Europe"},
  {name:"United States",continent:"Americas"},{name:"Vietnam",continent:"Asia"},
  {name:"Zimbabwe",continent:"Africa"},
];

const FLAGS = {Asia:"🌏",Europe:"🌍",Americas:"🌎",Africa:"🌍",Oceania:"🌏"};

let query = "", filter = "all", timer = null;

const input      = document.getElementById("searchInput");
const list       = document.getElementById("resultsList");
const countEl    = document.getElementById("resultCount");
const chips      = document.querySelectorAll(".chip");

function esc(s){ const d=document.createElement("div"); d.appendChild(document.createTextNode(s)); return d.innerHTML; }
function highlight(text, term) {
  if (!term) return esc(text);
  const rx = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&") + ")", "gi");
  return esc(text).replace(rx, "<mark>$1</mark>");
}

function render() {
  const q = query.toLowerCase().trim();
  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(q) && (filter === "all" || c.continent === filter)
  );
  list.innerHTML = "";
  if (!filtered.length) {
    list.innerHTML = `<li class="no-results"><span>🔎</span>No results for "<strong>${esc(query)}</strong>"</li>`;
    countEl.textContent = "0 results"; return;
  }
  filtered.forEach(c => {
    const li = document.createElement("li"); li.className = "result-item"; li.setAttribute("role","listitem");
    li.innerHTML = `<span class="result-item__flag" aria-hidden="true">${FLAGS[c.continent]||"🌐"}</span>
      <span class="result-item__name">${highlight(c.name, query)}</span>
      <span class="result-item__continent">${c.continent}</span>`;
    list.appendChild(li);
  });
  countEl.textContent = `${filtered.length} of ${COUNTRIES.length} countries`;
}

input.addEventListener("input", e => {
  clearTimeout(timer);
  timer = setTimeout(() => { query = e.target.value; render(); }, 200);
});

chips.forEach(c => c.addEventListener("click", () => {
  filter = c.dataset.filter;
  chips.forEach(b => b.classList.toggle("active", b === c));
  render();
}));

render();
