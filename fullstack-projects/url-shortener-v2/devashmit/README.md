# 🚀 URL Shortener with Click Analytics [FULLSTACK] — Day 5

**Issue:** [#252](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/252) | Week 1 | Advanced

## 📋 Description

A full-stack URL shortener with click analytics dashboard. FastAPI backend with SQLite stores URLs and tracks every click with timestamp and user-agent. React frontend shows the link list with live click counts and a sparkline chart per link.

## ✨ Features

**Backend**
- `POST /shorten` — generate short code via `secrets.token_urlsafe`
- `GET /{code}` — redirect + increment click counter with timestamp
- `GET /analytics` — all links with click counts
- `GET /analytics/{code}` — per-link click history

**Frontend**
- URL input form
- Copy-to-clipboard short link
- Analytics table: link, short URL, clicks
- Click count sparkline per link

## 🧠 Concepts Practiced

`SQLite` · `Click tracking` · `Clipboard API` · `React charts`

## 🚀 How to Run

```bash
# Backend
cd backend && pip install fastapi uvicorn && uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

## 🗂 Project Structure

```
devashmit/
├── backend/
│   ├── main.py
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   ├── src/App.jsx
│   ├── package.json
│   └── index.html
└── README.md
```
