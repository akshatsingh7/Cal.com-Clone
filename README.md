# BookMe - Cal.com Clone

A full-stack scheduling application that allows users to set up event types, manage availability, and receive bookings through a public calendar interface. Built with React, Node.js, and MySQL.

## Project Overview

BookMe is a Cal.com-inspired booking platform designed as a fullstack intern assignment. It demonstrates key concepts in full-stack web development including:

- **Frontend**: React with Vite for fast development and optimized production builds
- **Backend**: Express.js API with proper routing and error handling
- **Database**: MySQL for relational data storage
- **No Docker/Local servers**: Everything is cloud-hosted from day one

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend  | React 18 + Vite |
| Backend   | Node.js + Express.js |
| Database  | MySQL |
| Frontend Hosting | Vercel |
| Backend Hosting | Render (free tier) |
| Database Hosting | Railway (free tier) |

## Project Structure

```
bookme/
├── frontend/                    # React Vite application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.jsx   # Home page showing event types
│   │   │   ├── EventTypes.jsx  # Manage event types (CRUD)
│   │   │   ├── Availability.jsx# Set weekly schedule
│   │   │   ├── Bookings.jsx    # View and cancel bookings
│   │   │   ├── BookingPage.jsx # Public booking form
│   │   │   └── ConfirmationPage.jsx # Booking success
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.jsx      # Left sidebar navigation
│   │   │   ├── EventTypeCard.jsx # Event display card
│   │   │   ├── CalendarPicker.jsx # Date selection
│   │   │   └── TimeSlotPicker.jsx  # Time selection
│   │   ├── App.jsx             # Main routing
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── .env.example
│   ├── vite.config.js
│   └── index.html
│
├── backend/                      # Express.js API
│   ├── routes/
│   │   ├── eventTypes.js       # CRUD for event types
│   │   ├── availability.js     # Manage weekly availability
│   │   ├── bookings.js         # View and cancel bookings
│   │   └── public.js           # Public booking APIs
│   ├── db/
│   │   └── connection.js       # MySQL connection pool
│   ├── server.js               # Express app entry point
│   ├── package.json
│   ├── .env.example
│   ├── schema.sql              # Database schema
│   └── seed.sql                # Sample data
│
└── README.md                     # This file
```

## Database Schema

### event_types
Stores event type configurations for the booking professional.

| Column | Type | Properties |
|--------|------|-----------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| title | VARCHAR(255) | Event title (e.g., "Quick Call") |
| description | TEXT | Event description |
| duration_minutes | INT | Meeting duration |
| slug | VARCHAR(100) | UNIQUE - used in public URL |
| created_at | TIMESTAMP | Creation timestamp |

**Design rationale**: Slug allows shareable URLs like `bookme.com/quick-call`

### availability
Defines recurring weekly working hours.

| Column | Type | Properties |
|--------|------|-----------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| day_of_week | TINYINT | 0=Sun, 1=Mon, ..., 6=Sat |
| start_time | TIME | Working hours start (e.g., 09:00:00) |
| end_time | TIME | Working hours end (e.g., 17:00:00) |
| timezone | VARCHAR(50) | IANA timezone (e.g., Asia/Kolkata) |
| is_active | BOOLEAN | Whether this day is available |

**Design rationale**: Weekly recurring schedule allows simple day-of-week based slot calculation without per-date overrides (MVP limitation)

### bookings
Stores actual meeting reservations.

| Column | Type | Properties |
|--------|------|-----------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| event_type_id | INT | FOREIGN KEY → event_types.id |
| booker_name | VARCHAR(255) | Name of person booking |
| booker_email | VARCHAR(255) | Email of person booking |
| start_time | DATETIME | Meeting start (UTC) |
| end_time | DATETIME | Meeting end (UTC) |
| status | ENUM | 'confirmed' or 'cancelled' |
| created_at | TIMESTAMP | Booking creation time |

**Design rationale**: Status enum allows soft-deletion (marks cancelled vs. deleted). Indexed on event_type_id for fast availability queries.

## API Endpoints

### Admin Endpoints (Behind firewall in production, for now open)

#### Event Types
```
GET    /api/event-types              → Get all event types
POST   /api/event-types              → Create new event type
PUT    /api/event-types/:id          → Update event type
DELETE /api/event-types/:id          → Delete event type
```

#### Availability
```
GET    /api/availability             → Get weekly availability
PUT    /api/availability             → Update all availability (replace)
```

#### Bookings
```
GET    /api/bookings?filter=upcoming → Get upcoming bookings
GET    /api/bookings?filter=past     → Get past bookings
DELETE /api/bookings/:id             → Cancel booking (soft delete)
```

### Public Endpoints (No authentication)

```
GET    /api/public/:slug                      → Get event type details
GET    /api/public/:slug/slots?date=YYYY-MM-DD → Get available time slots
POST   /api/public/:slug/book                 → Create a booking
```

## Slot Calculation Logic

The backend automatically calculates available time slots:

1. **Get event duration** from the event_type
2. **Get availability** for the requested day of week
3. **Generate slots** every 15 minutes from start_time to end_time
4. **Query confirmed bookings** for that date
5. **Filter out conflicts** - remove slots that overlap with existing bookings
6. **Return available slots** as array of `{ start: "HH:MM", end: "HH:MM" }`

Example: For a 30-minute meeting on Monday (9am-5pm availability):
- Generated slots: 9:00, 9:15, 9:30, ..., 4:30 (16 slots per hour)
- After filtering conflicts: Returns only non-overlapping slots

## Setup Instructions

### Local Development Setup

#### 1. Clone and Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

#### 2. Set Up Database Locally

Install MySQL locally, then:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE bookme;
USE bookme;
SOURCE schema.sql;
SOURCE seed.sql;
```

#### 3. Configure Environment Variables

**Backend** (`.env`):
```
DATABASE_URL=mysql://root:password@localhost:3306/bookme
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:3001
```

#### 4. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` (Frontend will auto-proxy API to backend)

---

### Production Deployment

#### Step 1: Deploy MySQL to Railway

1. Go to [railway.app](https://railway.app)
2. Create new account (free)
3. New Project → Add MySQL plugin
4. In Variables tab, copy the `DATABASE_URL`
5. In MySQL console, run:
   ```sql
   SOURCE schema.sql;
   SOURCE seed.sql;
   ```

#### Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Create new account (free)
3. New Web Service → GitHub (authorize and select repo)
4. Configure:
   - **Name**: bookme-api
   - **Root directory**: `backend`
   - **Build command**: `npm install`
   - **Start command**: `node server.js`
5. Environment variables:
   - `DATABASE_URL`: Paste from Railway
   - `FRONTEND_URL`: (your Vercel frontend URL, e.g., `https://bookme.vercel.app`)
   - `PORT`: `3001`
6. Create Web Service

Note: Free tier sleeps after 15 minutes of inactivity. Add a scheduler to ping it or upgrade.

#### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Create new account with GitHub
3. Import GitHub repo
4. Configure:
   - **Framework**: Vite
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
5. Environment variable:
   - `VITE_API_URL`: Render backend URL (e.g., `https://bookme-api.onrender.com`)
6. Deploy

#### Step 4: Verify Deployment

1. Visit your Vercel frontend URL
2. Create an event type
3. Visit `{vercel-url}/your-event-slug` to test public booking page
4. Verify booking appears in admin dashboard

## Frontend Components

### Dashboard
- Displays all event types as cards
- Shows event title, duration, description
- "Copy Link" button to share public booking page
- Clean grid layout

### Event Types Page
- List, create, edit, delete event types
- Form validation
- Auto-generate slug from title
- Table with all event types

### Availability Page
- 7 rows (one per day of week)
- Toggle active/inactive for each day
- Dropdown selectors for start/end times (15-min intervals)
- Timezone selector
- Save button that PUTs to backend

### Bookings Page
- Two tabs: Upcoming / Past
- Table showing: Event, Booker Name, Email, Date & Time
- Cancel button for upcoming bookings

### BookingPage (Public)
- No navbar sidebar (public-facing)
- Left side: Event info (title, duration, description)
- Right side: Calendar → Time slots → Booking form
- Calendar shows only available days (no weekends by default)
- Time slots shown as buttons in grid layout
- Form collects name and email
- Submit creates booking and redirects to confirmation

### ConfirmationPage
- Success message with booking details
- Booking ID and full details
- "Add to Google Calendar" button
- "Send email" action

## Code Quality Standards

All code follows these principles for clarity and learning:

1. **Async/Await**: Used everywhere, never callbacks
2. **Variable naming**: Meaningful names throughout (no `a`, `b`, `temp`)
3. **Comments**: Short explanations above every function
4. **Error handling**: Try/catch in all routes and components
5. **File size**: Each file under 150 lines (split if needed)
6. **Minimal dependencies**: Only essential packages installed
7. **Secrets management**: All sensitive data in `.env` files
8. **Simple code**: No complex patterns, beginner-friendly approach

## Key Assumptions

1. **Single User** - No multi-user support or authentication (can add with JWT tokens later)
2. **Timezone Display Only** - All times stored in UTC, timezone is display preference
3. **No Email Notifications** - Bookings created but no email sent (can add with Nodemailer)
4. **Weekly Recurring Availability** - No per-date overrides, same schedule every week
5. **No Cancellation Emails** - When bookings are cancelled, no notification sent
6. **No Time Zone Conversion** - Public booking form uses visitor's browser timezone

## Extending the Application

### Add Email Notifications
```bash
npm install nodemailer
```

In `bookings.js` POST route, add:
```javascript
const transporter = nodemailer.createTransport({...})
await transporter.sendMail({
  to: booking.booker_email,
  subject: `Booking Confirmed: ${eventType.title}`,
  html: `Your booking is confirmed...`
})
```

### Add Authentication
```bash
npm install jsonwebtoken bcryptjs
```

Add login endpoint, JWT middleware, and `creator_id` column to event_types.

### Add Email Reminders
Add a cron job (node-cron) to send reminder emails 1 day before meetings.

### Add Google Meet/Zoom Integration
```bash
npm install googleapis
```

Generate meeting links when booking is created.

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL format: `mysql://user:password@host:port/database`
- Verify MySQL service is running: `mysql -u root -p` (local)
- On Railway: Verify database is provisioned and variables are set

### "CORS error when booking"
- Check FRONTEND_URL in backend .env matches your actual frontend URL
- Ensure backend is running and accessible

### "Event not found" on public page
- Check the slug in URL matches the slug in database
- Visit `/api/public/{slug}` in browser to debug

### "Deployment stuck on free tier"
- Render free tier spins down after 15 min inactivity
- Add [Uptime Robot](https://uptimerobot.com) to ping backend API every 5 min
- Or upgrade to Render paid tier

## Code Examples for Interview

### Slot Calculation (Public API)
Shows understanding of: time arithmetic, database queries, filtering algorithm
```javascript
// In routes/public.js - GET /:slug/slots
// Generate 15-min slots, query existing bookings, filter conflicts
```

### React State Management
Shows understanding of: hooks, form handling, async operations
```javascript
// In BookingPage.jsx - manages date, slots, form data
// Demonstrates useState, useEffect, and controlled components
```

### Database Design
Shows understanding of: normalization, relationships, indexing
```sql
-- Database schema demonstrates:
-- Foreign key relationships (bookings → event_types)
-- UNIQUE constraints (slug)
-- Efficient querying with indexes
```

## Performance Notes

- Calendar date picking is fast (manual calculation, no heavy libs)
- Slot queries filtered by date and event_type_id (indexed)
- No N+1 queries in booking list (single JOIN)
- Frontend uses Vite for fast cold start (<1s)
- All API responses are JSON (lightweight)

## Security Notes

**⚠️ This is a learning project, not production-ready**

For production, add:
- Authentication (JWT/OAuth)
- Rate limiting on public booking endpoint
- Input validation and sanitization
- HTTPS only
- CORS properly configured for specific domain
- SQL injection protection (using prepared statements ✓ already have this)
- XSS protection
- Booking confirmation via email

## License

MIT

## Questions? Interview Talking Points

1. **Why MySQL over NoSQL for this?** - Structured data, relationships between tables, ACID compliance
2. **How would you add authentication?** - JWT tokens, bcrypt for password hashing, middleware to protect routes
3. **How does slot calculation work?** - Generate slots, query conflicts, filter overlaps
4. **Why is the slug field unique?** - Allows shareable public URLs like `/quick-call`
5. **Why store all times in UTC?** - Prevents timezone confusion, convert to user timezone on frontend
6. **How would you handle timezone display on frontend?** - Use date-fns with user's local timezone, calculate offset server-side
7. **What's the database indexing strategy?** - Indexed on event_type_id and start_time for fast booking queries
8. **Why no Docker?** - Learning project focused on hosting platforms (Railway, Render, Vercel)
9. **How does the booking lock work?** - SQL prevents race conditions naturally; multiple POSTs create separate bookings (need improvement)
10. **What's the hardest part you'd fix?** - Concurrent bookings could double-book; add transaction-level locking or application-level mutex

---

**Built with 💙 as a fullstack learning project**
