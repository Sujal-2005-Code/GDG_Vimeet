import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SkipLink from './layout/SkipLink';
import ScrollToTop from './ScrollToTop';
import ChatWidget from './chat/ChatWidget';

// Mounted once at the router root so every route (and every same-page hash
// change) gets consistent scroll behavior without each page managing it.
// The chat widget mounts here too — one place to cover every public page,
// and one condition to keep it out of the admin area.
//
// THEME: the redesigned pages are light; routes that have not been
// redesigned yet render inside `.legacy-dark` (styles/legacy.css) so they
// look exactly as before. Add a route to LIGHT_ROUTES as it is redesigned
// (and mirror it in the inline script in index.html). Admin stays dark by
// decision until Stage 5.
const LIGHT_ROUTES = ['/'];

const RootLayout = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const isLight = LIGHT_ROUTES.includes(pathname);

  // Keeps the page/overscroll background in step with the route.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = isLight ? 'light' : 'legacy';
  }, [isLight]);

  const wrapperClass = isLight
    ? ''
    : `legacy-dark legacy-route${isAdminRoute ? '' : ' legacy-route-nav'}`;

  return (
    <>
      <SkipLink />
      <div className={wrapperClass}>
        <ScrollToTop />
        <Outlet />
      </div>
      {!isAdminRoute && <ChatWidget />}
    </>
  );
};

export default RootLayout;
