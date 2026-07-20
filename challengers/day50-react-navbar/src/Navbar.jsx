import { useState, useEffect, useCallback } from 'react';

const NAV_LINKS = [
  { href: '#home', label: 'Home', icon: '🏠' },
  { href: '#features', label: 'Features', icon: '✨' },
  { href: '#stats', label: 'Stats', icon: '📊' },
  { href: '#contact', label: 'Contact', icon: '📬' },
];

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = useCallback((href) => {
    setActiveLink(href);
    setMenuOpen(false);
  }, []);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="nav-container">
          {/* Logo */}
          <a href="#home" className="nav-logo" onClick={() => handleNavClick('#home')}>
            <div className="logo-icon">🚀</div>
            <span className="logo-text">Dev<span>Hub</span></span>
          </a>

          {/* Desktop Links */}
          <ul className="nav-links" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={activeLink === link.href ? 'active' : ''}
                  onClick={() => handleNavClick(link.href)}
                  aria-current={activeLink === link.href ? 'page' : undefined}
                >
                  <span className="nav-icon">{link.icon}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <div className="toggle-thumb">
                {theme === 'light' ? '☀️' : '🌙'}
              </div>
            </button>

            {/* CTA Button */}
            <a href="#contact" className="nav-cta" onClick={() => handleNavClick('#contact')}>
              Get Started →
            </a>

            {/* Hamburger */}
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

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? ' open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation menu"
        aria-hidden={!menuOpen}
      >
        <ul className="mobile-menu-links" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={activeLink === link.href ? 'active' : ''}
                onClick={() => handleNavClick(link.href)}
              >
                <span>{link.icon}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-divider" />

        <div className="mobile-bottom">
          <span className="mobile-theme-label">
            {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </span>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <div className="toggle-thumb">
              {theme === 'light' ? '☀️' : '🌙'}
            </div>
          </button>
        </div>

        <a href="#contact" className="mobile-cta" onClick={() => handleNavClick('#contact')}>
          🚀 Get Started
        </a>
      </div>
    </>
  );
}
