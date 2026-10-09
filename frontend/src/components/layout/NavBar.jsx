import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../../data/navigation';
import { getRecruitmentCta } from '../../data/recruitment';
import useFocusTrap from '../../hooks/useFocusTrap';
import useModalOpen from '../../hooks/useModalOpen';
import Button from '../ui/Button';
import ColorStroke from '../ui/ColorStroke';
import Icon from '../ui/Icon';
import Wordmark from '../ui/Wordmark';
import Container from './Container';

const isActivePath = (itemPath, pathname) =>
  itemPath === '/' ? pathname === '/' : pathname === itemPath || pathname.startsWith(`${itemPath}/`);

const CtaButton = ({ cta, size = 'sm', className = '', onClick }) => (
  <Button
    size={size}
    className={className}
    onClick={onClick}
    aria-label={cta.ariaLabel}
    icon={cta.external ? 'external' : 'arrow-right'}
    {...(cta.external ? { href: cta.href } : { to: cta.href })}
  >
    {cta.label}
  </Button>
);

/** Slide-in dialog for < lg. Focus-trapped, Esc closes, focus returns to the toggle. */
const MobileMenu = ({ pathname, cta, onClose }) => {
  const panelRef = useRef(null);
  const [shown, setShown] = useState(false);

  // Mount hidden, then transition in on the next frame.
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useFocusTrap(panelRef, true, onClose);
  useModalOpen(true);

  // Lock page scroll while the menu is open.
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[2100] lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={-1}
        onClick={onClose}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-[var(--dur-base)] ease-standard ${shown ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute right-0 top-0 flex h-full w-[min(86%,22rem)] flex-col bg-surface p-5 shadow-overlay transition-transform duration-[var(--dur-slow)] ease-emphasized ${shown ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between">
          <Wordmark onClick={onClose} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-2"
          >
            <Icon name="close" className="size-6" />
          </button>
        </div>

        <ColorStroke className="mt-5 h-[3px] w-full" />

        <nav aria-label="Mobile" className="mt-4">
          <ul className="flex flex-col">
            {navItems.map((item) => {
              const active = isActivePath(item.path, pathname);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-14 items-center border-b border-line px-1 text-lg font-medium transition-colors ${active ? 'text-primary' : 'text-ink hover:text-primary'}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-6">
          <CtaButton cta={cta} size="md" className="w-full" onClick={onClose} />
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * Primary navigation. Transparent over the home hero → solid white +
 * border + soft shadow once scrolled (and always solid on inner pages).
 * The active item gets the four-colour stroke, which slides between items.
 */
const NavBar = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const cta = getRecruitmentCta();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicator, setIndicator] = useState({ x: 0, w: 0, visible: false });
  const linkRefs = useRef({});
  const toggleRef = useRef(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Solid background once the page has scrolled a few pixels. An
  // IntersectionObserver watching a sentinel at the top of the page replaces a
  // scroll listener: reading window.scrollY every frame forces a synchronous
  // layout (costly while the story animates); the observer costs nothing per frame.
  const sentinelRef = useRef(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Place the sliding stroke under the active link; re-measure on resize and
  // once webfonts have loaded (text width changes when Inter swaps in).
  useLayoutEffect(() => {
    const measure = () => {
      const active = navItems.find((item) => isActivePath(item.path, pathname));
      const el = active && linkRefs.current[active.path];
      setIndicator(el ? { x: el.offsetLeft, w: el.offsetWidth, visible: true } : { x: 0, w: 0, visible: false });
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [pathname]);

  const solid = scrolled || !isHome || menuOpen;

  return (
    <>
      {/* Top-of-page sentinel for the solid-on-scroll header (see above). */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-2 w-px"
      />
      <header
        className={`fixed inset-x-0 top-0 z-[1000] h-[var(--nav-h)] border-b transition-[background-color,box-shadow,border-color] duration-[var(--dur-base)] ease-standard ${
          solid ? 'border-line bg-surface shadow-rest' : 'border-transparent bg-transparent'
        }`}
      >
        <Container className="flex h-full items-center justify-between gap-6">
          <Wordmark />

          <nav aria-label="Primary" className="relative hidden h-full items-center lg:flex">
            <ul className="flex items-center">
              {navItems.map((item) => {
                const active = isActivePath(item.path, pathname);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      ref={(el) => {
                        linkRefs.current[item.path] = el;
                      }}
                      aria-current={active ? 'page' : undefined}
                      className={`inline-flex min-h-11 items-center px-4 text-[0.9375rem] font-medium transition-colors duration-[var(--dur-fast)] ${
                        active ? 'text-ink' : 'text-ink-2 hover:text-ink'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* One element slides between links: translateX + scaleX only (compositor-friendly). */}
            <span
              aria-hidden="true"
              className="color-stroke absolute bottom-0 left-0 h-[3px] w-[100px] origin-left rounded-full transition-[transform,opacity] duration-[var(--dur-slow)] ease-emphasized"
              style={{
                transform: `translateX(${indicator.x}px) scaleX(${indicator.w / 100})`,
                opacity: indicator.visible ? 1 : 0,
              }}
            />
          </nav>

          <div className="flex items-center gap-2">
            {/* Wrapper (not a class on the button): Button already sets display:inline-flex, which beat `hidden`. */}
            <div className="hidden lg:block">
              <CtaButton cta={cta} />
            </div>
            <button
              ref={toggleRef}
              type="button"
              onClick={(e) => {
                // Safari does not focus buttons on click; focusing explicitly
                // lets the focus trap hand focus back here when the menu closes.
                e.currentTarget.focus();
                setMenuOpen(true);
              }}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-2 lg:hidden"
            >
              <Icon name="menu" className="size-6" />
            </button>
          </div>
        </Container>
      </header>

      {menuOpen && <MobileMenu pathname={pathname} cta={cta} onClose={closeMenu} />}
    </>
  );
};

export default NavBar;
