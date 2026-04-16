import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { format } from 'date-fns'

// Booking confirmation page shown after successful booking
const ConfirmationPage = () => {
  const location = useLocation()
  const { booking, eventType } = location.state || {}

  if (!booking || !eventType) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6B7280', marginBottom: '20px' }}>Booking data not found</p>
          <Link
            to="/"
            style={{
              color: '#2563EB',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F3F4F6',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <CheckCircleIcon
          width={60}
          height={60}
          style={{
            color: '#10B981',
            margin: '0 auto 20px'
          }}
        />

        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '10px',
          color: '#1F2937'
        }}>
          Booking Confirmed!
        </h1>

        <p style={{
          color: '#6B7280',
          marginBottom: '30px',
          fontSize: '16px'
        }}>
          Your meeting has been successfully scheduled.
        </p>

        {/* Booking Details */}
        <div style={{
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <p style={{ color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '5px' }}>
              Event
            </p>
            <p style={{ fontSize: '16px', fontWeight: '500' }}>
              {booking.event_type_title}
            </p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <p style={{ color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '5px' }}>
              Date & Time
            </p>
            <p style={{ fontSize: '16px', fontWeight: '500' }}>
              {format(new Date(booking.start_time), 'MMMM d, yyyy')}
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              {format(new Date(booking.start_time), 'h:mm a')} - {format(new Date(booking.end_time), 'h:mm a')}
            </p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <p style={{ color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '5px' }}>
              Booker
            </p>
            <p style={{ fontSize: '16px', fontWeight: '500' }}>
              {booking.booker_name}
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              {booking.booker_email}
            </p>
          </div>

          <div>
            <p style={{ color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '5px' }}>
              Booking ID
            </p>
            <p style={{
              fontSize: '14px',
              fontFamily: 'monospace',
              color: '#6B7280',
              backgroundColor: 'white',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #E5E7EB'
            }}>
              #{booking.id}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <a
            href={`mailto:${booking.booker_email}?subject=Booking Confirmation for ${booking.event_type_title}`}
            style={{
              display: 'block',
              padding: '12px',
              backgroundColor: '#2563EB',
              color: 'white',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
          >
            Send Confirmation Email
          </a>

          <a
            href={`http://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(booking.event_type_title)}&dates=${format(new Date(booking.start_time), 'yyyyMMdd\'T\'HHmmss')}/` +
              `${format(new Date(booking.end_time), 'yyyyMMdd\'T\'HHmmss')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '12px',
              backgroundColor: '#F3F4F6',
              color: '#1F2937',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none',
              textAlign: 'center',
              border: '1px solid #D1D5DB'
            }}
          >
            Add to Google Calendar
          </a>
        </div>

        <p style={{
          color: '#6B7280',
          fontSize: '12px',
          marginTop: '20px'
        }}>
          A confirmation has been sent to your email.
        </p>
      </div>
    </div>
  )
}

export default ConfirmationPage
