/**
 * ThemeToggle – an accessible toggle button that switches
 * between light and dark mode.
 *
 * Props:
 *   theme        – current theme: 'light' | 'dark'
 *   toggleTheme  – callback to switch the theme
 */
export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle-btn"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="toggle-thumb">
        {isDark ? '🌙' : '☀️'}
      </div>
    </button>
  );
}
