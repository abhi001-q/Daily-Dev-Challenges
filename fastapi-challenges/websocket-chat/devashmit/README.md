# ⚡ Real-time Chat with WebSockets — Day 9 FastAPI Challenge

**Issue:** [#288](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/288) | Week 2 | Advanced

## 📋 Description

Real-time chat using FastAPI WebSockets. Supports multiple rooms, broadcasts to all clients in a room, and shows join/leave notifications. Includes a minimal HTML frontend to test with multiple tabs.

## ✨ Features
- Multiple chat rooms
- `ConnectionManager` class per room
- Broadcast to all clients in a room
- Join/leave notifications
- Minimal HTML frontend (no build step)

## 🚀 How to Run
```bash
pip install fastapi uvicorn
uvicorn main:app --reload
```
Open http://localhost:8000 in multiple browser tabs.
