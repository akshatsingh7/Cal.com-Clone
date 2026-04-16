import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import CalendarPicker from '../components/CalendarPicker'
import TimeSlotPicker from '../components/TimeSlotPicker'
import { format } from 'date-fns'

// Public booking page - no navigation sidebar
const BookingPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [eventType, setEventType] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [formData, setFormData] = useState({ booker_name: '', booker_email: '' })
  const [loading, setLoading] = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Fetch event type details
  useEffect(() => {
    const fetchEventType = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/public/${slug}`)
        setEventType(response.data)
        setError(null)
      } catch (err) {
        setError('Event type not found')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEventType()
  }, [slug])

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setSlots([])
      return
    }

    const fetchSlots = async () => {
      setSlotsLoading(true)
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/public/${slug}/slots?date=${selectedDate}`
        )
        setSlots(response.data.slots)
        setSelectedSlot(null)
        setError(null)
      } catch (err) {
        setError('Failed to load available times')
        console.error(err)
        setSlots([])
      } finally {
        setSlotsLoading(false)
      }
    }

    fetchSlots()
  }, [selectedDate, slug])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.booker_name || !formData.booker_email || !selectedSlot) {
      setError('Please fill in all fields and select a time')
      return
    }

    setSubmitting(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/public/${slug}/book`,
        {
          booker_name: formData.booker_name,
          booker_email: formData.booker_email,
          date: selectedDate,
          time: selectedSlot.start
        }
      )

      // Navigate to confirmation page with booking data
      navigate(`/${slug}/confirmed`, {
        state: {
          booking: response.data,
          eventType: eventType
        }
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6'
      }}>
        <div style={{ textAlign: 'center' }}>Loading...</div>
      </div>
    )
  }

  if (error && !eventType) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6'
      }}>
        <div style={{
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '400px'
        }}>
          {error}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', padding: '40px 20px' }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left side: Event info */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          border: '1px solid #E5E7EB',
          height: 'fit-content'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
            {eventType?.title}
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '20px', fontSize: '16px' }}>
            {eventType?.duration_minutes} minute meeting
          </p>

          {eventType?.description && (
            <div style={{
              padding: '15px',
              backgroundColor: '#F9FAFB',
              borderLeft: '4px solid #2563EB',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#1F2937' }}>
                {eventType.description}
              </p>
            </div>
          )}

          <div style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.8' }}>
            <p>🕐 Time zone: Your local time</p>
            <p>📅 Duration: {eventType?.duration_minutes} minutes</p>
          </div>
        </div>

        {/* Right side: Booking form */}
        <div>
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

          {/* Calendar */}
          {!selectedDate ? (
            <div>
              <h2 style={{ marginBottom: '15px', fontWeight: '600' }}>Select a date</h2>
              <CalendarPicker
                onDateSelect={setSelectedDate}
                disabledDays={[0, 6]} // Disable Sunday and Saturday for demo
              />
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedDate(null)}
                style={{
                  marginBottom: '15px',
                  backgroundColor: 'transparent',
                  color: '#2563EB',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Back to calendar
              </button>

              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
                <p style={{ fontSize: '14px', color: '#6B7280' }}>
                  {format(new Date(selectedDate), 'EEEE, MMMM d')}
                </p>
              </div>

              {/* Time slots */}
              {slotsLoading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>Loading times...</div>
              ) : (
                <>
                  <TimeSlotPicker slots={slots} onSlotSelect={setSelectedSlot} />

                  {selectedSlot && !submitting && (
                    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Your Name *
                          </label>
                          <input
                            type="text"
                            name="booker_name"
                            value={formData.booker_name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                            required
                          />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Email *
                          </label>
                          <input
                            type="email"
                            name="booker_email"
                            value={formData.booker_email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                            required
                          />
                        </div>

                        <div style={{
                          padding: '12px',
                          backgroundColor: '#F9FAFB',
                          borderRadius: '6px',
                          marginBottom: '15px',
                          fontSize: '14px'
                        }}>
                          <strong>Booking Time:</strong> {selectedSlot.start} - {selectedSlot.end}
                        </div>

                        <button
                          type="submit"
                          style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#10B981',
                            color: 'white',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '16px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
                        >
                          Confirm Booking
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingPage
