# 🚀 BookMe - Deployment Checklist

Use this checklist to ensure all components are properly set up before deploying to production.

---

## ✅ PRE-DEPLOYMENT SETUP

### Local Environment
- [ ] Node.js v16+ installed (`node --version`)
- [ ] MySQL running locally (`mysql -u root -p`)
- [ ] Project cloned and dependencies installed
  - [ ] `cd backend && npm install`
  - [ ] `cd frontend && npm install`
- [ ] Backend runs locally: `npm run dev` (on port 3001)
- [ ] Frontend runs locally: `npm run dev` (on port 5173)
- [ ] Can create event type and view on public page

### Git Setup
- [ ] Project pushed to GitHub
- [ ] Repo is public (for Vercel/Render)
- [ ] Main branch is clean and ready

---

## 🗄️ STEP 1: Database Setup (Railway)

### Railway Account & Project
- [ ] Create free account at https://railway.app
- [ ] Verify email
- [ ] Create new project
- [ ] Add MySQL plugin
- [ ] Wait for MySQL to provision (1-2 min)

### Railway Variables
- [ ] Go to "Variables" tab
- [ ] Find and copy `DATABASE_URL` (format: `mysql://user:password@host:port/db`)
- [ ] Copy connection string to notepad (you'll need it for backend)

### Database Schema
- [ ] In Railway MySQL console, run:
  ```sql
  SOURCE /path/to/schema.sql;
  SOURCE /path/to/seed.sql;
  ```
- [ ] Verify tables exist:
  ```sql
  SHOW TABLES;  -- Should show: availability, bookings, event_types
  SELECT * FROM event_types;  -- Should show 3 sample types
  ```

---

## 🔧 STEP 2: Backend Setup (Render)

### Render Account & Service
- [ ] Create free account at https://render.com
- [ ] Authorize GitHub
- [ ] Click "Create +" → "Web Service"
- [ ] Select your GitHub repo
- [ ] Connect

### Backend Configuration
- [ ] **Name**: `bookme-api`
- [ ] **Root directory**: `backend`
- [ ] **Runtime**: Node
- [ ] **Build command**: `npm install`
- [ ] **Start command**: `node server.js`
- [ ] **Plan**: Free

### Backend Environment Variables
Copy exactly as shown:
- [ ] `DATABASE_URL` = (paste from Railway)
- [ ] `FRONTEND_URL` = (leave empty for now, update after Vercel deployment)
- [ ] `PORT` = `3001`

### Deployment
- [ ] Click "Create Web Service"
- [ ] Wait for build (2-3 min, shows "Deployed ✓")
- [ ] Copy the backend URL (e.g., `https://bookme-api.onrender.com`)
- [ ] Test health check: Visit `{backend-url}/api/health` in browser
  - Should see: `{"status":"ok","timestamp":"..."}`

---

## 🎨 STEP 3: Frontend Setup (Vercel)

### Vercel Account & Project
- [ ] Create free account at https://vercel.com
- [ ] Authorize GitHub
- [ ] Click "Import Project"
- [ ] Select your GitHub repo
- [ ] Click "Import"

### Frontend Configuration
- [ ] **Framework**: Vite
- [ ] **Root directory**: `frontend`
- [ ] **Build command**: `npm run build`
- [ ] **Install command**: `npm install`
- [ ] **Output directory**: `dist`

### Frontend Environment Variable
- [ ] `VITE_API_URL` = (paste backend URL from Render, e.g., `https://bookme-api.onrender.com`)

### Deployment
- [ ] Click "Deploy"
- [ ] Wait for build (1-2 min)
- [ ] Copy the frontend URL (e.g., `https://bookme.vercel.app`)
- [ ] Visit `{frontend-url}` in browser - should see BookMe dashboard

---

## 🔄 STEP 4: Cross-Configuration

### Update Backend FRONTEND_URL
Now that you have Vercel URL:
- [ ] Go to Render dashboard
- [ ] Select bookme-api service
- [ ] Go to "Environment"
- [ ] Edit `FRONTEND_URL` = (your Vercel URL)
- [ ] Save and redeploy

Render will auto-redeploy (1 min).

### Verify CORS
- [ ] Open browser console (F12)
- [ ] Go to `{frontend-url}/event-types`
- [ ] No CORS errors should appear
- [ ] If errors: check FRONTEND_URL on Render matches exactly

---

## 🧪 STEP 5: Production Testing

### Test Admin Dashboard
- [ ] Visit `{frontend-url}`
- [ ] Login/navigate (no auth needed for MVP)
- [ ] Go to Event Types
- [ ] Create new event: "30min Meeting", slug="demo", 30 min
- [ ] Should see it appear in Dashboard

### Test Public Booking
- [ ] Copy link to your new event type
- [ ] Visit `{frontend-url}/demo`
- [ ] Should see event details on left
- [ ] Calendar should load on right
- [ ] Click a date
- [ ] Should see available times
- [ ] Select time, fill name/email
- [ ] Click "Confirm Booking"
- [ ] Should see confirmation page with booking details

### Test Admin Sees Booking
- [ ] Go to `{frontend-url}/bookings`
- [ ] Should see your test booking in "Upcoming" tab
- [ ] Date/time/name should match what you entered

### Test Availability
- [ ] Go to `{frontend-url}/availability`
- [ ] Toggle a day off (e.g., Friday)
- [ ] Save
- [ ] Go back to public booking page
- [ ] Try to select Friday - should not be available (greyed out)

### Test Booking Conflict Prevention
- [ ] Book a slot for Monday 10:00
- [ ] In incognito window, visit same public page
- [ ] Select Monday, then 10:00 AM slot
- [ ] Should be unavailable/greyed out
- [ ] Select different time, should allow booking

---

## 🛠️ STEP 6: Production Monitoring

### Set Up Render Uptime Alerts
- [ ] Go to Render dashboard
- [ ] Select bookme-api service
- [ ] Go to "Events"
- [ ] Look for deploy errors
- [ ] (Optional) Set up email alerts in settings

### Keep Backend Awake (Free Tier)
Render free tier spins down after 15 min inactivity. To keep it alive:
- [ ] Create free account at https://uptimerobot.com
- [ ] Add new monitor
- [ ] URL: `{backend-url}/api/health`
- [ ] Check every 5 minutes
- [ ] This will keep backend API active

### Monitor Database (Railway)
- [ ] Go to Railway project
- [ ] Check "Metrics" tab
- [ ] Monitor CPU/memory usage
- [ ] Free tier should have plenty of space

### Check Vercel Logs
- [ ] Go to Vercel dashboard
- [ ] Select bookme project
- [ ] Click "Analytics" → "Web Vitals" to monitor performance
- [ ] Check "Function Logs" for any frontend errors

---

## 🔐 STEP 7: Post-Deployment Security

### Configure CORS Properly
- [ ] Email notifications are hardcoded to no-reply domain
- [ ] FRONTEND_URL is validated server-side ✓
- [ ] But add rate limiting for production:

```javascript
// In backend/server.js, add:
import rateLimit from 'express-rate-limit';
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // 10 requests per 15 min
});
app.post('/api/public/:slug/book', bookingLimiter, publicRouter);
```

### Enable HTTPS Verification
- [ ] Vercel: Automatic (HTTPS enforced) ✓
- [ ] Render: Automatic (HTTPS enforced) ✓
- [ ] Railway: Automatic (HTTPS enforced) ✓

### Backup Database
- [ ] Export from Railway MySQL:
  ```bash
  mysqldump -h {host} -u {user} -p {database} > backup.sql
  ```
- [ ] Save backup file and push to GitHub (gitignored)

---

## 📊 STEP 8: Verification Checklist

Run through once more:

### Functionality
- [ ] Create event type from admin
- [ ] Public booking page loads
- [ ] Calendar shows available dates
- [ ] Can book a slot
- [ ] Booking appears in admin
- [ ] Can cancel booking
- [ ] Can update availability
- [ ] Past dates are greyed out in calendar

### Performance
- [ ] Page loads in < 3 seconds
- [ ] No console errors (F12 DevTools)
- [ ] Booking flow completes smoothly
- [ ] No 404 or 500 errors

### Cross-Browser
- [ ] Tested in Chrome ✓
- [ ] Tested in Firefox (optional)
- [ ] Tested on mobile Safari (optional)

### Database
- [ ] Can query from Railway console ✓
- [ ] Sample data is seeded ✓
- [ ] No connection errors in Render logs ✓

---

## 🎉 LAUNCH READY!

When all checkboxes are complete:

1. **Share your booking page**: `https://{your-frontend-url}/{event-slug}`
2. **Share admin dashboard**: `https://{your-frontend-url}`
3. **Repository**: Push any updates to GitHub
4. **For interviews**: Reference FILE_GUIDE.md for walking through architecture

---

## 🆘 Troubleshooting Deploy

| Issue | Solution |
|-------|----------|
| Backend build fails on Render | Check `backend/package.json` exists, run `npm install` locally first |
| Frontend build fails on Vercel | Check `frontend/vite.config.js`, run `npm run build` locally first |
| Missing env variables | Verify all 3 vars set: DATABASE_URL, FRONTEND_URL, VITE_API_URL |
| CORS errors | Check FRONTEND_URL matches exactly (including https://) |
| Booking fails with 500 | Check backend logs on Render → Recent Logs tab |
| Cannot see event types | Check DATABASE_URL and seed.sql ran in Railway |
| Calendar won't load | Check VITE_API_URL in Vercel works in browser: visit `{VITE_API_URL}/api/health` |

---

## 📝 Final Notes

- **Free tier limits**: 
  - Railway MySQL: 5 GB free (more than enough)
  - Render: Spins down after 15 min (use uptime robot)
  - Vercel: 100 deployments/month free

- **For production**: Consider upgrading any tier for 99.9% uptime SLA

- **Scale up later**: Architecture supports horizontal scaling (add load balancer, replicate API, optimize DB)

---

**Deployment completed! 🚀**

Next: Share your project URL in interviews and walk through the code!
