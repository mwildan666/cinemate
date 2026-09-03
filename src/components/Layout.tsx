import { Outlet, NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import SearchBar from "./SearchBar";
import BurgerButton from "./BurgerButton";
import MobileDrawer from "./MobileDrawer";
import { useMediaQuery } from "../hooks/useMediaQuery";

const links = [
  { to: "/", label: "Home" },
  { to: "/now-playing", label: "Now Playing", shimmer: true },
  { to: "/discover", label: "Discover" },
  { to: "/watchlist", label: "Watchlist" },
];

const SHIMMER_GRADIENT =
  "linear-gradient(90deg, transparent 35%, rgb(0, 212, 255) 50%, transparent 65%)";

// Sweeps a neon-blue highlight across the label text once every 5s (2s sweep
// + 3s pause), by animating a narrow gradient band clipped to the text shape
// on top of the normal (non-transparent) label underneath. The band starts
// and ends fully outside the text bounds so it fades in from nothing and
// fades back out to nothing, rather than freezing mid-word.
const ShimmerText = ({ children }: { children: string }) => {
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  return (
    <span className="relative inline-block">
      {children}
      {!prefersReducedMotion && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-clip-text text-transparent"
          style={{
            backgroundImage: SHIMMER_GRADIENT,
            backgroundSize: "60% 100%",
            backgroundRepeat: "no-repeat",
          }}
          animate={{ backgroundPositionX: ["-100%", "200%"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.span>
      )}
    </span>
  );
};

type Overlay = "none" | "menu" | "search";

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded px-3 py-1 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
    isActive ? "text-accent" : "text-neutral-400 hover:text-white"
  }`;

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openOverlay, setOpenOverlay] = useState<Overlay>("none");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () =>
    setOpenOverlay((current) => (current === "menu" ? "none" : "menu"));
  const closeOverlay = () => setOpenOverlay("none");

  const isChromeSolid = isScrolled || openOverlay !== "none";

  return (
    <div className="min-h-screen bg-black text-white">
      <nav
        aria-label="Main navigation"
        className={`fixed inset-x-0 top-0 z-50 grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b px-4 transition-colors duration-300 ${
          isChromeSolid
            ? "border-neutral-800 bg-neutral-900"
            : "border-transparent bg-transparent"
        }`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${
            isChromeSolid ? "opacity-0" : "opacity-100"
          }`}
        />

        <div className="flex items-center">
          <div className="md:hidden">
            <BurgerButton
              isOpen={openOverlay === "menu"}
              onClick={toggleMenu}
            />
          </div>
          <Link
            to="/"
            aria-label="Cinemate home"
            className="hidden items-center md:flex"
          >
            <img src="/logo.svg" alt="" className="h-12 w-auto" />
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <Link
            to="/"
            aria-label="Cinemate home"
            className="flex items-center md:hidden"
          >
            <img src="/logo.svg" alt="" className="h-9 w-auto" />
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={navLinkClassName}
              >
                {({ isActive }) =>
                  link.shimmer && !isActive ? (
                    <ShimmerText>{link.label}</ShimmerText>
                  ) : (
                    link.label
                  )
                }
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <SearchBar
            isOpen={openOverlay === "search"}
            onOpen={() => setOpenOverlay("search")}
            onClose={closeOverlay}
          />
        </div>
      </nav>

      <MobileDrawer isOpen={openOverlay === "menu"}>
        <nav aria-label="Mobile navigation" className="flex flex-col p-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={closeOverlay}
              className={({ isActive }) =>
                `rounded px-3 py-2.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
                  isActive ? "text-accent" : "text-neutral-300 hover:text-white"
                }`
              }
            >
              {({ isActive }) =>
                link.shimmer && !isActive ? (
                  <ShimmerText>{link.label}</ShimmerText>
                ) : (
                  link.label
                )
              }
            </NavLink>
          ))}
        </nav>
      </MobileDrawer>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
