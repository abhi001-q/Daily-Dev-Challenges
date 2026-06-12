import { useState } from "react";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ theme, onToggle }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header>
      <nav className="navbar" aria-label="Main navigation">
        <div className="navbar__inner">
          <a href="#" className="navbar__logo">dev<span>ashmit</span></a>
          <ul className="navbar__links" role="list"><NavLinks /></ul>
          <div className="navbar__right">
            <ThemeToggle theme={theme} onToggle={onToggle} />
            <button
              className={`hamburger ${open ? "open" : ""}`}
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu" aria-expanded={open}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
        <div className={`navbar__mobile ${open ? "open" : ""}`} aria-label="Mobile nav">
          <NavLinks onClick={close} />
        </div>
      </nav>
    </header>
  );
}
