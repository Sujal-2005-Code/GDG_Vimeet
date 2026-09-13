import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { adminLogout } from '../../services/adminAuth';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    label: 'Applications',
    path: '/admin/applications',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
    isActive ? 'bg-white text-black' : 'text-white/70 hover:bg-white/10 hover:text-white'
  }`;

const SidebarContent = ({ username, onNavigate, onLogout, isLoggingOut }) => (
  <>
    <div className="flex items-center gap-2.5 px-1 mb-8">
      <img src="/images/nav-logo.svg" alt="" className="h-6 w-auto" />
      <span className="text-sm font-semibold text-white tracking-wide">GDG ViMEET Admin</span>
    </div>

    <nav className="flex flex-col gap-1.5 flex-1">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.path} to={item.path} className={navLinkClass} onClick={onNavigate}>
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>

    <div className="pt-4 mt-4 border-t border-white/10">
      <p className="px-1 text-xs text-white/40 mb-3 truncate">
        Signed in as <span className="text-white/70">{username}</span>
      </p>
      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        {isLoggingOut ? 'Signing out…' : 'Logout'}
      </button>
    </div>
  </>
);

const AdminLayout = ({ username, children }) => {
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await adminLogout();
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-[#0b0b0d] text-white md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-white/10 bg-black/30 p-5">
        <SidebarContent username={username} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/70 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/images/nav-logo.svg" alt="" className="h-5 w-auto" />
          <span className="text-sm font-semibold text-white">GDG Admin</span>
        </div>
        <button
          type="button"
          aria-label="Open admin menu"
          aria-expanded={isMobileNavOpen}
          onClick={() => setIsMobileNavOpen(true)}
          className="inline-flex items-center justify-center size-9 rounded-lg text-white hover:bg-white/10 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${isMobileNavOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!isMobileNavOpen}
      >
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() => setIsMobileNavOpen(false)}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileNavOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute top-0 left-0 h-full w-[78%] max-w-xs bg-neutral-950 border-r border-white/10 shadow-2xl p-5 flex flex-col transition-transform duration-300 ease-out ${
            isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-end mb-2">
            <button
              type="button"
              aria-label="Close admin menu"
              onClick={() => setIsMobileNavOpen(false)}
              className="inline-flex items-center justify-center size-8 rounded-full text-white hover:bg-white/10 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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

      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10">{children}</main>
    </div>
  );
};

export default AdminLayout;
