import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import gsap from 'gsap'
import './index.css'
import App from './App.jsx'
import Team from './sections/Team.jsx'
import Contact from './sections/Contact.jsx'
import Events from './sections/Events.jsx'
import Recruitment from './sections/Recruitment.jsx'
import RootLayout from './components/RootLayout.jsx'
import AdminFallback from './components/AdminFallback.jsx'

// Only the public site ships in the main bundle. The admin panel is a
// separate chunk that loads on first visit to /admin* — the vast majority
// of visitors (applicants, not organizers) never pay for its weight.
const ApplicationsAdmin = lazy(() => import('./sections/ApplicationsAdmin.jsx'))
const AdminLogin = lazy(() => import('./sections/admin/AdminLogin.jsx'))
const AdminGate = lazy(() => import('./sections/admin/AdminGate.jsx'))
const AdminDashboard = lazy(() => import('./sections/admin/AdminDashboard.jsx'))

// Respect the OS-level reduced-motion preference for GSAP-driven animations
// (CSS transitions/animations are handled separately in index.css).
if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(50)
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/team', element: <Team /> },
      { path: '/contact', element: <Contact /> },
      { path: '/events', element: <Events /> },
      { path: '/join', element: <Recruitment /> },
      { path: '/recruitment', element: <Recruitment /> },
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
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
