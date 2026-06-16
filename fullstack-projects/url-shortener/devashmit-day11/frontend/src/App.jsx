import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:8000";

export default function App() {
  const [url,       setUrl]       = useState("");
  const [result,    setResult]    = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [copied,    setCopied]    = useState(false);

  // Fetch analytics — called on mount and after each shorten
  const fetchAnalytics = useCallback(async () => {
    try {
      const r = await fetch(`${API}/analytics`);
      if (r.ok) setAnalytics(await r.json());
    } catch {
      // non-critical — silently fail
    }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setResult(null);
    if (!url.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/shorten`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url }),
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d.detail || "Failed to shorten");
      }
      const data = await r.json();
      setResult(data);
      setUrl("");
      fetchAnalytics();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.short_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="app">
      <div>
        <h1>🔗 URL Shortener</h1>
        <p className="subtitle">Shorten any link and track how often it's clicked.</p>
      </div>

      {/* Shorten form */}
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="https://example.com/very/long/url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          aria-label="URL to shorten"
        />
        <button className="btn" disabled={loading || !url.trim()}>
          {loading ? "…" : "Shorten"}
        </button>
      </form>

      {error && <p className="error" role="alert">⚠️ {error}</p>}

      {/* Result card */}
      {result && (
        <div className="result" role="region" aria-label="Shortened URL">
          <a href={result.short_url} target="_blank" rel="noopener noreferrer">
            {result.short_url}
          </a>
          <button
            className={`copy-btn${copied ? " copied" : ""}`}
            onClick={handleCopy}
            aria-label="Copy to clipboard"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      )}

      {/* Analytics */}
      <section className="analytics-section" aria-label="Link analytics">
        <h2>Analytics</h2>
        {analytics.length === 0 ? (
          <p className="empty">No links yet — create one above!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Original URL</th>
                <th>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map(a => (
                <tr key={a.code}>
                  <td className="code">/{a.code}</td>
                  <td className="original" title={a.original}>{a.original}</td>
                  <td className="clicks">{a.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
