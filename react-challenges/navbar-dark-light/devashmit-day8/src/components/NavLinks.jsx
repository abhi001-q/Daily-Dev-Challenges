const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function NavLinks({ onClick }) {
  return (
    <>
      {LINKS.map(({ href, label }) => (
        <li key={href}><a href={href} onClick={onClick}>{label}</a></li>
      ))}
    </>
  );
}
