import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { navItems } from "../data/navigation";
import {
  animateMobileMenuOpen,
  animateMobileMenuClose,
  animateStaggerMenuItems,
} from "../animations";

const CLOSE_ANIMATION_MS = 450;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pillClass = ({ isActive }) =>
  `group inline-flex items-center gap-1.5 md:gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-base transition ${
    isActive ? "bg-white text-black" : "text-white/90 hover:text-white hover:bg-white/10"
  }`;

const ctaClass = ({ isActive }) =>
  `group inline-flex items-center gap-1.5 md:gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-base font-semibold transition ${
    isActive
      ? "bg-gradient-to-r from-google-blue via-google-green to-google-blue text-white shadow-lg"
      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
  }`;

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const drawerRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (isMenuOpen) {
      isClosingRef.current = false;
      document.body.style.overflow = "hidden";
      animateMobileMenuOpen(drawerRef.current);
      animateStaggerMenuItems(".mobile-nav-item");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Clear any pending close timer if the component unmounts mid-close.
  useEffect(() => () => window.clearTimeout(closeTimeoutRef.current), []);

  const closeMenu = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    if (prefersReducedMotion()) {
      setIsMenuOpen(false);
      isClosingRef.current = false;
      return;
    }

    animateMobileMenuClose(drawerRef.current);
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsMenuOpen(false);
      isClosingRef.current = false;
    }, CLOSE_ANIMATION_MS);
  };

  return (
    <>
      <div role="navigation" className="fixed top-3 left-1/2 -translate-x-1/2 z-[1000] w-full px-4 md:w-auto md:px-0">
        {/* Desktop / tablet pill nav */}
        <div className="hidden md:flex items-center gap-1 md:gap-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-1.5 py-1.5 md:px-3 md:py-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)] mx-auto w-fit">
          {navItems.map((item) =>
            item.cta ? (
              <NavLink key={item.label} to={item.path} className={ctaClass}>
                <span className="inline-block size-1.5 md:size-2 rounded-full bg-google-green animate-pulse" />
                <span>{item.label}</span>
              </NavLink>
            ) : (
              <NavLink key={item.label} to={item.path} className={pillClass}>
                <span>{item.label}</span>
              </NavLink>
            )
          )}
        </div>

        {/* Mobile top bar: brand + hamburger */}
        <div className="flex md:hidden items-center justify-between rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          <NavLink to="/" className="text-white font-semibold text-sm tracking-wide">
            GDG ViMEET
          </NavLink>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
            className="inline-flex items-center justify-center size-8 rounded-full text-white hover:bg-white/10 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer — portaled to <body> so it mounts/unmounts in its own
          DOM subtree, isolated from GSAP ScrollTrigger's pinning (Hero uses
          pin: true, which inserts wrapper nodes directly into the DOM and
          desyncs React's view of its siblings if a drawer is toggled in the
          same parent — causes an "insertBefore" reconciliation crash). */}
      {isMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[1100] md:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={closeMenu}
            />
            <div
              ref={drawerRef}
              className="absolute top-0 right-0 h-full w-[78%] max-w-xs bg-neutral-950 border-l border-white/10 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-end mb-8">
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center size-8 rounded-full text-white hover:bg-white/10 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `mobile-nav-item rounded-xl px-4 py-3 text-base font-medium transition ${
                        item.cta
                          ? "bg-gradient-to-r from-google-blue via-google-green to-google-blue text-white text-center"
                          : isActive
                          ? "bg-white text-black"
                          : "text-white/90 hover:bg-white/10"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default NavBar;
