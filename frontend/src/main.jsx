import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Team from './sections/Team.jsx'
import Contact from './sections/Contact.jsx'
import Events from './sections/Events.jsx'
import Recruitment from './sections/Recruitment.jsx'
import ApplicationsAdmin from './sections/ApplicationsAdmin.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/team', element: <Team /> },
  { path: '/contact', element: <Contact /> },
  { path: '/events', element: <Events /> },
  { path: '/join', element: <Recruitment /> },
  { path: '/recruitment', element: <Recruitment /> },
  { path: '/admin/applications', element: <ApplicationsAdmin /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
