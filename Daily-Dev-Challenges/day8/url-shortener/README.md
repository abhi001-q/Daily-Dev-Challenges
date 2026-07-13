# Day 8 – URL Shortener with Click Analytics (Fullstack)

## Challenge Overview
Create a full‑stack URL shortener service that:
- Accepts a long URL via a POST request and returns a short alias.
- Stores click analytics (total clicks, timestamps) for each short link.
- Provides an endpoint to retrieve analytics data.

## Tech Stack (suggested)
- **Frontend:** HTML, CSS, vanilla JavaScript (fetch API)
- **Backend:** Node.js with Express
- **Database:** In‑memory store (for the scaffold) – can be swapped for SQLite/Redis later.

## Getting Started
```bash
# Install dependencies
npm install
# Run development server
npm run dev
```

## Files
- `frontend/index.html` – simple UI to submit URLs and display short links.
- `frontend/style.css` – basic styling, dark mode ready.
- `frontend/app.js` – client‑side logic.
- `backend/server.js` – Express server with routes for `/shorten` and `/analytics/:code`.
- `package.json` – project metadata and scripts.
- `README.md` – this document.

## Next Steps
- Implement persistence (SQLite, file, or Redis).
- Add rate‑limiting and validation.
- Deploy to a platform (Vercel, Render, etc.).
