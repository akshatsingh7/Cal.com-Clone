# BookMe - Quick Start Guide

## 🚀 Local Development (5 minutes)

### Prerequisites
- Node.js (v16+)
- MySQL (locally installed)

### Setup

```bash
# 1. Create database and load schema
mysql -u root -p
```

```sql
CREATE DATABASE bookme;
USE bookme;
SOURCE /path/to/backend/schema.sql;
SOURCE /path/to/backend/seed.sql;
EXIT;
```

```bash
# 2. Backend - Terminal 1
cd backend
cp .env.example .env
# Edit .env with your MySQL password
npm install
npm run dev
```

```bash
# 3. Frontend - Terminal 2
cd frontend
cp .env.example .env
npm install
npm run dev
```

Visit **http://localhost:5173**

---

## ☁️ Production Deployment (20 minutes)

### 1️⃣ Database (Railway)
- Sign up at railway.app
- New Project → MySQL
- Copy DATABASE_URL
- Run schema.sql and seed.sql in Railway MySQL console

### 2️⃣ Backend (Render)
- Sign up at render.com
- New Web Service → GitHub
- Root directory: `backend`
- Build: `npm install`
- Start: `node server.js`
- Env vars:
  - `DATABASE_URL=` (from Railway)
  - `FRONTEND_URL=` (your Vercel URL)
  - `PORT=3001`

### 3️⃣ Frontend (Vercel)
- Sign up at vercel.com
- Import GitHub repo
- Root directory: `frontend`
- Env var: `VITE_API_URL=` (your Render URL)
- Deploy!

---

## 📝 Example Usage

### Admin Dashboard
1. Open http://localhost:5173
2. Click "Event Types" → "+ New Event Type"
3. Fill: Title="30min Meeting", Duration=30, Slug="meeting"
4. Click "Copy Link" button
5. Test public page by visiting http://localhost:5173/meeting

### Public Booking
1. Select date from calendar
2. Pick available time slot
3. Enter name and email
4. Click "Confirm Booking"
5. See confirmation page

### Manage Bookings
1. Go to "Bookings" tab
2. See list of upcoming and past bookings
3. Click "Cancel" to cancel any upcoming booking

---

## 🐛 Debugging

**Port already in use?**
```bash
kill -9 $(lsof -t -i:3001)  # Kill backend
kill -9 $(lsof -t -i:5173)  # Kill frontend
```

**Database connection failed?**
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT VERSION();"

# Verify DATABASE_URL format
# mysql://user:password@localhost:3306/bookme
```

**CORS errors?**
- Verify FRONTEND_URL in backend .env
- Check backend is running on port 3001

---

## 📚 Key Files to Review

| File | Purpose |
|------|---------|
| `backend/routes/public.js` | Slot calculation logic |
| `frontend/src/pages/BookingPage.jsx` | Public booking flow |
| `backend/schema.sql` | Database design |
| `README.md` | Full documentation |

---

## ✅ Testing Checklist

- [ ] Create event type
- [ ] Copy and visit public link
- [ ] Book a slot
- [ ] Confirm booking appears in admin
- [ ] Cancel booking
- [ ] Update availability
- [ ] Set event inactive/active days

---

Good luck! 🎉
