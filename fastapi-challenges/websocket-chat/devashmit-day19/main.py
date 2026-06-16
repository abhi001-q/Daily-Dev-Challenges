"""Real-time Chat with WebSockets — Day 19 FastAPI | Author: devashmit"""
from fastapi import FastAPI,WebSocket,WebSocketDisconnect
from fastapi.responses import HTMLResponse

app=FastAPI(title="WebSocket Chat")

class Manager:
    def __init__(self):self.rooms:dict[str,list[tuple]]={}
    async def connect(self,room,ws,name):
        await ws.accept()
        if room not in self.rooms:self.rooms[room]=[]
        self.rooms[room].append((ws,name))
        await self.broadcast(room,f"🟢 {name} joined",exclude=ws)
    async def disconnect(self,room,ws,name):
        if room in self.rooms:
            self.rooms[room]=[(w,u) for w,u in self.rooms[room] if w is not ws]
            if not self.rooms[room]:del self.rooms[room]
        await self.broadcast(room,f"🔴 {name} left")
    async def broadcast(self,room,msg,exclude=None):
        if room not in self.rooms:return
        for ws,_ in self.rooms[room]:
            if ws is not exclude:
                try:await ws.send_text(msg)
                except:pass

manager=Manager()

@app.get("/",response_class=HTMLResponse)
async def index():
    return HTMLResponse("""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>WS Chat</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#0f1117;color:#f0f2ff;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:2rem 1rem}h1{font-size:1.6rem;font-weight:800;margin-bottom:1.5rem}.setup{display:flex;gap:.5rem;margin-bottom:1rem;width:100%;max-width:600px}input{flex:1;background:#1a1d2e;border:1px solid #2e3250;border-radius:8px;padding:.65rem 1rem;color:#f0f2ff;font-size:.9rem;outline:none}input:focus{border-color:#6366f1}button{background:#4f46e5;color:#fff;border:none;border-radius:8px;padding:.65rem 1.2rem;font-weight:700;cursor:pointer}#messages{width:100%;max-width:600px;height:350px;overflow-y:auto;background:#1a1d2e;border:1px solid #2e3250;border-radius:12px;padding:1rem;margin-bottom:1rem;display:flex;flex-direction:column;gap:.5rem}.msg{font-size:.88rem}.system{color:#8b92b8;font-style:italic}.mine{color:#818cf8;font-weight:600}.send-row{display:flex;gap:.5rem;width:100%;max-width:600px}#status{font-size:.8rem;color:#8b92b8;margin-bottom:.75rem}</style></head>
<body>
<h1>💬 WebSocket Chat</h1>
<div class="setup">
  <input id="room" placeholder="Room" value="general"/>
  <input id="username" placeholder="Name" value="User"/>
  <button onclick="connect()">Join</button>
</div>
<p id="status">Not connected</p>
<div id="messages"></div>
<div class="send-row"><input id="msgInput" placeholder="Message…" onkeydown="if(event.key==='Enter')send()"/><button onclick="send()">Send</button></div>
<script>
let ws=null,myName="";
function add(t,c=""){const d=document.getElementById("messages");const p=document.createElement("p");p.className="msg "+c;p.textContent=t;d.appendChild(p);d.scrollTop=d.scrollHeight;}
function connect(){if(ws)ws.close();const room=document.getElementById("room").value.trim()||"general";myName=document.getElementById("username").value.trim()||"User";ws=new WebSocket(`ws://localhost:8000/ws/${room}/${encodeURIComponent(myName)}`);ws.onopen=()=>{document.getElementById("status").textContent=`Connected to #${room} as ${myName}`;};ws.onmessage=e=>{const sys=e.data.startsWith("🟢")||e.data.startsWith("🔴");const mine=e.data.startsWith(`${myName}:`);add(e.data,sys?"system":mine?"mine":"");};ws.onclose=()=>{document.getElementById("status").textContent="Disconnected";};}
function send(){const i=document.getElementById("msgInput");const m=i.value.trim();if(m&&ws&&ws.readyState===1){ws.send(m);i.value="";}}
</script></body></html>""")

@app.websocket("/ws/{room}/{username}")
async def ws_ep(ws:WebSocket,room:str,username:str):
    await manager.connect(room,ws,username)
    try:
        while True:
            data=await ws.receive_text()
            await manager.broadcast(room,f"{username}: {data}")
    except WebSocketDisconnect:
        await manager.disconnect(room,ws,username)
