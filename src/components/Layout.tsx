import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/now-playing", label: "Now Playing" },
  { to: "/upcoming", label: "Upcoming" },
  { to: "/popular", label: "Popular" },
  { to: "/top-rated", label: "Top Rated" },
];

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav
        aria-label="Main navigation"
        className={`fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-center gap-2 border-b transition-colors duration-300 ${
          isScrolled
            ? "border-neutral-800 bg-neutral-900"
            : "border-transparent bg-transparent"
        }`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${
            isScrolled ? "opacity-0" : "opacity-100"
          }`}
        />
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `px-3 py-1 rounded text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
                isActive ? "text-accent" : "text-neutral-400 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
