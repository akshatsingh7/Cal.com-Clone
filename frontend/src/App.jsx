import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import EventTypes from './pages/EventTypes'
import Availability from './pages/Availability'
import Bookings from './pages/Bookings'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'

// Layout wrapper for app pages (with sidebar)
const AppLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Navbar />
    <div style={{ flex: 1, overflow: 'auto' }}>
      {children}
    </div>
  </div>
)

function App() {
  const location = useLocation()
  
  // Check if we're on a public page (should not show navbar)
  const isPublicPage = location.pathname.includes('/') && !location.pathname.includes('/bookings') && 
                       !location.pathname.includes('/event-types') && 
                       !location.pathname.includes('/availability') && 
                       location.pathname !== '/'

  return (
    <Routes>
      <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/event-types" element={<AppLayout><EventTypes /></AppLayout>} />
      <Route path="/availability" element={<AppLayout><Availability /></AppLayout>} />
      <Route path="/bookings" element={<AppLayout><Bookings /></AppLayout>} />
      <Route path="/:slug" element={<BookingPage />} />
      <Route path="/:slug/confirmed" element={<ConfirmationPage />} />
    </Routes>
  )
}

export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  )
}
