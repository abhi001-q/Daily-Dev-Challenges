import { useState, useEffect, useRef, useCallback } from "react";

const COMMANDS = [
  { id:1,  name:"New File",         desc:"Create a new file",        icon:"📄", category:"File",    action:()=>"New file created" },
  { id:2,  name:"Open Folder",      desc:"Open a folder",            icon:"📁", category:"File",    action:()=>"Folder opened" },
  { id:3,  name:"Save",             desc:"Save current file",        icon:"💾", category:"File",    shortcut:"⌘S", action:()=>"Saved" },
  { id:4,  name:"Save All",         desc:"Save all open files",      icon:"💾", category:"File",    action:()=>"All saved" },
  { id:5,  name:"Close Tab",        desc:"Close current tab",        icon:"✕",  category:"File",    action:()=>"Tab closed" },
  { id:6,  name:"Toggle Terminal",  desc:"Open/close terminal",      icon:"⬛", category:"View",    shortcut:"⌘`", action:()=>"Terminal toggled" },
  { id:7,  name:"Toggle Sidebar",   desc:"Show/hide sidebar",        icon:"◀",  category:"View",    action:()=>"Sidebar toggled" },
  { id:8,  name:"Zoom In",          desc:"Increase font size",       icon:"🔍", category:"View",    action:()=>"Zoomed in" },
  { id:9,  name:"Zoom Out",         desc:"Decrease font size",       icon:"🔎", category:"View",    action:()=>"Zoomed out" },
  { id:10, name:"Format Document",  desc:"Prettier format",          icon:"✨", category:"Edit",    shortcut:"⇧⌥F", action:()=>"Formatted" },
  { id:11, name:"Find in Files",    desc:"Search across files",      icon:"🔍", category:"Edit",    shortcut:"⇧⌘F", action:()=>"Search opened" },
  { id:12, name:"Undo",             desc:"Undo last action",         icon:"↩",  category:"Edit",    shortcut:"⌘Z", action:()=>"Undone" },
  { id:13, name:"Redo",             desc:"Redo last action",         icon:"↪",  category:"Edit",    shortcut:"⇧⌘Z", action:()=>"Redone" },
  { id:14, name:"Copy Line Down",   desc:"Duplicate current line",   icon:"📋", category:"Edit",    action:()=>"Line copied" },
  { id:15, name:"Toggle Dark Mode", desc:"Switch theme",             icon:"🌙", category:"Preferences", action:()=>"Theme toggled" },
  { id:16, name:"Settings",         desc:"Open settings",            icon:"⚙️", category:"Preferences", shortcut:"⌘,", action:()=>"Settings opened" },
  { id:17, name:"Keyboard Shortcuts",desc:"View shortcuts",          icon:"⌨", category:"Preferences", action:()=>"Shortcuts opened" },
  { id:18, name:"Extensions",       desc:"Manage extensions",        icon:"🔌", category:"Preferences", action:()=>"Extensions opened" },
  { id:19, name:"Git: Commit",      desc:"Stage and commit changes", icon:"📦", category:"Git",     action:()=>"Commit dialog opened" },
  { id:20, name:"Git: Push",        desc:"Push to remote",           icon:"⬆",  category:"Git",     action:()=>"Pushed" },
  { id:21, name:"Git: Pull",        desc:"Pull from remote",         icon:"⬇",  category:"Git",     action:()=>"Pulled" },
];

function fuzzyMatch(query, text) {
  if (!query) return true;
  const q = query.toLowerCase(); const t = text.toLowerCase();
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export default function App() {
  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState("");
  const [active,  setActive]  = useState(0);
  const [toast,   setToast]   = useState("");
  const inputRef              = useRef(null);

  const filtered = COMMANDS.filter(c =>
    fuzzyMatch(query, c.name) || fuzzyMatch(query, c.desc)
  );

  // Group by category
  const grouped = filtered.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  const flatList = Object.values(grouped).flat();

  const openPalette = useCallback(() => {
    setOpen(true); setQuery(""); setActive(0);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false); setQuery("");
  }, []);

  const execute = useCallback((cmd) => {
    const msg = cmd.action();
    closePalette();
    setToast(`✅ ${msg}`);
    setTimeout(() => setToast(""), 2000);
  }, [closePalette]);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        open ? closePalette() : openPalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, openPalette, closePalette]);

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") { closePalette(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(a => Math.min(a + 1, flatList.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(a => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && flatList[active]) {
        execute(flatList[active]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, active, flatList, closePalette, execute]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  // Reset active index on query change
  useEffect(() => { setActive(0); }, [query]);

  let globalIdx = 0;

  return (
    <>
      <p className="hint">Press <kbd>Ctrl+K</kbd> to open the command palette</p>

      {open && (
        <div className="overlay" onClick={closePalette}>
          <div className="palette" onClick={e => e.stopPropagation()} role="dialog" aria-label="Command Palette" aria-modal="true">
            {/* Search input */}
            <div className="palette__search">
              <span className="palette__icon" aria-hidden="true">🔍</span>
              <input
                ref={inputRef}
                className="palette__input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type a command…"
                aria-label="Search commands"
                aria-autocomplete="list"
              />
              <button className="palette__esc" onClick={closePalette} aria-label="Close">Esc</button>
            </div>

            {/* Results */}
            <div className="palette__list" role="listbox">
              {flatList.length === 0 ? (
                <p className="palette__empty">No commands match "{query}"</p>
              ) : (
                Object.entries(grouped).map(([category, cmds]) => (
                  <div key={category}>
                    <div className="palette__group-label">{category}</div>
                    {cmds.map(cmd => {
                      const idx = globalIdx++;
                      const isActive = idx === active;
                      return (
                        <div
                          key={cmd.id}
                          className={`palette__item${isActive ? " active" : ""}`}
                          role="option"
                          aria-selected={isActive}
                          onClick={() => execute(cmd)}
                          onMouseEnter={() => setActive(idx)}
                        >
                          <span className="palette__item__icon" aria-hidden="true">{cmd.icon}</span>
                          <div className="palette__item__text">
                            <p className="palette__item__name">{cmd.name}</p>
                            <p className="palette__item__desc">{cmd.desc}</p>
                          </div>
                          {cmd.shortcut && (
                            <span className="palette__item__shortcut">{cmd.shortcut}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
