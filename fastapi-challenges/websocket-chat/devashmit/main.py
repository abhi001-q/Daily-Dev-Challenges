"""
Real-time Chat with WebSockets — Day 9 FastAPI Challenge
Author: devashmit

Test: open http://localhost:8000 in multiple browser tabs
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

app = FastAPI(title="WebSocket Chat")


# ── Connection Manager ────────────────────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        # room_id -> list of (websocket, username)
        self.rooms: dict[str, list[tuple[WebSocket, str]]] = {}

    async def connect(self, room: str, ws: WebSocket, username: str) -> None:
        await ws.accept()
        if room not in self.rooms:
            self.rooms[room] = []
        self.rooms[room].append((ws, username))
        await self.broadcast(room, f"🟢 {username} joined the room", exclude=ws)

    async def disconnect(self, room: str, ws: WebSocket, username: str) -> None:
        if room in self.rooms:
            self.rooms[room] = [(w, u) for w, u in self.rooms[room] if w is not ws]
            if not self.rooms[room]:
                del self.rooms[room]
        await self.broadcast(room, f"🔴 {username} left the room")

    async def broadcast(self, room: str, message: str, exclude: WebSocket | None = None) -> None:
        if room not in self.rooms:
            return
        for ws, _ in self.rooms[room]:
            if ws is not exclude:
                try:
                    await ws.send_text(message)
                except Exception:
                    pass

    def room_list(self) -> list[dict]:
        return [{"room": r, "users": len(c)} for r, c in self.rooms.items()]


manager = ConnectionManager()


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/", response_class=HTMLResponse)
async def index():
    """Minimal HTML frontend — open in multiple tabs to test."""
    return HTMLResponse(content="""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>WebSocket Chat</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;background:#0f1117;color:#f0f2ff;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:2rem 1rem}
    h1{font-size:1.6rem;font-weight:800;margin-bottom:1.5rem}
    .setup{display:flex;gap:.5rem;margin-bottom:1rem;width:100%;max-width:600px}
    input{flex:1;background:#1a1d2e;border:1px solid #2e3250;border-radius:8px;padding:.65rem 1rem;color:#f0f2ff;font-size:.9rem;outline:none}
    input:focus{border-color:#6366f1}
    button{background:#4f46e5;color:#fff;border:none;border-radius:8px;padding:.65rem 1.2rem;font-weight:700;cursor:pointer}
    button:hover{background:#4338ca}
    #messages{width:100%;max-width:600px;height:350px;overflow-y:auto;background:#1a1d2e;border:1px solid #2e3250;border-radius:12px;padding:1rem;margin-bottom:1rem;display:flex;flex-direction:column;gap:.5rem}
    .msg{font-size:.88rem;line-height:1.4}
    .msg.system{color:#8b92b8;font-style:italic}
    .msg.mine{color:#818cf8;font-weight:600}
    .send-row{display:flex;gap:.5rem;width:100%;max-width:600px}
    #status{font-size:.8rem;color:#8b92b8;margin-bottom:.75rem}
  </style>
</head>
<body>
  <h1>💬 WebSocket Chat</h1>
  <div class="setup">
    <input id="room"     placeholder="Room name (e.g. general)" value="general"/>
    <input id="username" placeholder="Your name" value="User"/>
    <button onclick="connect()">Join</button>
  </div>
  <p id="status">Not connected</p>
  <div id="messages"></div>
  <div class="send-row">
    <input id="msgInput" placeholder="Type a message…" onkeydown="if(event.key==='Enter')send()"/>
    <button onclick="send()">Send</button>
  </div>
  <script>
    let ws = null, myName = "";
    function addMsg(text, cls="") {
      const d = document.getElementById("messages");
      const p = document.createElement("p");
      p.className = "msg " + cls;
      p.textContent = text;
      d.appendChild(p);
      d.scrollTop = d.scrollHeight;
    }
    function connect() {
      if (ws) ws.close();
      const room = document.getElementById("room").value.trim() || "general";
      myName = document.getElementById("username").value.trim() || "User";
      ws = new WebSocket(`ws://localhost:8000/ws/${room}/${encodeURIComponent(myName)}`);
      ws.onopen  = () => { document.getElementById("status").textContent = `Connected to #${room} as ${myName}`; };
      ws.onmessage = e => {
        const isMine = e.data.startsWith(`${myName}:`);
        const isSystem = e.data.startsWith("🟢") || e.data.startsWith("🔴");
        addMsg(e.data, isSystem ? "system" : isMine ? "mine" : "");
      };
      ws.onclose = () => { document.getElementById("status").textContent = "Disconnected"; };
    }
    function send() {
      const inp = document.getElementById("msgInput");
      const msg = inp.value.trim();
      if (msg && ws && ws.readyState === 1) { ws.send(msg); inp.value = ""; }
    }
  </script>
</body>
</html>
""")


@app.get("/rooms")
async def list_rooms():
    return manager.room_list()


@app.websocket("/ws/{room}/{username}")
async def websocket_endpoint(ws: WebSocket, room: str, username: str):
    await manager.connect(room, ws, username)
    try:
        while True:
            data = await ws.receive_text()
            await manager.broadcast(room, f"{username}: {data}")
    except WebSocketDisconnect:
        await manager.disconnect(room, ws, username)
