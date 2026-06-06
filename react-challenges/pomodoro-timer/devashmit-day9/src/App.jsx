import { useEffect, useReducer } from "react";

const MODES = { work: { label:"Work", duration:25*60 }, break: { label:"Break", duration:5*60 } };
const INIT = { mode:"work", timeLeft:25*60, running:false, sessions:0 };

function reducer(s, a) {
  switch(a.type) {
    case "START": return {...s, running:true};
    case "PAUSE": return {...s, running:false};
    case "RESET": return {...s, running:false, timeLeft:MODES[s.mode].duration};
    case "TICK":
      if (s.timeLeft <= 1) {
        const next = s.mode==="work"?"break":"work";
        return {mode:next, timeLeft:MODES[next].duration, running:false, sessions:s.sessions+(s.mode==="work"?1:0)};
      }
      return {...s, timeLeft:s.timeLeft-1};
    case "SET_MODE": return {mode:a.m, timeLeft:MODES[a.m].duration, running:false, sessions:s.sessions};
    default: return s;
  }
}

const fmt = t => `${String(Math.floor(t/60)).padStart(2,"0")}:${String(t%60).padStart(2,"0")}`;

export default function App() {
  const [s, dispatch] = useReducer(reducer, INIT);

  useEffect(() => { document.title = `${fmt(s.timeLeft)} — ${MODES[s.mode].label}`; }, [s.timeLeft, s.mode]);

  useEffect(() => {
    if (!s.running) return;
    const id = setInterval(() => dispatch({type:"TICK"}), 1000);
    return () => clearInterval(id);
  }, [s.running]);

  const filled = s.sessions%4===0&&s.sessions>0 ? 4 : s.sessions%4;

  return (
    <div className="app">
      <div className="mode-tabs" role="tablist">
        {Object.entries(MODES).map(([k,{label}]) => (
          <button key={k} role="tab" aria-selected={s.mode===k}
            className={`mode-tab${s.mode===k?" active":""}`}
            onClick={()=>dispatch({type:"SET_MODE",m:k})}>{label}</button>
        ))}
      </div>
      <div className="timer-card">
        <p className="timer-label">{MODES[s.mode].label}</p>
        <div className={`timer-display ${s.mode}`} role="timer">{fmt(s.timeLeft)}</div>
        <div className="controls">
          {!s.running
            ? <button className="btn btn--start" onClick={()=>dispatch({type:"START"})}>▶ Start</button>
            : <button className="btn btn--pause" onClick={()=>dispatch({type:"PAUSE"})}>⏸ Pause</button>}
          <button className="btn btn--reset" onClick={()=>dispatch({type:"RESET"})}>↺ Reset</button>
        </div>
        <div className="sessions">
          <p className="sessions__label">Sessions</p>
          <div className="dots">{Array.from({length:4},(_,i)=><div key={i} className={`dot${i<filled?" filled":""}`}/>)}</div>
          <p className="sessions__count">{s.sessions} completed</p>
        </div>
      </div>
    </div>
  );
}
