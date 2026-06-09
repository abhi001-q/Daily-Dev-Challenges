const btn=document.getElementById("themeToggle");const html=document.documentElement;
const saved=localStorage.getItem("theme")||"dark";html.setAttribute("data-theme",saved);updateIcon(saved);
btn.addEventListener("click",()=>{const n=html.getAttribute("data-theme")==="dark"?"light":"dark";html.setAttribute("data-theme",n);localStorage.setItem("theme",n);updateIcon(n);});
function updateIcon(t){btn.textContent=t==="dark"?"☀️":"🌙";}
