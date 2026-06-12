import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

const STORAGE_KEY = "devashmit-day8-theme";

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <>
      <Navbar theme={theme} onToggle={toggle} />
      <main className="demo">
        <h1>Responsive Navbar</h1>
        <p>
          Uses <code>useState</code> for hamburger toggle and dark/light mode.
          Theme stored in <code>localStorage</code> — try refreshing the page.
          Resize the window to see the mobile hamburger menu.
        </p>
      </main>
    </>
  );
}
