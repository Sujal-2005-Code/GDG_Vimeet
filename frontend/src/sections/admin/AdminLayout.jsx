import { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import Wordmark from '../../components/ui/Wordmark';
import useFocusTrap from '../../hooks/useFocusTrap';
import { adminLogout } from '../../services/adminAuth';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'grid' },
  { label: 'Applications', path: '/admin/applications', icon: 'users' },
  { label: 'User Queries', path: '/admin/queries', icon: 'chat' },
];

const navLinkClass = ({ isActive }) =>
  `flex min-h-11 items-center gap-3 rounded-field px-3.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-primary-tint text-primary-strong' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
  }`;

const SidebarContent = ({ username, onNavigate, onLogout, isLoggingOut }) => (
  <>
    <div className="mb-8 px-1">
      <Wordmark />
      <p className="mt-2 font-mono text-overline font-medium uppercase text-ink-2">Admin</p>
    </div>

    <nav aria-label="Admin" className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.path} to={item.path} className={navLinkClass} onClick={onNavigate}>
          <Icon name={item.icon} className="size-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>

    <div className="mt-4 border-t border-line pt-4">
      <p className="mb-3 truncate px-1 text-xs text-ink-2">
        Signed in as <span className="font-medium text-ink">{username}</span>
      </p>
      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="flex min-h-11 w-full items-center gap-3 rounded-field px-3.5 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-50"
      >
        <Icon name="arrow-left" className="size-5" />
        {isLoggingOut ? 'Signing out…' : 'Logout'}
      </button>
    </div>
  </>
);

const AdminLayout = ({ username, children }) => {
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const drawerRef = useRef(null);
  useFocusTrap(drawerRef, isMobileNavOpen, () => setIsMobileNavOpen(false));

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await adminLogout();
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-surface-2 text-ink md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface p-5 md:flex">
        <SidebarContent username={username} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-surface px-4 py-2 md:hidden">
        <Wordmark />
        <button
          type="button"
          aria-label="Open admin menu"
          aria-expanded={isMobileNavOpen}
          onClick={() => setIsMobileNavOpen(true)}
          className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-2"
        >
          <Icon name="menu" className="size-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            tabIndex={-1}
            onClick={() => setIsMobileNavOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Admin menu"
            className="absolute left-0 top-0 flex h-full w-[78%] max-w-xs flex-col border-r border-line bg-surface p-5 shadow-overlay"
          >
            <div className="mb-2 flex items-center justify-end">
              <button
                type="button"
                aria-label="Close admin menu"
                onClick={() => setIsMobileNavOpen(false)}
                className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-2"
              >
                <Icon name="close" className="size-6" />
              </button>
            </div>
            <SidebarContent
              username={username}
              onNavigate={() => setIsMobileNavOpen(false)}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        </div>
      )}

      <main id="main" className="min-w-0 flex-1 p-4 sm:p-6 md:p-10">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
