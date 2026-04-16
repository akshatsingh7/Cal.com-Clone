import express from 'express';
import { getDb } from '../db/connection.js';

const router = express.Router();

// Helper: Convert time string (HH:MM:SS) to minutes since midnight
const timeToMinutes = (timeStr) => {
  const [h, m, s] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// Helper: Convert minutes since midnight to HH:MM string
const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

// Helper: Add minutes to a date
const addMinutes = (date, minutes) => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

// Helper: Format datetime as YYYY-MM-DD HH:MM:SS
const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// GET event type details by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const db = getDb();
    
    const [rows] = await db.execute(
      'SELECT * FROM event_types WHERE slug = ?',
      [slug]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event type:', error);
    res.status(500).json({ error: 'Failed to fetch event type' });
  }
});

// GET available time slots for a date (public)
router.get('/:slug/slots', async (req, res) => {
  try {
    const { slug } = req.params;
    const { date: dateStr } = req.query;
    
    if (!dateStr) {
      return res.status(400).json({ error: 'Date query parameter is required (YYYY-MM-DD)' });
    }
    
    const db = getDb();
    
    // Get event type
    const [eventTypes] = await db.execute(
      'SELECT * FROM event_types WHERE slug = ?',
      [slug]
    );
    
    if (eventTypes.length === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    
    const eventType = eventTypes[0];
    const durationMinutes = eventType.duration_minutes;
    
    // Parse date and get day of week (0=Sunday, 1=Monday, etc.)
    const selectedDate = new Date(dateStr);
    if (isNaN(selectedDate)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }
    
    const dayOfWeek = selectedDate.getDay();
    
    // Get availability for this day
    const [availabilities] = await db.execute(
      'SELECT * FROM availability WHERE day_of_week = ?',
      [dayOfWeek]
    );
    
    if (availabilities.length === 0) {
      return res.json({ slots: [] });
    }
    
    const availability = availabilities[0];
    
    if (!availability.is_active) {
      return res.json({ slots: [] });
    }
    
    // Generate all possible slots
    const startMinutes = timeToMinutes(availability.start_time);
    const endMinutes = timeToMinutes(availability.end_time);
    const slots = [];
    
    for (let i = startMinutes; i + durationMinutes <= endMinutes; i += 15) {
      slots.push({
        start: minutesToTime(i),
        end: minutesToTime(i + durationMinutes)
      });
    }
    
    // Get confirmed bookings for this date
    const dateStart = `${dateStr} 00:00:00`;
    const dateEnd = `${dateStr} 23:59:59`;
    
    const [bookings] = await db.execute(
      'SELECT start_time, end_time FROM bookings WHERE event_type_id = ? AND status = ? AND DATE(start_time) = ?',
      [eventType.id, 'confirmed', dateStr]
    );
    
    // Remove slots that conflict with bookings
    const availableSlots = slots.filter(slot => {
      const slotStart = new Date(`${dateStr}T${slot.start}:00`);
      const slotEnd = new Date(`${dateStr}T${slot.end}:00`);
      
      return !bookings.some(booking => {
        const bookingStart = new Date(booking.start_time);
        const bookingEnd = new Date(booking.end_time);
        
        // Check for overlap: slot overlaps with booking if slot starts before booking ends AND slot ends after booking starts
        return slotStart < bookingEnd && slotEnd > bookingStart;
      });
    });
    
    res.json({ slots: availableSlots });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
});

// POST create booking (public)
router.post('/:slug/book', async (req, res) => {
  try {
    const { slug } = req.params;
    const { booker_name, booker_email, date, time } = req.body;
    
    if (!booker_name || !booker_email || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields: booker_name, booker_email, date, time' });
    }
    
    const db = getDb();
    
    // Get event type
    const [eventTypes] = await db.execute(
      'SELECT * FROM event_types WHERE slug = ?',
      [slug]
    );
    
    if (eventTypes.length === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    
    const eventType = eventTypes[0];
    
    // Parse start time
    const startDateTime = new Date(`${date}T${time}:00`);
    if (isNaN(startDateTime)) {
      return res.status(400).json({ error: 'Invalid date or time format' });
    }
    
    // Calculate end time
    const endDateTime = addMinutes(startDateTime, eventType.duration_minutes);
    
    // Check for conflicts with confirmed bookings
    const startTimeStr = formatDateTime(startDateTime);
    const endTimeStr = formatDateTime(endDateTime);
    
    const [conflicts] = await db.execute(
      `SELECT id FROM bookings 
       WHERE event_type_id = ? AND status = ? 
       AND start_time < ? AND end_time > ?`,
      [eventType.id, 'confirmed', endTimeStr, startTimeStr]
    );
    
    if (conflicts.length > 0) {
      return res.status(409).json({ error: 'This time slot is no longer available' });
    }
    
    // Create booking
    const [result] = await db.execute(
      `INSERT INTO bookings (event_type_id, booker_name, booker_email, start_time, end_time, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [eventType.id, booker_name, booker_email, startTimeStr, endTimeStr, 'confirmed']
    );
    
    res.status(201).json({
      id: result.insertId,
      event_type_title: eventType.title,
      booker_name,
      booker_email,
      start_time: startTimeStr,
      end_time: endTimeStr,
      status: 'confirmed'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

export default router;
