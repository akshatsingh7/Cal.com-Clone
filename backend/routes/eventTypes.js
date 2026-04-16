import express from 'express';
import { getDb } from '../db/connection.js';

const router = express.Router();

// GET all event types
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.execute('SELECT * FROM event_types ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching event types:', error);
    res.status(500).json({ error: 'Failed to fetch event types' });
  }
});

// GET single event type by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.execute('SELECT * FROM event_types WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event type:', error);
    res.status(500).json({ error: 'Failed to fetch event type' });
  }
});

// POST create new event type
router.post('/', async (req, res) => {
  try {
    const { title, description, duration_minutes, slug } = req.body;
    
    // Validate required fields
    if (!title || !duration_minutes || !slug) {
      return res.status(400).json({ error: 'Missing required fields: title, duration_minutes, slug' });
    }
    
    if (duration_minutes <= 0) {
      return res.status(400).json({ error: 'duration_minutes must be positive' });
    }
    
    const db = getDb();
    const [result] = await db.execute(
      'INSERT INTO event_types (title, description, duration_minutes, slug) VALUES (?, ?, ?, ?)',
      [title, description || null, duration_minutes, slug]
    );
    
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      duration_minutes,
      slug,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating event type:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create event type' });
  }
});

// PUT update event type
router.put('/:id', async (req, res) => {
  try {
    const { title, description, duration_minutes, slug } = req.body;
    
    if (!title || !duration_minutes || !slug) {
      return res.status(400).json({ error: 'Missing required fields: title, duration_minutes, slug' });
    }
    
    if (duration_minutes <= 0) {
      return res.status(400).json({ error: 'duration_minutes must be positive' });
    }
    
    const db = getDb();
    const [result] = await db.execute(
      'UPDATE event_types SET title = ?, description = ?, duration_minutes = ?, slug = ? WHERE id = ?',
      [title, description || null, duration_minutes, slug, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    
    res.json({ id: req.params.id, title, description, duration_minutes, slug });
  } catch (error) {
    console.error('Error updating event type:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update event type' });
  }
});

// DELETE event type
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const [result] = await db.execute('DELETE FROM event_types WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    
    res.json({ message: 'Event type deleted successfully' });
  } catch (error) {
    console.error('Error deleting event type:', error);
    res.status(500).json({ error: 'Failed to delete event type' });
  }
});

export default router;
