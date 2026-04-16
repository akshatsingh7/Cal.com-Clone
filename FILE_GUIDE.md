# BookMe Project Files - Complete Overview

## 📁 Root Level

| File | Purpose |
|------|---------|
| `README.md` | Complete project documentation with API specs, setup, and troubleshooting |
| `QUICKSTART.md` | Quick setup guide (local dev + production in 20 min) |
| `.gitignore` | Git ignore rules for node_modules, .env, build files |

---

## 🗄️ Backend (`/backend`)

### Configuration & Entry Point
| File | Purpose |
|------|---------|
| `package.json` | Node dependencies: express, mysql2, cors, dotenv |
| `.env.example` | Template for `.env` (DATABASE_URL, PORT, FRONTEND_URL) |
| `server.js` | Express app setup, CORS config, route registration, error middleware |
| `schema.sql` | MySQL table definitions: event_types, availability, bookings |
| `seed.sql` | Sample data: 3 event types, 7-day availability, 3 sample bookings |

### Database
| File | Purpose |
|------|---------|
| `db/connection.js` | MySQL connection pool using mysql2/promise, DATABASE_URL parser |

### API Routes
| File | Purpose |
|------|---------|
| `routes/eventTypes.js` | CRUD endpoints for event types (admin): GET, POST, PUT, DELETE |
| `routes/availability.js` | Admin endpoints for weekly availability: GET all, PUT replace all |
| `routes/bookings.js` | Admin endpoints for bookings: GET with filter, DELETE to cancel |
| `routes/public.js` | **Public endpoints** (no auth): GET event by slug, GET slots for date, POST to book |

**Public Route Highlights:**
- Slot calculation: generates 15-min intervals, queries existing bookings, filters conflicts
- Booking creation: validates date/time, checks conflicts, creates booking, returns confirmation

---

## ⚛️ Frontend (`/frontend`)

### Configuration & Styling
| File | Purpose |
|------|---------|
| `package.json` | Dependencies: react, react-router-dom, axios, date-fns, @heroicons/react |
| `.env.example` | Template for `.env` (VITE_API_URL pointing to backend) |
| `vite.config.js` | Vite config: port 5173, React plugin |
| `index.html` | HTML entry point with `<div id="root">` and main.jsx script |
| `src/index.css` | Global styles: reset, fonts, basic element styling |

### Main App
| File | Purpose |
|------|---------|
| `src/main.jsx` | React DOM render entry point, mounts App to #root |
| `src/App.jsx` | Route configuration using React Router: 6 routes (admin + public) |

### Pages (Admin Dashboard)
| File | Purpose | Key Features |
|------|---------|--------------|
| `src/pages/Dashboard.jsx` | Home page | Displays event types as cards, shows duration |
| `src/pages/EventTypes.jsx` | CRUD page | Create/edit/delete event types, auto-generate slug from title |
| `src/pages/Availability.jsx` | Schedule page | Set Mon-Fri availability, time dropdowns (15-min intervals), timezone selector |
| `src/pages/Bookings.jsx` | Bookings list | Upcoming/past tabs, table with details, cancel button |

### Pages (Public)
| File | Purpose | Flow |
|------|---------|------|
| `src/pages/BookingPage.jsx` | Public booking form | Event info → Calendar → Time slots → Form → Submit |
| `src/pages/ConfirmationPage.jsx` | Success page | Shows booking details, Google Calendar button, email link |

### Components (Reusable)
| File | Purpose | Props/State |
|------|---------|-----------|
| `src/components/Navbar.jsx` | Left sidebar | Links to all admin pages, dark background, icon nav |
| `src/components/EventTypeCard.jsx` | Event display | Receives eventType object, shows copy-link button |
| `src/components/CalendarPicker.jsx` | Date selector | Props: onDateSelect, disabledDays; Returns date string (YYYY-MM-DD) |
| `src/components/TimeSlotPicker.jsx` | Time selector | Props: slots array, onSlotSelect; Each slot has {start, end} in HH:MM format |

---

## 🔄 Data Flow Examples

### Creating a Booking (Public)
```
1. User visits /{slug}
2. BookingPage fetches event type: GET /api/public/{slug}
3. User selects date
4. BookingPage fetches slots: GET /api/public/{slug}/slots?date=YYYY-MM-DD
5. Backend: query availability, generate slots, filter against confirmed bookings
6. User selects time, fills name/email
7. POST /api/public/{slug}/book with {name, email, date, time}
8. Navigate to /{slug}/confirmed
```

### Admin Updates Availability
```
1. User visits /availability page
2. Availability.jsx fetches: GET /api/availability
3. User toggles days on/off, changes times, changes timezone
4. Click "Save"
5. PUT /api/availability with {availability: [...], timezone: "..."}
6. Backend deletes all rows, re-inserts new schedule
```

### Admin Views Bookings
```
1. User visits /bookings
2. Click "Upcoming" tab
3. Bookings.jsx: GET /api/bookings?filter=upcoming
4. Backend returns bookings with start_time > NOW(), status='confirmed'
5. Display table, can cancel upcoming bookings via DELETE /api/bookings/{id}
```

---

## 🎯 Key Technical Decisions

| Decision | Why |
|----------|-----|
| Slot calculation on backend | Can't trust client-side, ensures no double-bookings |
| MySQL instead of NoSQL | Relational data (event → booking), ACID compliance, easy relationships |
| Weekly recurring (not per-date) | MVP simplification, no calendar exceptions |
| Soft delete bookings | Can still see cancelled bookings in history, audit trail |
| Auto-generate slug | User-friendly URLs, better UX than numeric IDs |
| 15-min slot intervals | Standard for scheduling apps, granular booking |
| No multi-user auth | Learning project, single user MVP |
| All times stored UTC | Prevent timezone bugs, calculate locale on frontend |

---

## 🧪 Testing Workflows

### Test Event Creation
```
1. Dashboard → Event Types
2. New Event Type: "90-min Deep Work", slug="deep-work", 90 min
3. Dashboard shows new card
4. Copy link: localhost:5173/deep-work
```

### Test Booking
```
1. Visit localhost:5173/quick-call
2. Select Monday (available)
3. Pick 10:00 AM
4. Enter: name="John", email="john@example.com"
5. Submit
6. See confirmation with booking ID
7. Admin Bookings tab shows new booking
```

### Test Conflict Prevention
```
1. Book time slot for Monday 10:00
2. Try to book same slot in private window
3. Should be unavailable or conflict error
4. Pick different time, should succeed
```

### Test Timezone Display
```
1. Admin: Set availability to 9am EST
2. Public: Date picker should convert to visitor's timezone
3. Slot times shown in visitor's timezone (browser local time)
```

---

## 🚨 Common Issues & Fixes

| Issue | File to Check | Fix |
|-------|---------------|-----|
| "Cannot POST /api/events" | `backend/server.js` | Route not registered in server.js |
| CORS error on booking | `backend/server.js`, `FRONTEND_URL` env | Check CORS origin matches |
| "Database connection failed" | `backend/db/connection.js`, `.env` | Verify DATABASE_URL format and MySQL running |
| Slots not showing | `backend/routes/public.js` | Check availability.is_active = 1 for that day |
| "Slot already booked" | `backend/routes/public.js` | Check booking conflict logic in POST /book |
| Calendar shows past dates clickable | `frontend/src/components/CalendarPicker.jsx` | Check `isBefore(startOfDay(today))` logic |
| Vite build fails | `frontend/vite.config.js` | Check dist folder exists, JavaScript errors in build |

---

## 📊 Database Relationships

```
event_types (1) ──────────── (many) bookings
  id (PK)                       event_type_id (FK)
  title
  slug
  duration_minutes

availability (independent - no FK)
  id (PK)
  day_of_week (0-6)
  start_time
  end_time
  timezone
  is_active
```

---

## 🎓 Interview Talking Points by File

| Topic | File to Reference | Talking Point |
|-------|-------------------|--------------|
| Slot calculation | `backend/routes/public.js` | Explain the algorithm, complexity, edge cases (midnight slots) |
| Database design | `backend/schema.sql` | Why normalize, why slug is unique, why soft-delete |
| React patterns | `frontend/src/pages/BookingPage.jsx` | useState hooks, async/await, error handling |
| API design | `backend/routes/` | RESTful structure, proper HTTP methods, status codes |
| Error handling | `backend/routes/eventTypes.js` | Try/catch, specific error messages, client feedback |
| Calendar logic | `frontend/src/components/CalendarPicker.jsx` | Date manipulation, disabling past dates, grid layout |
| Full-stack flow | `README.md` → "Data Flow" section | Walk through end-to-end booking, multiple components |

---

## 🔒 Security Notes (What's Missing for Production)

- [ ] Authentication (JWT, OAuth)
- [ ] Rate limiting on public endpoints
- [ ] Input validation (both frontend + backend)
- [ ] Email verification for bookings
- [ ] HTTPS enforcement
- [ ] SQL query parameterization (✓ already have)
- [ ] XSS protection
- [ ] CORS whitelist (specific domain)
- [ ] Request logging
- [ ] Database backups

---

**Last updated: 2026-04-16**

For quick reference: Start with QUICKSTART.md, then read README.md for full details.
