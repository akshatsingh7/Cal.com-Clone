import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarIcon, CogIcon, CheckCircleIcon, HomeIcon } from '@heroicons/react/24/outline'

// Left sidebar navigation component (Cal.com style)
const Navbar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: HomeIcon },
    { label: 'Event Types', path: '/event-types', icon: CalendarIcon },
    { label: 'Availability', path: '/availability', icon: CogIcon },
    { label: 'Bookings', path: '/bookings', icon: CheckCircleIcon }
  ]

  return (
    <nav style={{
      width: '250px',
      backgroundColor: '#111827',
      color: 'white',
      padding: '20px',
      borderRight: '1px solid #1F2937'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }}>BookMe</h1>
      <ul style={{ listStyle: 'none' }}>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.path} style={{ marginBottom: '15px' }}>
              <Link
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1F2937'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Icon width={20} height={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navbar
