import{useState,useEffect}from"react";import axios from"axios";
const api=axios.create({baseURL:"/auth",withCredentials:true});
export default function App(){
  const[user,setUser]=useState(null);const[view,setView]=useState("login");
  const[u,setU]=useState("");const[p,setP]=useState("");const[err,setErr]=useState("");const[busy,setBusy]=useState(false);const[checking,setChecking]=useState(true);
  useEffect(()=>{api.get("/me").then(r=>setUser(r.data.username)).catch(()=>{}).finally(()=>setChecking(false));},[]);
  const submit=async e=>{
    e.preventDefault();setErr("");setBusy(true);
    try{const r=await api.post(view==="login"?"/login":"/register",{username:u,password:p});
      if(view==="register"){setView("login");setU("");setP("");return;}setUser(r.data.username);
    }catch(e){setErr(e.response?.data?.detail||"Error");}finally{setBusy(false);}};
  const logout=async()=>{await api.post("/logout");setUser(null);setU("");setP("");};
  if(checking)return null;
  if(user)return(<div className="card"><div className="dash"><span style={{fontSize:"2.5rem"}}>🎉</span><h1>Dashboard</h1><p>Logged in as</p><p className="usr">@{user}</p><p className="note">httpOnly cookie — XSS safe</p><button className="btn btn-d" onClick={logout}>Logout</button></div></div>);
  return(<div className="card"><h1>{view==="login"?"🔐 Sign In":"📝 Register"}</h1><p>{view==="login"?"Welcome back":"Create account"}</p>
    <form onSubmit={submit}>
      <div className="fg"><label>Username</label><input value={u} onChange={e=>setU(e.target.value)} placeholder="username" required autoFocus/></div>
      <div className="fg"><label>Password</label><input type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="••••••" required/></div>
      {err&&<p className="err">⚠️ {err}</p>}
      <button className="btn btn-p" disabled={busy}>{busy?"…":view==="login"?"Sign In":"Create Account"}</button>
    </form>
    <button className="lnk" onClick={()=>{setView(v=>v==="login"?"register":"login");setErr("");}}>
      {view==="login"?"No account? Register":"Have account? Sign in"}
    </button>
  </div>);
}
