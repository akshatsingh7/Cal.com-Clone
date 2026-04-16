import React, { useEffect, useState } from 'react'
import axios from 'axios'
import EventTypeCard from '../components/EventTypeCard'

// Dashboard shows all event types at a glance
const Dashboard = () => {
  const [eventTypes, setEventTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all event types on component mount
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/event-types`)
        setEventTypes(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to load event types')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEventTypes()
  }, [])

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ marginBottom: '10px', fontSize: '32px', fontWeight: 'bold' }}>Dashboard</h1>
      <p style={{ color: '#6B7280', marginBottom: '30px' }}>Welcome to BookMe. View your event types below.</p>
      
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

      {eventTypes.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#6B7280'
        }}>
          No event types yet. Create one to get started!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {eventTypes.map((eventType) => (
            <EventTypeCard key={eventType.id} eventType={eventType} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
