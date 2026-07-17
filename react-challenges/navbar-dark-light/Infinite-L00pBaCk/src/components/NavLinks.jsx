const NAV_LINKS = [
  { href: '#home',     label: 'Home',     icon: '🏠' },
  { href: '#features', label: 'Features', icon: '✨' },
  { href: '#stats',    label: 'Stats',    icon: '📊' },
  { href: '#contact',  label: 'Contact',  icon: '📬' },
];

/**
 * NavLinks – renders the list of anchor links.
 * Used in both desktop nav and mobile menu.
 *
 * Props:
 *   activeLink  – currently active href string
 *   onLinkClick – callback(href) when a link is clicked
 */
export default function NavLinks({ activeLink, onLinkClick }) {
  return (
    <>
      {NAV_LINKS.map(({ href, label, icon }) => (
        <li key={href}>
          <a
            href={href}
            className={activeLink === href ? 'active' : ''}
            onClick={() => onLinkClick(href)}
            aria-current={activeLink === href ? 'page' : undefined}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </a>
        </li>
      ))}
    </>
  );
}
