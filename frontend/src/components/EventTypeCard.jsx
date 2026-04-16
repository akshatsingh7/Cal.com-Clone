import React, { useState } from 'react'

// Card component that displays an event type with copy-link button
const EventTypeCard = ({ eventType }) => {
  const [copied, setCopied] = useState(false)

  // Copy public booking link to clipboard
  const copyLink = () => {
    const bookingUrl = `${window.location.origin}/${eventType.slug}`
    navigator.clipboard.writeText(bookingUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const colors = ['#2563EB', '#7C3AED', '#DB2777', '#EA580C']
  const bgColor = colors[eventType.id % colors.length]

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #E5E7EB'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: bgColor,
          opacity: 0.2
        }}></div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{eventType.title}</h3>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>{eventType.duration_minutes} min</p>
        </div>
      </div>

      {eventType.description && (
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          marginBottom: '15px',
          lineHeight: '1.5'
        }}>
          {eventType.description}
        </p>
      )}

      <button
        onClick={copyLink}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: copied ? '#10B981' : '#2563EB',
          color: 'white',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => !copied && (e.currentTarget.style.backgroundColor = '#1D4ED8')}
        onMouseLeave={(e) => !copied && (e.currentTarget.style.backgroundColor = '#2563EB')}
      >
        {copied ? '✓ Copied!' : '🔗 Copy Link'}
      </button>
    </div>
  )
}

export default EventTypeCard
