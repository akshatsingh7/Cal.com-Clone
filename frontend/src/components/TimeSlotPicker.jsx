import React, { useState } from 'react'

// Time slot picker component for selecting available times
const TimeSlotPicker = ({ slots, onSlotSelect }) => {
  const [selectedSlot, setSelectedSlot] = useState(null)

  // Handle slot selection
  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot)
    onSlotSelect(slot)
  }

  if (!slots || slots.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #E5E7EB'
      }}>
        <p style={{ color: '#6B7280', textAlign: 'center' }}>No available times for this date</p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      border: '1px solid #E5E7EB'
    }}>
      <h3 style={{ marginBottom: '15px', fontWeight: '600', fontSize: '16px' }}>Available Times</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '10px'
      }}>
        {slots.map((slot, index) => (
          <button
            key={index}
            onClick={() => handleSelectSlot(slot)}
            style={{
              padding: '10px',
              border: selectedSlot === slot ? '2px solid #2563EB' : '1px solid #D1D5DB',
              borderRadius: '6px',
              backgroundColor: selectedSlot === slot ? '#DBEAFE' : 'white',
              color: selectedSlot === slot ? '#2563EB' : '#1F2937',
              fontWeight: selectedSlot === slot ? '600' : '500',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (selectedSlot !== slot) {
                e.currentTarget.style.borderColor = '#2563EB'
                e.currentTarget.style.backgroundColor = '#F0F9FF'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedSlot !== slot) {
                e.currentTarget.style.borderColor = '#D1D5DB'
                e.currentTarget.style.backgroundColor = 'white'
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
