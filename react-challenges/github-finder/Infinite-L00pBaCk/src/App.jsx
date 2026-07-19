import { useState } from 'react';
import useFetch from './hooks/useFetch';
import './index.css';

/* Inline SVG Icons */
const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
);
const BuildingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const SkeletonLoader = () => (
  <div className="glass-panel profile-card skeleton">
    <div className="profile-header">
      <div className="skeleton-avatar"></div>
      <div className="profile-info" style={{ flex: 1 }}>
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-subtitle"></div>
      </div>
    </div>
    <div className="skeleton-line skeleton-text"></div>
    <div className="skeleton-line skeleton-text" style={{ width: '80%' }}></div>
    
    <div className="stats-grid">
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
    </div>
  </div>
);

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [currentSearch, setCurrentSearch] = useState('abhishek-goswami1');
  const { userData, repos, loading, error, fetchData } = useFetch(currentSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCurrentSearch(searchInput.trim());
      fetchData(searchInput.trim());
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="app-container">
      {/* Search Section */}
      <div className="glass-panel search-container">
        <SearchIcon />
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search GitHub username..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </div>

      {/* Content Section */}
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <div className="glass-panel error-message">
          <h2>Oops! {error}</h2>
          <p>Try searching for another username.</p>
        </div>
      ) : userData && (
        <div className="glass-panel profile-card">
          <div className="profile-header">
            <div className="avatar-container">
              <img src={userData.avatar_url} alt={userData.name} className="avatar" />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{userData.name || userData.login}</h1>
              <a href={userData.html_url} target="_blank" rel="noopener noreferrer" className="profile-username">
                <UserIcon /> @{userData.login}
              </a>
              <span className="profile-joined">Joined {formatDate(userData.created_at)}</span>
            </div>
          </div>

          {userData.bio && <p className="profile-bio">{userData.bio}</p>}

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Repos</span>
              <span className="stat-value">{userData.public_repos}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Followers</span>
              <span className="stat-value">{userData.followers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Following</span>
              <span className="stat-value">{userData.following}</span>
            </div>
          </div>

          <div className="details-grid">
            {userData.location && (
              <div className="detail-item">
                <MapPinIcon />
                <span>{userData.location}</span>
              </div>
            )}
            {userData.blog && (
              <div className="detail-item">
                <LinkIcon />
                <a href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`} target="_blank" rel="noopener noreferrer">
                  {userData.blog}
                </a>
              </div>
            )}
            {userData.twitter_username && (
              <div className="detail-item">
                <XIcon />
                <a href={`https://twitter.com/${userData.twitter_username}`} target="_blank" rel="noopener noreferrer">
                  @{userData.twitter_username}
                </a>
              </div>
            )}
            {userData.company && (
              <div className="detail-item">
                <BuildingIcon />
                <span>{userData.company}</span>
              </div>
            )}
          </div>
          
          {/* Top Repositories Section */}
          {repos.length > 0 && (
            <div className="repos-section">
              <h3 className="repos-title">Top Repositories</h3>
              <div className="repos-list">
                {repos.map(repo => (
                  <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-card">
                    <h4>{repo.name}</h4>
                    {repo.description && <p>{repo.description}</p>}
                    <div className="repo-stats">
                      <span>⭐ {repo.stargazers_count}</span>
                      <span>🍴 {repo.forks_count}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
