import { useState } from "react";

const STEPS = ["Personal Info", "Account Setup", "Review"];

const INIT = { name:"", email:"", phone:"", username:"", password:"", confirm:"" };

function validate(step, data) {
  const errs = {};
  if (step === 0) {
    if (!data.name.trim()) errs.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Valid email required";
    if (!/^\d{7,15}$/.test(data.phone.replace(/\s/g,""))) errs.phone = "Valid phone required";
  }
  if (step === 1) {
    if (data.username.length < 3) errs.username = "Min 3 characters";
    if (data.password.length < 6) errs.password = "Min 6 characters";
    if (data.password !== data.confirm) errs.confirm = "Passwords do not match";
  }
  return errs;
}

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INIT);
  const [errs, setErrs] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setData(d => ({ ...d, [k]: e.target.value }));

  const next = () => {
    const e = validate(step, data);
    if (Object.keys(e).length) { setErrs(e); return; }
    setErrs({});
    if (step < 2) setStep(s => s + 1);
    else setSubmitted(true);
  };

  const pct = ((step) / (STEPS.length - 1)) * 100;

  if (submitted) return (
    <div className="card">
      <div className="success">
        <span className="success__icon">🎉</span>
        <h2>Registration Complete!</h2>
        <p>Welcome, <strong>{data.name}</strong>. Your account <strong>@{data.username}</strong> is ready.</p>
        <button className="btn--success" onClick={() => { setStep(0); setData(INIT); setSubmitted(false); }}>Start Over</button>
      </div>
    </div>
  );

  return (
    <div className="card">
      {/* Progress */}
      <div className="progress">
        <div className="progress__bar"><div className="progress__fill" style={{ width: `${pct}%` }} /></div>
        <div className="progress__labels">
          {STEPS.map((s, i) => <span key={s} className={`progress__step${i <= step ? " active" : ""}`}>{s}</span>)}
        </div>
      </div>

      {/* Step 1 */}
      {step === 0 && <>
        <h2 className="step-title">Personal Info</h2>
        <p className="step-sub">Step 1 of 3 — Tell us about yourself</p>
        <div className="form-group"><label>Full Name</label>
          <input className={errs.name?"error":""} value={data.name} onChange={set("name")} placeholder="John Doe" />
          {errs.name && <span className="err">{errs.name}</span>}
        </div>
        <div className="form-group"><label>Email</label>
          <input className={errs.email?"error":""} type="email" value={data.email} onChange={set("email")} placeholder="john@example.com" />
          {errs.email && <span className="err">{errs.email}</span>}
        </div>
        <div className="form-group"><label>Phone</label>
          <input className={errs.phone?"error":""} value={data.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
          {errs.phone && <span className="err">{errs.phone}</span>}
        </div>
      </>}

      {/* Step 2 */}
      {step === 1 && <>
        <h2 className="step-title">Account Setup</h2>
        <p className="step-sub">Step 2 of 3 — Create your credentials</p>
        <div className="form-group"><label>Username</label>
          <input className={errs.username?"error":""} value={data.username} onChange={set("username")} placeholder="johndoe" />
          {errs.username && <span className="err">{errs.username}</span>}
        </div>
        <div className="form-group"><label>Password</label>
          <input className={errs.password?"error":""} type="password" value={data.password} onChange={set("password")} placeholder="Min 6 characters" />
          {errs.password && <span className="err">{errs.password}</span>}
        </div>
        <div className="form-group"><label>Confirm Password</label>
          <input className={errs.confirm?"error":""} type="password" value={data.confirm} onChange={set("confirm")} placeholder="Re-enter password" />
          {errs.confirm && <span className="err">{errs.confirm}</span>}
        </div>
      </>}

      {/* Step 3 — Review */}
      {step === 2 && <>
        <h2 className="step-title">Review &amp; Submit</h2>
        <p className="step-sub">Step 3 of 3 — Confirm your details</p>
        <div className="review">
          {[["Name",data.name],["Email",data.email],["Phone",data.phone],["Username","@"+data.username],["Password","••••••"]].map(([k,v])=>(
            <div key={k} className="review__row"><span className="review__key">{k}</span><span className="review__val">{v}</span></div>
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
