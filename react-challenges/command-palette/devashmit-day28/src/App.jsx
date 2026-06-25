import{useState,useEffect,useRef,useCallback}from"react";
const CMDS=[{id:1,name:"New File",desc:"Create a new file",icon:"📄",cat:"File",action:()=>"New file created"},{id:2,name:"Open Folder",desc:"Open a folder",icon:"📁",cat:"File",action:()=>"Folder opened"},{id:3,name:"Save",desc:"Save current file",icon:"💾",cat:"File",shortcut:"⌘S",action:()=>"Saved"},{id:4,name:"Close Tab",desc:"Close current tab",icon:"✕",cat:"File",action:()=>"Tab closed"},{id:5,name:"Toggle Terminal",desc:"Open/close terminal",icon:"⬛",cat:"View",shortcut:"⌘`",action:()=>"Terminal toggled"},{id:6,name:"Toggle Sidebar",desc:"Show/hide sidebar",icon:"◀",cat:"View",action:()=>"Sidebar toggled"},{id:7,name:"Zoom In",desc:"Increase font size",icon:"🔍",cat:"View",action:()=>"Zoomed in"},{id:8,name:"Zoom Out",desc:"Decrease font size",icon:"🔎",cat:"View",action:()=>"Zoomed out"},{id:9,name:"Format Document",desc:"Prettier format",icon:"✨",cat:"Edit",shortcut:"⇧⌥F",action:()=>"Formatted"},{id:10,name:"Find in Files",desc:"Search across files",icon:"🔍",cat:"Edit",shortcut:"⇧⌘F",action:()=>"Search opened"},{id:11,name:"Undo",desc:"Undo last action",icon:"↩",cat:"Edit",shortcut:"⌘Z",action:()=>"Undone"},{id:12,name:"Redo",desc:"Redo last action",icon:"↪",cat:"Edit",shortcut:"⇧⌘Z",action:()=>"Redone"},{id:13,name:"Toggle Dark Mode",desc:"Switch theme",icon:"🌙",cat:"Preferences",action:()=>"Theme toggled"},{id:14,name:"Settings",desc:"Open settings",icon:"⚙️",cat:"Preferences",shortcut:"⌘,",action:()=>"Settings opened"},{id:15,name:"Extensions",desc:"Manage extensions",icon:"🔌",cat:"Preferences",action:()=>"Extensions opened"},{id:16,name:"Git: Commit",desc:"Stage and commit",icon:"📦",cat:"Git",action:()=>"Commit opened"},{id:17,name:"Git: Push",desc:"Push to remote",icon:"⬆",cat:"Git",action:()=>"Pushed"},{id:18,name:"Git: Pull",desc:"Pull from remote",icon:"⬇",cat:"Git",action:()=>"Pulled"},{id:19,name:"Run Tests",desc:"Execute test suite",icon:"🧪",cat:"Run",action:()=>"Tests running"},{id:20,name:"Start Debug",desc:"Launch debugger",icon:"🐛",cat:"Run",action:()=>"Debugger started"},{id:21,name:"Build Project",desc:"Compile and build",icon:"🔨",cat:"Run",action:()=>"Build started"}];
function fuzzy(q,t){if(!q)return true;const ql=q.toLowerCase(),tl=t.toLowerCase();let qi=0;for(let i=0;i<tl.length&&qi<ql.length;i++)if(tl[i]===ql[qi])qi++;return qi===ql.length;}
export default function App(){
  const[open,setOpen]=useState(false);const[query,setQuery]=useState("");const[active,setActive]=useState(0);const[toast,setToast]=useState("");
  const inputRef=useRef(null);
  const filtered=CMDS.filter(c=>fuzzy(query,c.name)||fuzzy(query,c.desc));
  const grouped=filtered.reduce((a,c)=>{if(!a[c.cat])a[c.cat]=[];a[c.cat].push(c);return a;},{});
  const flat=Object.values(grouped).flat();
  const openP=useCallback(()=>{setOpen(true);setQuery("");setActive(0);},[]);
  const closeP=useCallback(()=>{setOpen(false);setQuery("");},[]);
  const exec=useCallback(cmd=>{const m=cmd.action();closeP();setToast(`✅ ${m}`);setTimeout(()=>setToast(""),2000);},[closeP]);
  useEffect(()=>{const h=e=>{if((e.ctrlKey||e.metaKey)&&e.key==="k"){e.preventDefault();open?closeP():openP();}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[open,openP,closeP]);
  useEffect(()=>{if(!open)return;const h=e=>{if(e.key==="Escape"){closeP();return;}if(e.key==="ArrowDown"){e.preventDefault();setActive(a=>Math.min(a+1,flat.length-1));}if(e.key==="ArrowUp"){e.preventDefault();setActive(a=>Math.max(a-1,0));}if(e.key==="Enter"&&flat[active])exec(flat[active]);};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[open,active,flat,closeP,exec]);
  useEffect(()=>{if(open)setTimeout(()=>inputRef.current?.focus(),0);},[open]);
  useEffect(()=>{setActive(0);},[query]);
  let gi=0;
  return(<>
    <p className="hint">Press <kbd>Ctrl+K</kbd> to open the command palette</p>
    {open&&(<div className="overlay" onClick={closeP}><div className="palette" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true">
      <div className="palette__search"><span>🔍</span><input ref={inputRef} className="palette__input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Type a command…"/><button className="palette__esc" onClick={closeP}>Esc</button></div>
      <div className="palette__list">
        {flat.length===0?<p className="palette__empty">No commands match "{query}"</p>:
          Object.entries(grouped).map(([cat,cmds])=>(<div key={cat}><div className="palette__group">{cat}</div>
            {cmds.map(cmd=>{const idx=gi++;const isA=idx===active;return(<div key={cmd.id} className={`palette__item${isA?" active":""}`} onClick={()=>exec(cmd)} onMouseEnter={()=>setActive(idx)}>
              <span className="palette__item__icon">{cmd.icon}</span>
              <div className="palette__item__text"><p className="palette__item__name">{cmd.name}</p><p className="palette__item__desc">{cmd.desc}</p></div>
              {cmd.shortcut&&<span className="palette__item__shortcut">{cmd.shortcut}</span>}
            </div>);})}
          </div>))}
      </div>
    </div></div>)}
    {toast&&<div className="toast">{toast}</div>}
  </>);
}
