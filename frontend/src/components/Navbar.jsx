import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CalendarIcon, CogIcon, CheckCircleIcon, HomeIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  const location = useLocation()
  const navItems = [
    { label: 'Dashboard', path: '/', icon: HomeIcon },
    { label: 'Event Types', path: '/event-types', icon: CalendarIcon },
    { label: 'Availability', path: '/availability', icon: CogIcon },
    { label: 'Bookings', path: '/bookings', icon: CheckCircleIcon }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      width: '240px',
      backgroundColor: 'var(--color-gray-900)',
      color: 'white',
      padding: '24px 16px',
      borderRight: '1px solid var(--color-gray-800)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{
        marginBottom: '32px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--color-gray-800)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          BookMe
        </h1>
        <p style={{
          fontSize: '12px',
          color: 'var(--color-gray-400)',
          marginTop: '4px'
        }}>
          Scheduling Platform
        </p>
      </div>

      {/* Navigation Items */}
      <ul style={{ listStyle: 'none', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <li key={item.path} style={{ marginBottom: '8px' }}>
              <Link
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  backgroundColor: active ? 'var(--color-primary)' : 'transparent',
                  color: active ? 'white' : 'var(--color-gray-400)',
                  fontWeight: active ? '600' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'var(--color-gray-800)'
                    e.currentTarget.style.color = 'white'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--color-gray-400)'
                  }
                }}
              >
                <Icon width={20} height={20} strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Footer */}
      <div style={{
        paddingTop: '16px',
        borderTop: '1px solid var(--color-gray-800)',
        fontSize: '12px',
        color: 'var(--color-gray-500)',
        textAlign: 'center'
      }}>
        <p>v1.0</p>
      </div>
    </nav>
  )
}

export default Navbar
