import React, { useState } from 'react'
import { LinkIcon, CheckIcon } from '@heroicons/react/24/outline'

const EventTypeCard = ({ eventType }) => {
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    const bookingUrl = `${window.location.origin}/${eventType.slug}`
    navigator.clipboard.writeText(bookingUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const colors = [
    { bg: '#dbeafe', text: '#0284c7', border: '#7dd3fc' },
    { bg: '#ede9fe', text: '#7c3aed', border: '#ddd6fe' },
    { bg: '#fce7f3', text: '#db2777', border: '#fbcfe8' },
    { bg: '#fed7aa', text: '#d97706', border: '#fdba74' }
  ]
  
  const colorSet = colors[eventType.id % colors.length]

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      border: `1px solid var(--color-gray-200)`,
      padding: '24px',
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)'
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.borderColor = 'var(--color-gray-300)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.borderColor = 'var(--color-gray-200)'
    }}
    >
      {/* Header with Icon and Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          backgroundColor: colorSet.bg,
          border: `2px solid ${colorSet.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '24px'
        }}>
          📅
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--color-gray-900)',
            marginBottom: '4px',
            lineHeight: '1.4'
          }}>
            {eventType.title}
          </h3>
          <p style={{
            fontSize: '13px',
            color: 'var(--color-gray-500)',
            fontWeight: '500'
          }}>
            {eventType.duration_minutes} minutes
          </p>
        </div>
      </div>

      {/* Description */}
      {eventType.description && (
        <p style={{
          fontSize: '13px',
          color: 'var(--color-gray-600)',
          marginBottom: '16px',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {eventType.description}
        </p>
      )}

      {/* Slug Badge */}
      <div style={{
        backgroundColor: 'var(--color-gray-100)',
        padding: '8px 12px',
        borderRadius: '6px',
        marginBottom: '16px',
        fontSize: '12px',
        color: 'var(--color-gray-600)',
        fontFamily: 'monospace',
        wordBreak: 'break-all'
      }}>
        /{eventType.slug}
      </div>

      {/* Copy Link Button */}
      <button
        onClick={copyLink}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: copied ? 'var(--color-success)' : 'var(--color-primary)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
          marginTop: 'auto'
        }}
        onMouseEnter={(e) => {
          if (!copied) {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
          }
        }}
        onMouseLeave={(e) => {
          if (!copied) {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)'
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)'
          }
        }}
      >
        {copied ? (
          <>
            <CheckIcon width={16} height={16} />
            Copied!
          </>
        ) : (
          <>
            <LinkIcon width={16} height={16} />
            Copy Link
          </>
        )}
      </button>
    </div>
  )
}

export default EventTypeCard
