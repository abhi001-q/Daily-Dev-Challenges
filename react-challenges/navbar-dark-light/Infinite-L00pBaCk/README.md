# 🌙 Responsive Navbar with Dark/Light Mode

**Day 50 · Week 8 · Beginner · Challenge #627**

A fully responsive React Navbar component featuring a dark/light mode toggle, animated hamburger menu, glassmorphism effect, and theme persistence via `localStorage`.

---

## ✨ Features

- 🌙 **Dark / Light Mode** — Toggle with a smooth animated switch; theme saved in `localStorage` so it survives page refresh
- 📱 **Responsive** — Full hamburger menu on mobile with slide-down animation
- ⚡ **Glassmorphism Navbar** — `backdrop-filter: blur` + scroll-aware shrink effect
- ♿ **Accessible** — ARIA roles, `aria-label`, `aria-expanded`, keyboard support
- 🎨 **CSS Variables** — Complete token-based theming system for instant transitions
- ⚛️ **React Hooks** — `useState`, `useEffect`, `useCallback` — no prop drilling

---

## 🧩 Component Structure

```
src/
├── App.jsx                   # Root app + useTheme hook
├── index.css                 # Design tokens (light/dark) + all styles
├── main.jsx                  # React entry point
└── components/
    ├── Navbar.jsx            # Main navbar (scroll + mobile logic)
    ├── NavLinks.jsx          # Reusable navigation links list
    └── ThemeToggle.jsx       # Accessible dark/light toggle button
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧠 Concepts Practiced

- `useState` · `useEffect` · `useCallback`
- CSS Variables for theming
- `localStorage` for persistence
- Responsive design with media queries
- ARIA accessibility attributes

---

## 👤 Author

**@Infinite-L00pBaCk** — [GitHub](https://github.com/Infinite-L00pBaCk)
