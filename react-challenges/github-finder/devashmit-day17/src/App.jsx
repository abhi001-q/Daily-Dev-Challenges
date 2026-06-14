import{useState}from"react";import{useFetch}from"./hooks/useFetch";
const GH="https://api.github.com";
export default function App(){
  const[username,setUsername]=useState("");const[query,setQuery]=useState("");
  const{data:user,loading:ul,error:ue}=useFetch(query?`${GH}/users/${query}`:null);
  const{data:repos}=useFetch(user?`${GH}/users/${query}/repos?per_page=100&sort=pushed`:null);
  const loading=ul;
  const top5=repos?[...repos].sort((a,b)=>b.stargazers_count-a.stargazers_count).slice(0,5):null;
  return(<div className="app">
    <div className="app__header"><h1>🐙 GitHub Profile Finder</h1><p>Search any GitHub username</p></div>
    <form className="search-bar" onSubmit={e=>{e.preventDefault();if(username.trim())setQuery(username.trim());}}>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Search username…" autoFocus aria-label="GitHub username"/>
      <button disabled={loading||!username.trim()}>{loading?"…":"Search"}</button>
    </form>
    {loading&&<div className="skeleton skeleton--card" aria-busy="true"/>}
    {!loading&&ue&&<div className="error-card" role="alert"><span>⚠️</span><p>{ue}</p></div>}
    {!loading&&user&&(
      <div className="profile">
        <div className="profile__header">
          <img className="profile__avatar" src={user.avatar_url} alt={user.login} width={90} height={90}/>
          <div>
            <p className="profile__name">{user.name||user.login}</p>
            <a className="profile__login" href={user.html_url} target="_blank" rel="noopener noreferrer">@{user.login}</a>
            {user.bio&&<p className="profile__bio">{user.bio}</p>}
          </div>
        </div>
        <div className="profile__stats">
          <div className="stat"><span className="stat__num">{user.public_repos.toLocaleString()}</span><span className="stat__label">Repos</span></div>
          <div className="stat"><span className="stat__num">{user.followers.toLocaleString()}</span><span className="stat__label">Followers</span></div>
          <div className="stat"><span className="stat__num">{user.following.toLocaleString()}</span><span className="stat__label">Following</span></div>
        </div>
        {top5&&top5.length>0&&(
          <div className="repos">
            <h3>Top Repositories</h3>
            <ul>{top5.map(r=>(
              <li key={r.id} className="repo">
                <a href={r.html_url} target="_blank" rel="noopener noreferrer">📁 {r.name}</a>
                {r.description&&<p className="repo__desc">{r.description}</p>}
                <div className="repo__meta"><span>⭐ {r.stargazers_count}</span>{r.language&&<span>🔵 {r.language}</span>}</div>
              </li>
            ))}</ul>
          </div>
        )}
      </div>
    )}
    {!loading&&!user&&!ue&&<div className="empty"><span>👆</span><p>Enter a GitHub username above</p></div>}
  </div>);
}
