import express from 'express';
import { getDb } from '../db/connection.js';

const router = express.Router();

// GET all availability (one row per day of week)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.execute('SELECT * FROM availability ORDER BY day_of_week ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// PUT update availability (replace all rows with new data)
router.put('/', async (req, res) => {
  try {
    const { availability, timezone } = req.body;
    
    // availability should be an array of 7 objects: { day_of_week, is_active, start_time, end_time }
    if (!Array.isArray(availability) || availability.length !== 7) {
      return res.status(400).json({ error: 'Availability must be an array of 7 days' });
    }
    
    if (!timezone) {
      return res.status(400).json({ error: 'Timezone is required' });
    }
    
    const db = getDb();
    
    // Delete existing availability
    await db.execute('DELETE FROM availability');
    
    // Insert new availability
    for (const day of availability) {
      const { day_of_week, is_active, start_time, end_time } = day;
      
      // If day is inactive, store 00:00:00 for both times
      const actualStartTime = is_active ? start_time : '00:00:00';
      const actualEndTime = is_active ? end_time : '00:00:00';
      
      await db.execute(
        'INSERT INTO availability (day_of_week, start_time, end_time, timezone, is_active) VALUES (?, ?, ?, ?, ?)',
        [day_of_week, actualStartTime, actualEndTime, timezone, is_active ? 1 : 0]
      );
    }
    
    res.json({ message: 'Availability updated successfully' });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

export default router;
