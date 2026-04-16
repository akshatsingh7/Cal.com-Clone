import React, { useEffect, useState } from 'react'
import axios from 'axios'

// Page for managing weekly availability
const Availability = () => {
  const [availability, setAvailability] = useState([])
  const [timezone, setTimezone] = useState('Asia/Kolkata')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const timezones = ['UTC', 'Asia/Kolkata', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Australia/Sydney']

  // Generate time options (15-min intervals)
  const generateTimeOptions = () => {
    const times = []
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      }
    }
    return times
  }

  const timeOptions = generateTimeOptions()

  // Fetch availability on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/availability`)
        if (response.data.length > 0) {
          setAvailability(response.data)
          setTimezone(response.data[0].timezone)
        } else {
          // Initialize with default 9-5 schedule
          initializeDefault()
        }
        setError(null)
      } catch (err) {
        setError('Failed to load availability')
        console.error(err)
        initializeDefault()
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [])

  // Initialize default availability (Mon-Fri 9-5)
  const initializeDefault = () => {
    const defaultAvail = []
    for (let i = 0; i < 7; i++) {
      defaultAvail.push({
        day_of_week: i,
        is_active: i >= 1 && i <= 5, // Mon-Fri
        start_time: '09:00:00',
        end_time: '17:00:00',
        timezone: 'Asia/Kolkata'
      })
    }
    setAvailability(defaultAvail)
  }

  // Handle toggle active/inactive
  const handleToggle = (index) => {
    const updated = [...availability]
    updated[index].is_active = !updated[index].is_active
    setAvailability(updated)
  }

  // Handle time change
  const handleTimeChange = (index, field, value) => {
    const updated = [...availability]
    updated[index][field] = `${value}:00`
    setAvailability(updated)
  }

  // Handle timezone change
  const handleTimezoneChange = (value) => {
    setTimezone(value)
  }

  // Submit changes
  const handleSave = async () => {
    try {
      // Prepare data for API (remove timezone from individual items)
      const dataToSend = {
        timezone,
        availability: availability.map(a => ({
          day_of_week: a.day_of_week,
          is_active: a.is_active,
          start_time: a.start_time,
          end_time: a.end_time
        }))
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/availability`,
        dataToSend
      )

      setError(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Failed to save availability')
      console.error(err)
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ marginBottom: '10px', fontSize: '32px', fontWeight: 'bold' }}>Availability</h1>
      <p style={{ color: '#6B7280', marginBottom: '30px' }}>Set your weekly schedule below.</p>

      {error && (
        <div style={{
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#D1FAE5',
          color: '#065F46',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          ✓ Availability updated successfully!
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>Timezone</label>
        <select
          value={timezone}
          onChange={(e) => handleTimezoneChange(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          {timezones.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Day</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Available</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Start Time</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>End Time</th>
            </tr>
          </thead>
          <tbody>
            {availability.map((day, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={{ padding: '15px', fontWeight: '500' }}>{daysOfWeek[day.day_of_week]}</td>
                <td style={{ padding: '15px' }}>
                  <input
                    type="checkbox"
                    checked={day.is_active}
                    onChange={() => handleToggle(index)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td style={{ padding: '15px' }}>
                  <select
                    value={day.start_time.slice(0, 5)}
                    onChange={(e) => handleTimeChange(index, 'start_time', e.target.value)}
                    disabled={!day.is_active}
                    style={{
                      padding: '8px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      fontSize: '14px',
                      opacity: day.is_active ? 1 : 0.5,
                      cursor: day.is_active ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '15px' }}>
                  <select
                    value={day.end_time.slice(0, 5)}
                    onChange={(e) => handleTimeChange(index, 'end_time', e.target.value)}
                    disabled={!day.is_active}
                    style={{
                      padding: '8px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      fontSize: '14px',
                      opacity: day.is_active ? 1 : 0.5,
                      cursor: day.is_active ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        style={{
          marginTop: '20px',
          padding: '12px 30px',
          backgroundColor: '#10B981',
          color: 'white',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '16px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
      >
        Save Availability
      </button>
    </div>
  )
}

export default Availability
