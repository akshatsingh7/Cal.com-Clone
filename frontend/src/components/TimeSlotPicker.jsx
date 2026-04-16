import React, { useState } from 'react'

const TimeSlotPicker = ({ slots, onSlotSelect }) => {
  const [selectedSlot, setSelectedSlot] = useState(null)

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot)
    onSlotSelect(slot)
  }

  if (!slots || slots.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--color-gray-50)',
        borderRadius: '10px',
        padding: '24px',
        border: '1px solid var(--color-gray-200)',
        textAlign: 'center'
      }}>
        <p style={{ color: 'var(--color-gray-500)', margin: 0, fontSize: '14px' }}>
          No available times for this date
        </p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      border: '1px solid var(--color-gray-200)'
    }}>
      <h3 style={{
        marginBottom: '16px',
        fontWeight: '600',
        fontSize: '14px',
        color: 'var(--color-gray-900)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        Available Times
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
        gap: '12px'
      }}>
        {slots.map((slot, index) => (
          <button
            key={index}
            onClick={() => handleSelectSlot(slot)}
            style={{
              padding: '12px 10px',
              border: selectedSlot === slot ? `2px solid var(--color-primary)` : '1px solid var(--color-gray-300)',
              borderRadius: '8px',
              backgroundColor: selectedSlot === slot ? 'var(--color-primary-light)' : 'white',
              color: selectedSlot === slot ? 'var(--color-primary-dark)' : 'var(--color-gray-700)',
              fontWeight: selectedSlot === slot ? '600' : '500',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: selectedSlot === slot ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedSlot !== slot) {
                e.currentTarget.style.borderColor = 'var(--color-primary)'
                e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'
                e.currentTarget.style.color = 'var(--color-primary-dark)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedSlot !== slot) {
                e.currentTarget.style.borderColor = 'var(--color-gray-300)'
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.color = 'var(--color-gray-700)'
              }
            }}
          >
            {slot.start}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimeSlotPicker
