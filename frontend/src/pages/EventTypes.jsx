import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'

// Page for managing event types with CRUD operations
const EventTypes = () => {
  const [eventTypes, setEventTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_minutes: 30,
    slug: ''
  })

  // Fetch all event types
  useEffect(() => {
    fetchEventTypes()
  }, [])

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

  // Auto-generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_minutes' ? parseInt(value) : value
    }))
  }

  // Handle title change and auto-generate slug
  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.slug || !formData.duration_minutes) {
      setError('Please fill in all required fields')
      return
    }

    try {
      if (editingId) {
        // Update existing
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/event-types/${editingId}`,
          formData
        )
      } else {
        // Create new
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/event-types`,
          formData
        )
      }

      // Reset form and refresh list
      setFormData({ title: '', description: '', duration_minutes: 30, slug: '' })
      setShowForm(false)
      setEditingId(null)
      setError(null)
      await fetchEventTypes()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save event type')
      console.error(err)
    }
  }

  // Edit event type
  const handleEdit = (eventType) => {
    setFormData(eventType)
    setEditingId(eventType.id)
    setShowForm(true)
  }

  // Delete event type
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event type?')) return

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/event-types/${id}`)
      setError(null)
      await fetchEventTypes()
    } catch (err) {
      setError('Failed to delete event type')
      console.error(err)
    }
  }

  // Cancel form
  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ title: '', description: '', duration_minutes: 30, slug: '' })
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Event Types</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563EB',
              color: 'white',
              borderRadius: '6px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
          >
            + New Event Type
          </button>
        )}
      </div>

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

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g., Quick Call"
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
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe this event type..."
              rows="3"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleChange}
                min="1"
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

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="auto-generated"
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
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#10B981',
                color: 'white',
                borderRadius: '6px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: '10px 20px',
                backgroundColor: '#E5E7EB',
                color: '#1F2937',
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Title</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Duration</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Slug</th>
              <th style={{ padding: '15px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventTypes.map((et) => (
              <tr key={et.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={{ padding: '15px', fontSize: '14px' }}>{et.title}</td>
                <td style={{ padding: '15px', fontSize: '14px', color: '#6B7280' }}>{et.duration_minutes} min</td>
                <td style={{ padding: '15px', fontSize: '14px', color: '#6B7280' }}>{et.slug}</td>
                <td style={{ padding: '15px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleEdit(et)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <PencilIcon width={16} height={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(et.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#FEE2E2',
                      color: '#991B1B',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <TrashIcon width={16} height={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {eventTypes.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
            No event types yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  )
}

export default EventTypes
