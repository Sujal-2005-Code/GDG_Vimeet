import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import gsap from 'gsap'
import './index.css'
import App from './App.jsx'
import Team from './sections/Team.jsx'
import Contact from './sections/Contact.jsx'
import Events from './sections/Events.jsx'
import Recruitment from './sections/Recruitment.jsx'
import ApplicationsAdmin from './sections/ApplicationsAdmin.jsx'
import AdminLogin from './sections/admin/AdminLogin.jsx'
import AdminGate from './sections/admin/AdminGate.jsx'
import AdminDashboard from './sections/admin/AdminDashboard.jsx'
import RootLayout from './components/RootLayout.jsx'

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
      { path: '/admin', element: <AdminLogin /> },
      {
        path: '/admin/dashboard',
        element: (
          <AdminGate>
            <AdminDashboard />
          </AdminGate>
        ),
      },
      {
        path: '/admin/applications',
        element: (
          <AdminGate>
            <ApplicationsAdmin />
          </AdminGate>
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
