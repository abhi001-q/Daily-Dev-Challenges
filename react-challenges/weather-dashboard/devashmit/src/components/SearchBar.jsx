import { useState } from "react";
export default function SearchBar({ onSearch, loading }) {
  const [val, setVal] = useState("");
  const submit = (e) => { e.preventDefault(); if (val.trim()) onSearch(val.trim()); };
  return (
    <form className="search-bar" onSubmit={submit}>
      <input className="search-bar__input" value={val} onChange={e => setVal(e.target.value)} placeholder="Search city…" aria-label="City name" autoFocus />
      <button className="search-bar__btn" disabled={loading || !val.trim()}>{loading ? "…" : "Search"}</button>
    </form>
  );
}
