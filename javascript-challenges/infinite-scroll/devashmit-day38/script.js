/**
 * Infinite Scroll Gallery — Day 38 JavaScript Challenge
 * Author: devashmit
 */
const KEY="YOUR_ACCESS_KEY", PER=12, API="https://api.unsplash.com/photos";
let page=1, fetching=false;

const gallery=document.getElementById("gallery");
const spinner=document.getElementById("spinner");
const lb=document.getElementById("lb");
const lbImg=document.getElementById("lbImg");
const lbCap=document.getElementById("lbCap");

async function load(){
  if(fetching)return; fetching=true; spinner.classList.add("on");
  try{
    const u=new URL(API); u.searchParams.set("page",page); u.searchParams.set("per_page",PER); u.searchParams.set("client_id",KEY);
    const r=await fetch(u); if(!r.ok)throw new Error("API error");
    (await r.json()).forEach(p=>{
      const d=document.createElement("div"); d.className="gallery__item";
      d.innerHTML=`<img src="${p.urls.regular}" alt="${p.alt_description||""}" loading="lazy"/><div class="ov"><p>📷 ${p.user.name}</p></div>`;
      d.querySelector("img").addEventListener("load",e=>e.target.classList.add("loaded"));
      d.addEventListener("click",()=>{lbImg.src=p.urls.full;lbCap.textContent=`📷 ${p.user.name}`;lb.classList.add("open");document.body.style.overflow="hidden";});
      gallery.appendChild(d);
    });
    page++;
  }catch(e){gallery.insertAdjacentHTML("beforeend",`<p style="color:#f66;padding:1rem;column-span:all">Failed. Check your API key.</p>`);}
  finally{spinner.classList.remove("on"); fetching=false;}
}

function closeLb(){lb.classList.remove("open");lbImg.src="";document.body.style.overflow="";}
document.getElementById("lbc").addEventListener("click",closeLb);
lb.addEventListener("click",e=>{if(e.target===lb)closeLb();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLb();});
new IntersectionObserver(e=>{if(e[0].isIntersecting)load();},{rootMargin:"200px"}).observe(document.getElementById("sentinel"));
load();
