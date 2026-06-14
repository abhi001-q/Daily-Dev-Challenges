const btn=document.getElementById("themeToggle");const html=document.documentElement;
const saved=localStorage.getItem("theme")||"dark";html.setAttribute("data-theme",saved);update(saved);
btn.addEventListener("click",()=>{const n=html.getAttribute("data-theme")==="dark"?"light":"dark";html.setAttribute("data-theme",n);localStorage.setItem("theme",n);update(n);});
function update(t){btn.textContent=t==="dark"?"☀️":"🌙";btn.setAttribute("aria-label",`Switch to ${t==="dark"?"light":"dark"} mode`);}
