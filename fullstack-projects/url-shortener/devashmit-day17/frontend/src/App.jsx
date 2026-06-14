import{useState,useEffect,useCallback}from"react";
const API="http://localhost:8000";
export default function App(){
  const[url,setUrl]=useState("");const[result,setResult]=useState(null);const[analytics,setAnalytics]=useState([]);
  const[loading,setLoading]=useState(false);const[error,setError]=useState("");const[copied,setCopied]=useState(false);
  const fetchA=useCallback(async()=>{try{const r=await fetch(`${API}/analytics`);if(r.ok)setAnalytics(await r.json());}catch{}},[]);
  useEffect(()=>{fetchA();},[fetchA]);
  const submit=async e=>{
    e.preventDefault();setError("");setResult(null);if(!url.trim())return;setLoading(true);
    try{const r=await fetch(`${API}/shorten`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url})});
      if(!r.ok){const d=await r.json();throw new Error(d.detail||"Error");}
      setResult(await r.json());setUrl("");fetchA();
    }catch(e){setError(e.message);}finally{setLoading(false);};};
  const copy=()=>{if(!result)return;navigator.clipboard.writeText(result.short_url).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});};
  return(
    <div className="app">
      <div><h1>🔗 URL Shortener</h1><p className="sub">Shorten links and track clicks</p></div>
      <form className="form" onSubmit={submit}>
        <input type="url" placeholder="https://example.com/long/url" value={url} onChange={e=>setUrl(e.target.value)} aria-label="URL"/>
        <button className="btn" disabled={loading||!url.trim()}>{loading?"…":"Shorten"}</button>
      </form>
      {error&&<p className="error" role="alert">⚠️ {error}</p>}
      {result&&<div className="result"><a href={result.short_url} target="_blank" rel="noopener noreferrer">{result.short_url}</a><button className={`copy-btn${copied?" copied":""}`} onClick={copy}>{copied?"✓ Copied":"Copy"}</button></div>}
      <section className="analytics"><h2>Analytics</h2>
        {analytics.length===0?<p className="empty">No links yet.</p>:(
          <table className="table"><thead><tr><th>Code</th><th>Original URL</th><th>Clicks</th></tr></thead>
          <tbody>{analytics.map(a=><tr key={a.code}><td className="code">/{a.code}</td><td className="orig" title={a.original}>{a.original}</td><td className="clk">{a.clicks}</td></tr>)}</tbody>
          </table>)}
      </section>
    </div>
  );
}
