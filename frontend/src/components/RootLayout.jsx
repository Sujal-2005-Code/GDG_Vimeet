import { Outlet, useLocation } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import ChatWidget from './chat/ChatWidget';

// Mounted once at the router root so every route (and every same-page hash
// change) gets consistent scroll behavior without each page managing it.
// The chat widget mounts here too — one place to cover every public page,
// and one condition to keep it out of the admin area.
const RootLayout = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <Outlet />
      {!isAdminRoute && <ChatWidget />}
    </>
  );
};

export default RootLayout;
