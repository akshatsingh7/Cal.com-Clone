import express from 'express';
import { getDb } from '../db/connection.js';

const router = express.Router();

// GET all bookings with optional filter
router.get('/', async (req, res) => {
  try {
    const { filter } = req.query;
    const db = getDb();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    let query = `
      SELECT 
        b.*, 
        et.title as event_type_title
      FROM bookings b
      JOIN event_types et ON b.event_type_id = et.id
    `;
    
    if (filter === 'upcoming') {
      query += ` WHERE b.start_time > '${now}' AND b.status = 'confirmed'`;
    } else if (filter === 'past') {
      query += ` WHERE b.start_time <= '${now}' AND b.status = 'confirmed'`;
    }
    
    query += ' ORDER BY b.start_time DESC';
    
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// DELETE booking (set status to cancelled)
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const [result] = await db.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      ['cancelled', req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;
