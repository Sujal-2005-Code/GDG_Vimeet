import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import RootLayout from './components/RootLayout.jsx'
import AdminFallback from './components/AdminFallback.jsx'
import PageFallback from './components/PageFallback.jsx'

// Every route is its own lazy chunk, so a visitor only downloads the code for
// the page they open (Recruitment, for example, pulls in confetti; the home
// page brings the scroll-story engine). When a visit starts on `/`, the home
// chunk is requested right away instead of waiting for the router to ask.
const loadHome = () => import('./App.jsx')
const App = lazy(loadHome)
if (window.location.pathname === '/') loadHome()
const Team = lazy(() => import('./sections/Team.jsx'))
const Contact = lazy(() => import('./sections/Contact.jsx'))
const Events = lazy(() => import('./sections/Events.jsx'))
const EventDetail = lazy(() => import('./sections/EventDetail.jsx'))
const NotFound = lazy(() => import('./sections/NotFound.jsx'))
const Recruitment = lazy(() => import('./sections/Recruitment.jsx'))
const ApplicationsAdmin = lazy(() => import('./sections/ApplicationsAdmin.jsx'))
const AdminLogin = lazy(() => import('./sections/admin/AdminLogin.jsx'))
const AdminGate = lazy(() => import('./sections/admin/AdminGate.jsx'))
const AdminDashboard = lazy(() => import('./sections/admin/AdminDashboard.jsx'))
const QueriesAdmin = lazy(() => import('./sections/admin/QueriesAdmin.jsx'))

// Reduced motion is handled per animation, not globally: see
// animations/motion.js (tiers) and the story engine. The old global
// gsap.globalTimeline.timeScale(50) hack is gone.

const page = (lazyComponent) => {
  const Page = lazyComponent
  return (
    <Suspense fallback={<PageFallback />}>
      <Page />
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: page(App) },
      { path: '/team', element: page(Team) },
      { path: '/contact', element: page(Contact) },
      { path: '/events', element: page(Events) },
      { path: '/events/:slug', element: page(EventDetail) },
      { path: '/join', element: page(Recruitment) },
      { path: '/recruitment', element: page(Recruitment) },
      {
        path: '/admin',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminLogin />
          </Suspense>
        ),
      },
      {
        path: '/admin/dashboard',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminGate>
              <AdminDashboard />
            </AdminGate>
          </Suspense>
        ),
      },
      {
        path: '/admin/applications',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminGate>
              <ApplicationsAdmin />
            </AdminGate>
          </Suspense>
        ),
      },
      {
        path: '/admin/queries',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminGate>
              <QueriesAdmin />
            </AdminGate>
          </Suspense>
        ),
      },
      { path: '*', element: page(NotFound) },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
