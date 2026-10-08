/**
 * First focusable element on every page. Visible only on keyboard focus.
 * Pages don't all share a main-landmark id, so this focuses the first <main>.
 */
const SkipLink = () => {
  const skip = (e) => {
    const main = document.querySelector('main');
    if (!main) return;
    e.preventDefault();
    main.setAttribute('tabindex', '-1');
    main.focus();
    main.scrollIntoView();
  };

  return (
    <a
      href="#main"
      onClick={skip}
      className="fixed left-4 top-3 z-[3000] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-overlay transition-transform focus:translate-y-0"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
