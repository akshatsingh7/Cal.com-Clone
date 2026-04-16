import React, { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isBefore, startOfDay, parse } from 'date-fns'

// Calendar picker component for selecting dates
const CalendarPicker = ({ onDateSelect, disabledDays = [] }) => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth()))

  // Get all days to display in calendar
  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })

    // Add previous month's days to fill first week
    const firstDayOfWeek = start.getDay()
    const prevMonthEnd = new Date(start)
    prevMonthEnd.setDate(0)
    const prevMonthDays = []
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.unshift(new Date(prevMonthEnd))
      prevMonthEnd.setDate(prevMonthEnd.getDate() - 1)
    }

    // Add next month's days to fill last week
    const lastDay = end.getDay()
    const nextMonthDays = []
    for (let i = 1; i < 7 - lastDay; i++) {
      nextMonthDays.push(new Date(end.getTime() + i * 24 * 60 * 60 * 1000))
    }

    return [...prevMonthDays, ...days, ...nextMonthDays]
  }

  const daysInMonth = getDaysInMonth()
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Check if a day is disabled
  const isDayDisabled = (day) => {
    if (isBefore(startOfDay(day), startOfDay(today))) return true
    return disabledDays.includes(day.getDay())
  }

  // Handle date click
  const handleDayClick = (day) => {
    if (!isDayDisabled(day)) {
      const dateString = format(day, 'yyyy-MM-dd')
      onDateSelect(dateString)
    }
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      border: '1px solid #E5E7EB',
      maxWidth: '350px'
    }}>
      {/* Month/Year Header with Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={goToPreviousMonth}
          style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
        >
          <ChevronLeftIcon width={20} height={20} />
        </button>
        <h3 style={{ fontWeight: '600', fontSize: '16px' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={goToNextMonth}
          style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
        >
          <ChevronRightIcon width={20} height={20} />
        </button>
      </div>

      {/* Day Labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginBottom: '10px' }}>
        {dayLabels.map(label => (
          <div key={label} style={{ textAlign: 'center', fontWeight: '600', fontSize: '12px', color: '#6B7280', padding: '8px 0' }}>
            {label}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
        {daysInMonth.map((day, index) => {
          const isDisabled = isDayDisabled(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)

          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              disabled={isDisabled}
              style={{
                padding: '8px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px',
                backgroundColor: isDisabled ? '#F9FAFB' : isCurrentMonth ? 'white' : '#F9FAFB',
                color: isDisabled ? '#D1D5DB' : isCurrentMonth ? '#1F2937' : '#9CA3AF',
                fontWeight: isCurrentMonth ? '500' : '400',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isCurrentMonth ? 1 : 0.5,
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.backgroundColor = '#F3F4F6'
                  e.currentTarget.style.borderColor = '#2563EB'
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#E5E7EB'
                }
              }}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarPicker
