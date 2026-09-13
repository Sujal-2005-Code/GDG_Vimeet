import { Outlet } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

// Mounted once at the router root so every route (and every same-page hash
// change) gets consistent scroll behavior without each page managing it.
const RootLayout = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

export default RootLayout;
