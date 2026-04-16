import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

// Page for viewing and managing bookings
const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('upcoming')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch bookings based on tab
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings?filter=${activeTab}`
        )
        setBookings(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to load bookings')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [activeTab])

  // Cancel a booking
  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`)
      setError(null)
      // Refresh bookings
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings?filter=${activeTab}`
      )
      setBookings(response.data)
    } catch (err) {
      setError('Failed to cancel booking')
      console.error(err)
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ marginBottom: '10px', fontSize: '32px', fontWeight: 'bold' }}>Bookings</h1>
      <p style={{ color: '#6B7280', marginBottom: '30px' }}>View and manage your bookings.</p>

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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #E5E7EB' }}>
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            padding: '10px 0',
            borderBottom: activeTab === 'upcoming' ? '2px solid #2563EB' : 'none',
            color: activeTab === 'upcoming' ? '#2563EB' : '#6B7280',
            fontWeight: activeTab === 'upcoming' ? '600' : '500',
            cursor: 'pointer'
          }}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          style={{
            padding: '10px 0',
            borderBottom: activeTab === 'past' ? '2px solid #2563EB' : 'none',
            color: activeTab === 'past' ? '#2563EB' : '#6B7280',
            fontWeight: activeTab === 'past' ? '600' : '500',
            cursor: 'pointer'
          }}
        >
          Past
        </button>
      </div>

      {/* Bookings Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Event</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Booker</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Email</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Date & Time</th>
              <th style={{ padding: '15px', textAlign: 'right', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={{ padding: '15px', fontWeight: '500' }}>{booking.event_type_title}</td>
                <td style={{ padding: '15px', fontSize: '14px' }}>{booking.booker_name}</td>
                <td style={{ padding: '15px', fontSize: '14px', color: '#6B7280' }}>{booking.booker_email}</td>
                <td style={{ padding: '15px', fontSize: '14px' }}>
                  {format(new Date(booking.start_time), 'MMM d, yyyy h:mm a')}
                </td>
                <td style={{ padding: '15px', textAlign: 'right' }}>
                  {activeTab === 'upcoming' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <XMarkIcon width={16} height={16} />
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
            No {activeTab} bookings
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings
