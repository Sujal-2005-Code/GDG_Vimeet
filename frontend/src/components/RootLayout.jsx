import { Outlet, useLocation } from 'react-router-dom';
import ChatWidget from './chat/ChatWidget';
import Footer from './Footer';
import NavBar from './layout/NavBar';
import SkipLink from './layout/SkipLink';
import ScrollToTop from './ScrollToTop';

/**
 * Mounted once at the router root: skip link, navigation, footer, chat and
 * scroll behaviour are shared by every public page, so pages only render
 * their own <main>. The admin area has its own shell (no site nav, footer
 * or chat).
 */
const RootLayout = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <>
        <SkipLink />
        <ScrollToTop />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <SkipLink />
      <ScrollToTop />
      <NavBar />
      <Outlet />
      <Footer />
      <ChatWidget />
    </>
  );
};

export default RootLayout;
