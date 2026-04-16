import React, { useEffect, useState } from 'react'
import axios from 'axios'
import EventTypeCard from '../components/EventTypeCard'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [eventTypes, setEventTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/event-types`)
        setEventTypes(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to load event types')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEventTypes()
  }, [])

  if (loading) {
    return (
      <div style={{
        padding: '64px 40px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '3px solid var(--color-gray-200)',
          borderTop: '3px solid var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{
      padding: '40px 48px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'var(--color-gray-900)',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            Dashboard
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--color-gray-500)',
            fontWeight: '400'
          }}>
            Manage your scheduling and availability
          </p>
        </div>
        <Link
          to="/event-types"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)'
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <PlusIcon width={18} height={18} />
          New Event Type
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Empty State */}
      {eventTypes.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '64px 32px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid var(--color-gray-200)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'var(--color-primary-light)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '32px'
          }}>
            📅
          </div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--color-gray-900)',
            marginBottom: '8px'
          }}>
            No event types yet
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--color-gray-500)',
            marginBottom: '24px'
          }}>
            Create your first event type to start accepting bookings
          </p>
          <Link
            to="/event-types"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)'
            }}
          >
            <PlusIcon width={18} height={18} />
            Create Event Type
          </Link>
        </div>
      ) : (
        <div>
          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--color-gray-200)'
            }}>
              <p style={{
                fontSize: '12px',
                color: 'var(--color-gray-500)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                Event Types
              </p>
              <p style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'var(--color-primary)'
              }}>
                {eventTypes.length}
              </p>
            </div>
          </div>

          {/* Event Types Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {eventTypes.map((eventType) => (
              <EventTypeCard key={eventType.id} eventType={eventType} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
