import { useState } from "react";

const STEPS = ["Personal Info", "Account Setup", "Review"];
const INIT  = { name:"", email:"", phone:"", username:"", password:"", confirm:"" };

function validate(step, d) {
  const e = {};
  if (step === 0) {
    if (!d.name.trim())                          e.name    = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Valid email required";
    if (!/^\d{7,15}$/.test(d.phone.replace(/\s/g,""))) e.phone = "Valid phone required";
  }
  if (step === 1) {
    if (d.username.length < 3) e.username = "Min 3 characters";
    if (d.password.length < 6) e.password = "Min 6 characters";
    if (d.password !== d.confirm) e.confirm = "Passwords do not match";
  }
  return e;
}

export default function App() {
  const [step, setStep]   = useState(0);
  const [data, setData]   = useState(INIT);
  const [errs, setErrs]   = useState({});
  const [done, setDone]   = useState(false);

  const set = k => e => setData(d => ({ ...d, [k]: e.target.value }));

  const next = () => {
    const e = validate(step, data);
    if (Object.keys(e).length) { setErrs(e); return; }
    setErrs({});
    if (step < 2) setStep(s => s + 1);
    else setDone(true);
  };

  const pct = (step / (STEPS.length - 1)) * 100;

  if (done) return (
    <div className="card">
      <div className="success">
        <span>🎉</span>
        <h2>Registration Complete!</h2>
        <p>Welcome, <strong>{data.name}</strong> — @{data.username}</p>
        <button className="btn btn--primary" onClick={() => { setStep(0); setData(INIT); setDone(false); }}>
          Start Over
        </button>
      </div>
    </div>
  );

  return (
    <div className="card">
      {/* Progress */}
      <div className="progress">
        <div className="progress__bar">
          <div className="progress__fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress__labels">
          {STEPS.map((s, i) => (
            <span key={s} className={`progress__step${i <= step ? " active" : ""}`}>{s}</span>
          ))}
        </div>
      </div>

      {/* Step 1 */}
      {step === 0 && <>
        <h2 className="step-title">Personal Info</h2>
        <p className="step-sub">Step 1 of 3</p>
        {[["name","Full Name","John Doe"],["email","Email","john@example.com"],["phone","Phone","555-0000"]].map(([k,l,p]) => (
          <div key={k} className="form-group">
            <label>{l}</label>
            <input className={errs[k]?"error":""} value={data[k]} onChange={set(k)} placeholder={p}/>
            {errs[k] && <span className="err">{errs[k]}</span>}
          </div>
        ))}
      </>}

      {/* Step 2 */}
      {step === 1 && <>
        <h2 className="step-title">Account Setup</h2>
        <p className="step-sub">Step 2 of 3</p>
        {[["username","Username","johndoe",false],["password","Password","Min 6 chars",true],["confirm","Confirm Password","Re-enter",true]].map(([k,l,p,pwd]) => (
          <div key={k} className="form-group">
            <label>{l}</label>
            <input className={errs[k]?"error":""} type={pwd?"password":"text"} value={data[k]} onChange={set(k)} placeholder={p}/>
            {errs[k] && <span className="err">{errs[k]}</span>}
          </div>
        ))}
      </>}

      {/* Step 3 — Review */}
      {step === 2 && <>
        <h2 className="step-title">Review &amp; Submit</h2>
        <p className="step-sub">Step 3 of 3 — Confirm your details</p>
        <div className="review">
          {[["Name",data.name],["Email",data.email],["Phone",data.phone],["Username","@"+data.username],["Password","••••••"]].map(([k,v]) => (
            <div key={k} className="review__row">
              <span className="review__key">{k}</span>
              <span className="review__val">{v}</span>
            </div>
          ))}
        </div>
      </>}

      {/* Actions */}
      <div className="actions">
        {step > 0 && <button className="btn btn--ghost" onClick={() => setStep(s => s - 1)}>← Back</button>}
        <button className="btn btn--primary" onClick={next}>{step < 2 ? "Next →" : "Submit"}</button>
      </div>
    </div>
  );
}
