# ⚡ Real-time Chat with WebSockets — Day 14 FastAPI Challenge

**Issue:** [#334](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/334) | Week 2 | Advanced

## 📋 Description

Real-time chat using FastAPI WebSockets. Multiple rooms, broadcast to all clients in a room, join/leave notifications. Includes a minimal HTML frontend — test with multiple browser tabs.

## ✨ Features
- Multiple chat rooms via URL `/ws/{room}/{username}`
- `ConnectionManager` per room
- Broadcast to all room clients
- Join/leave notifications
- Minimal HTML frontend at `GET /`

## 🚀 How to Run
```bash
pip install fastapi uvicorn
uvicorn main:app --reload
```
Open http://localhost:8000 in multiple browser tabs.
