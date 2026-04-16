-- Insert event types
INSERT INTO event_types (title, description, duration_minutes, slug) VALUES
('Quick Call', '15 minute quick call to discuss your needs', 15, 'quick-call'),
('Standard Meeting', '30 minute meeting for in-depth discussion', 30, 'standard-meeting'),
('Deep Dive', '60 minute comprehensive session', 60, 'deep-dive');

-- Insert availability (Mon-Fri 9am-5pm IST, Sun=0, Mon=1...Sat=6)
INSERT INTO availability (day_of_week, start_time, end_time, timezone, is_active) VALUES
(0, '00:00:00', '00:00:00', 'Asia/Kolkata', FALSE),  -- Sunday off
(1, '09:00:00', '17:00:00', 'Asia/Kolkata', TRUE),   -- Monday
(2, '09:00:00', '17:00:00', 'Asia/Kolkata', TRUE),   -- Tuesday
(3, '09:00:00', '17:00:00', 'Asia/Kolkata', TRUE),   -- Wednesday
(4, '09:00:00', '17:00:00', 'Asia/Kolkata', TRUE),   -- Thursday
(5, '09:00:00', '17:00:00', 'Asia/Kolkata', TRUE),   -- Friday
(6, '00:00:00', '00:00:00', 'Asia/Kolkata', FALSE);  -- Saturday off

-- Insert sample bookings
-- Assuming today is 2026-04-16, inserting past, upcoming, and future bookings
INSERT INTO bookings (event_type_id, booker_name, booker_email, start_time, end_time, status) VALUES
(1, 'John Doe', 'john@example.com', '2026-04-10 10:00:00', '2026-04-10 10:15:00', 'confirmed'),
(2, 'Jane Smith', 'jane@example.com', '2026-04-17 14:00:00', '2026-04-17 14:30:00', 'confirmed'),
(3, 'Bob Johnson', 'bob@example.com', '2026-04-20 11:00:00', '2026-04-20 12:00:00', 'confirmed');
