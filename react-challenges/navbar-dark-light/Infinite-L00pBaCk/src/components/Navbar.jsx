import { useState, useEffect, useCallback } from 'react';
import NavLinks from './NavLinks';
import ThemeToggle from './ThemeToggle';

/**
 * Navbar – fully responsive navigation bar with:
 *  - Glassmorphism + scroll-aware shrink effect
 *  - Desktop nav links via <NavLinks>
 *  - Dark/light toggle via <ThemeToggle>
 *  - Animated hamburger menu for mobile
 *  - ARIA accessibility attributes
 *
 * Props:
 *   theme       – 'light' | 'dark'
 *   toggleTheme – callback to flip the theme
 */
export default function Navbar({ theme, toggleTheme }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  // Shrink navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu when viewport grows to desktop size
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLinkClick = useCallback((href) => {
    setActiveLink(href);
    setMenuOpen(false);
  }, []);

  return (
    <>
      {/* ── Desktop / Main Navbar ── */}
      <nav
        className={`navbar${scrolled ? ' scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav-container">

          {/* Logo */}
          <a href="#home" className="nav-logo" onClick={() => handleLinkClick('#home')}>
            <div className="logo-icon">🚀</div>
            <span className="logo-text">Dev<span>Hub</span></span>
          </a>

          {/* Desktop Links */}
          <ul className="nav-links" role="list">
            <NavLinks activeLink={activeLink} onLinkClick={handleLinkClick} />
          </ul>

          {/* Right-side actions */}
          <div className="nav-actions">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            <a
              href="#contact"
              className="nav-cta"
              onClick={() => handleLinkClick('#contact')}
            >
              Get Started →
            </a>

            {/* Hamburger button (mobile only) */}
            <button
              id="hamburger-btn"
              className={`hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Slide-down Menu ── */}
      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? ' open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation menu"
        aria-hidden={!menuOpen}
      >
        <ul className="mobile-menu-links" role="list">
          <NavLinks activeLink={activeLink} onLinkClick={handleLinkClick} />
        </ul>

        <div className="mobile-divider" />

        <div className="mobile-bottom">
          <span className="mobile-theme-label">
            {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </span>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        <a
          href="#contact"
          className="mobile-cta"
          onClick={() => handleLinkClick('#contact')}
        >
          🚀 Get Started
        </a>
      </div>
    </>
  );
}
