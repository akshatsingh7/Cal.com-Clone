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
        backgroundColor: 'var(--color-gray-50)'
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

  if (error && !eventType) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-gray-50)'
      }}>
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '16px 20px',
          borderRadius: '8px',
          maxWidth: '400px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-gray-50)', padding: '40px 20px' }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        alignItems: 'start'
      }}>
        {/* Left side: Event info */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid var(--color-gray-200)',
          height: 'fit-content',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '12px',
            color: 'var(--color-gray-900)',
            letterSpacing: '-0.5px'
          }}>
            {eventType?.title}
          </h1>
          <p style={{
            color: 'var(--color-gray-500)',
            marginBottom: '24px',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            {eventType?.duration_minutes} minute meeting
          </p>

          {eventType?.description && (
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--color-primary-light)',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <p style={{
                fontSize: '13px',
                lineHeight: '1.6',
                color: '#1e40af',
                margin: 0
              }}>
                {eventType.description}
              </p>
            </div>
          )}

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            color: 'var(--color-gray-600)',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>🕐</span>
              <p style={{ margin: 0 }}>Time zone: Your local time</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>📅</span>
              <p style={{ margin: 0 }}>Duration: {eventType?.duration_minutes} minutes</p>
            </div>
          </div>
        </div>

        {/* Right side: Booking form */}
        <div>
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '14px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          {/* Calendar */}
          {!selectedDate ? (
            <div>
              <h2 style={{
                marginBottom: '20px',
                fontWeight: '600',
                fontSize: '16px',
                color: 'var(--color-gray-900)'
              }}>Select a date</h2>
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
                  marginBottom: '20px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-primary)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '13px',
                  padding: '0',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-dark)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              >
                ← Back to calendar
              </button>

              <div style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '10px',
                marginBottom: '24px',
                border: '1px solid var(--color-gray-200)'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--color-gray-900)',
                  fontWeight: '500',
                  margin: 0
                }}>
                  {format(new Date(selectedDate), 'EEEE, MMMM d')}
                </p>
              </div>

              {/* Time slots */}
              {slotsLoading ? (
                <div style={{
                  padding: '32px',
                  textAlign: 'center',
                  color: 'var(--color-gray-500)',
                  fontSize: '14px'
                }}>
                  <div style={{
                    display: 'inline-block',
                    width: '32px',
                    height: '32px',
                    border: '2px solid var(--color-gray-200)',
                    borderTop: '2px solid var(--color-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <p style={{ marginTop: '12px' }}>Loading times...</p>
                </div>
              ) : slots.length === 0 ? (
                <div style={{
                  padding: '32px',
                  textAlign: 'center',
                  backgroundColor: 'var(--color-gray-50)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: 'var(--color-gray-500)'
                }}>
                  No available slots
                </div>
              ) : (
                <>
                  <TimeSlotPicker slots={slots} onSlotSelect={setSelectedSlot} />

                  {selectedSlot && !submitting && (
                    <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
                      <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '10px',
                        border: '1px solid var(--color-gray-200)'
                      }}>
                        <div style={{ marginBottom: '18px' }}>
                          <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            fontSize: '13px',
                            color: 'var(--color-gray-900)'
                          }}>
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
                              padding: '10px 12px',
                              border: '1px solid var(--color-gray-300)',
                              borderRadius: '6px',
                              fontSize: '14px',
                              transition: 'all 0.2s ease',
                              fontFamily: 'inherit'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = 'var(--color-primary)'
                              e.target.style.boxShadow = '0 0 0 3px var(--color-primary-light)'
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = 'var(--color-gray-300)'
                              e.target.style.boxShadow = 'none'
                            }}
                            required
                          />
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                          <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            fontSize: '13px',
                            color: 'var(--color-gray-900)'
                          }}>
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
                              padding: '10px 12px',
                              border: '1px solid var(--color-gray-300)',
                              borderRadius: '6px',
                              fontSize: '14px',
                              transition: 'all 0.2s ease',
                              fontFamily: 'inherit'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = 'var(--color-primary)'
                              e.target.style.boxShadow = '0 0 0 3px var(--color-primary-light)'
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = 'var(--color-gray-300)'
                              e.target.style.boxShadow = 'none'
                            }}
                            required
                          />
                        </div>

                        <div style={{
                          padding: '12px 14px',
                          backgroundColor: 'var(--color-gray-50)',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          fontSize: '13px',
                          color: 'var(--color-gray-700)'
                        }}>
                          <p style={{ margin: 0, fontWeight: '600', marginBottom: '4px' }}>Booking Time:</p>
                          <p style={{ margin: 0, fontWeight: '500' }}>{selectedSlot.start} - {selectedSlot.end}</p>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: 'var(--color-success)',
                            color: 'white',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '14px',
                            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                            transition: 'all 0.2s ease',
                            opacity: submitting ? 0.7 : 1,
                            cursor: submitting ? 'not-allowed' : 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            if (!submitting) {
                              e.currentTarget.style.backgroundColor = '#059669'
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!submitting) {
                              e.currentTarget.style.backgroundColor = 'var(--color-success)'
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)'
                            }
                          }}
                        >
                          {submitting ? 'Confirming...' : 'Confirm Booking'}
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
