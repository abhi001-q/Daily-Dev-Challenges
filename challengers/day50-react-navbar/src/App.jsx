import { useState, useEffect } from 'react';
import Navbar from './Navbar';

const FEATURES = [
  {
    icon: '🌙',
    title: 'Dark / Light Mode',
    desc: 'Seamlessly switch between themes. Your preference is persisted across sessions via localStorage.',
  },
  {
    icon: '📱',
    title: 'Fully Responsive',
    desc: 'Looks stunning on every device — desktop, tablet, and mobile — with a smooth animated mobile menu.',
  },
  {
    icon: '⚡',
    title: 'Glassmorphism Effect',
    desc: 'Frosted glass navbar with backdrop blur and smooth scroll-aware shrinking animation.',
  },
  {
    icon: '♿',
    title: 'Accessible',
    desc: 'Built with ARIA roles, labels, keyboard navigation, and focus management for all users.',
  },
  {
    icon: '🎨',
    title: 'CSS Variables',
    desc: 'Entire theme system powered by CSS custom properties — zero runtime overhead, instant transitions.',
  },
  {
    icon: '🚀',
    title: 'React Hooks',
    desc: 'Leverages useState, useEffect, and useCallback for clean, performant state management.',
  },
];

const STATS = [
  { value: '50', label: 'Days Completed', suffix: '' },
  { value: '500+', label: 'Issues Closed', suffix: '' },
  { value: '14', label: 'Contributors', suffix: '' },
  { value: '100%', label: 'Open Source', suffix: '' },
];

function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return { theme, toggleTheme };
}

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section id="home" className="hero">
        <div>
          <div className="hero-badge">🏆 Day 50 Challenge · Week 8</div>
          <h1>
            Responsive Navbar<br />
            with <span className="gradient-text">Dark / Light Mode</span>
          </h1>
          <p>
            A premium, accessible React navbar featuring glassmorphism, smooth animations,
            theme persistence, and mobile-first responsive design.
          </p>
          <div className="hero-buttons">
            <a href="#features" className="btn-primary" id="explore-btn">
              ✨ Explore Features
            </a>
            <a href="#stats" className="btn-secondary" id="stats-btn">
              📊 View Stats
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features">
        <div className="section">
          <div className="section-header">
            <div className="section-badge">✨ Features</div>
            <h2>Everything you need in a Navbar</h2>
            <p>
              Packed with modern features, this component is production-ready
              and built with accessibility in mind.
            </p>
          </div>
          <div className="cards-grid">
            {FEATURES.map((f, i) => (
              <div className="card" key={i}>
                <div className="card-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats-section">
        <div className="stats-inner">
          {STATS.map((s, i) => (
            <div className="stat-item" key={i}>
              <h3>{s.value}{s.suffix}</h3>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Footer */}
      <section id="contact">
        <div className="footer">
          <p>
            Built with ❤️ for <span>Daily Dev Challenges</span> · Day 50 · Week 8
          </p>
          <p style={{ marginTop: '8px', fontSize: '0.8rem', opacity: 0.6 }}>
            Challenge #627 — Responsive Navbar with Dark/Light Mode [REACT]
          </p>
        </div>
      </section>
    </div>
  );
}
