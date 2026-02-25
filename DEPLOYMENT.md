# HRMS Lite - Deployment Guide

Complete step-by-step guide to deploy HRMS Lite to production using Render (Backend) and Vercel (Frontend).

## Overview

This guide covers:
1. Preparing the code for deployment
2. Deploying the backend to Render
3. Deploying the frontend to Vercel
4. Post-deployment configuration
5. Testing the production application

---

## Part 1: Prepare for Deployment

### Step 1.1: Push Code to GitHub

First, ensure your code is pushed to a GitHub repository.

```bash
# If not already a GitHub repo, create one on GitHub.com
# Then add the remote:
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git
git branch -M main
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 1.2: Verify Requirements Files

Ensure `backend/requirements.txt` is present and up to date:
```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.47
pydantic==2.4.2
pydantic-settings==2.1.0
python-dotenv==1.0.0
email-validator==2.1.0
```

---

## Part 2: Deploy Backend to Render

### Step 2.1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (recommended for easier integration)
3. Verify your email

### Step 2.2: Create New Web Service

1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub account:
   - Click **"Connect account"** next to your GitHub
   - Authorize Render to access your repositories
   - Select the `hrms-lite` repository

### Step 2.3: Configure Web Service

Fill in the configuration:

**Name**: 
```
hrms-lite-backend
```

**Environment**: 
```
Python 3
```

**Build Command**: 
```
pip install -r backend/requirements.txt
```

**Start Command**: 
```
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Plan**: Select Free tier (or upgrade as needed)

### Step 2.4: Configure Environment Variables

Click **"Environment"** tab and add:

```
DATABASE_URL=sqlite:///./hrms.db
PYTHON_VERSION=3.11
```

### Step 2.5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Wait for the deployment to complete (usually 2-5 minutes)
4. Once live, copy the service URL (e.g., `https://hrms-lite-backend.onrender.com`)

### Step 2.6: Verify Backend Deployment

Test your backend APIs:

```bash
# Health check
curl https://hrms-lite-backend.onrender.com/health

# API docs
curl https://hrms-lite-backend.onrender.com/docs
```

Or visit in browser:
- API Docs: `https://hrms-lite-backend.onrender.com/docs`
- ReDoc: `https://hrms-lite-backend.onrender.com/redoc`

**Keep this URL handy** - you'll need it for frontend configuration.

---

## Part 3: Deploy Frontend to Vercel

### Step 3.1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Verify your email

### Step 3.2: Import Project

1. Click **"Add New"** → **"Project"**
2. Select **"Import Git Repository"**
3. Paste your repository URL or select from connected account:
   ```
   https://github.com/YOUR_USERNAME/hrms-lite
   ```
4. Click **"Import"**

### Step 3.3: Configure Project Settings

**Project Name**: 
```
hrms-lite-frontend
```

**Framework Preset**: 
```
Vite
```

**Root Directory**: 
```
./frontend
```

**Build Command**: 
```
npm run build
```

**Output Directory**: 
```
dist
```

**Environment Variables**:

Click **"Environment Variables"** and add (Use the backend URL from Step 2.5):

```
Name: VITE_API_URL
Value: https://hrms-lite-backend.onrender.com
```

### Step 3.4: Deploy Frontend

1. Click **"Deploy"**
2. Vercel will automatically build and deploy
3. Wait for deployment to complete
4. Once done, Vercel provides your live URL (e.g., `https://hrms-lite-frontend.vercel.app`)

### Step 3.5: Verify Frontend Deployment

1. Visit your frontend URL in a browser
2. Try the following functionality:
   - Add an employee
   - View the employee list
   - Mark attendance
   - View attendance records
   - Delete an employee

---

## Part 4: Post-Deployment Configuration

### Step 4.1: Update CORS Settings (if needed)

If frontend and backend are on different domains, CORS is already configured in `backend/main.py`.

For production, you might want to restrict CORS:

Edit `backend/main.py`:
```python
origins = [
    "https://hrms-lite-frontend.vercel.app",  # Your frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then redeploy the backend.

### Step 4.2: Update Frontend Environment Variable (if needed)

If backend URL changes, update Vercel environment variables:

1. Go to Vercel project settings
2. Go to **"Environment Variables"**
3. Edit `VITE_API_URL` with the correct backend URL
4. Redeploy: Push a change to GitHub or trigger rebuild in Vercel

### Step 4.3: Enable Auto-Deployment

Both Render and Vercel auto-deploy when you push to the main branch. Ensure:

1. Your GitHub branch is `main`
2. Deployment settings are configured to watch the main branch

---

## Part 5: Testing Production

### Test Employee Management

1. Open your frontend URL
2. Go to **"Employees"** tab
3. Add a new employee:
   - Employee ID: EMP001
   - Full Name: John Doe
   - Email: john@example.com
   - Department: Engineering
4. Verify employee appears in the list
5. Delete the employee and verify removal

### Test Attendance Management

1. Add another employee (keep it)
2. Go to **"Attendance"** tab
3. Mark attendance:
   - Employee: Select the employee
   - Date: Today's date
   - Status: Present
4. Verify record appears in the table
5. Try marking attendance for the same date with same employee - it should fail with an error
6. Use the filter to filter by employee

### Test API Directly

Using curl or Postman:

```bash
# Get all employees
curl https://hrms-lite-backend.onrender.com/employees

# Create employee
curl -X POST https://hrms-lite-backend.onrender.com/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP002",
    "full_name": "Jane Smith",
    "email": "jane@example.com",
    "department": "HR"
  }'

# Mark attendance
curl -X POST https://hrms-lite-backend.onrender.com/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP002",
    "date": "2024-02-25",
    "status": "Present"
  }'
```

---

## Troubleshooting

### Backend Deployment Issues

**Issue**: Build fails with Python version error
- **Solution**: Ensure Python 3.11+ in `render.yaml`

**Issue**: Database permissions error
- **Solution**: SQLite is file-based and should work automatically; check file permissions

**Issue**: CORS errors in browser console
- **Solution**: Verify CORS configuration in `backend/main.py` includes your frontend URL

### Frontend Deployment Issues

**Issue**: Blank page or 404 errors
- **Solution**: 
  - Verify root directory is `./frontend`
  - Check build command: `npm run build`
  - Ensure output directory is `dist`

**Issue**: API calls fail with 404 or network errors
- **Solution**:
  - Verify `VITE_API_URL` environment variable is set correctly
  - Test API directly: `curl https://your-backend-url/health`
  - Check browser console for actual error messages

**Issue**: Backend URL keeps changing on Render
- **Solution**: Upgrade to paid plan (free tier spins down and may have URL changes)

### Database Issues

**Issue**: "Database is locked" error
- **Solution**: SQLite has concurrency limits; for production, migrate to PostgreSQL on Render

**Issue**: Port already in use
- **Solution**: Render automatically assigns available ports; ensure using `$PORT` environment variable

---

## Production Checklist

- [ ] Backend deployed and health check working (`/health` endpoint)
- [ ] Frontend deployed and loads without errors
- [ ] Environment variables configured correctly:
  - [ ] Backend: DATABASE_URL, PYTHON_VERSION
  - [ ] Frontend: VITE_API_URL
- [ ] CORS configured for production domain
- [ ] Created and marked at least one employee
- [ ] Marked attendance for an employee
- [ ] Tested delete functionality
- [ ] Tested error handling (try invalid email, duplicate ID, etc.)
- [ ] Verified API documentation at `/docs` endpoint
- [ ] Tested filtering in attendance page
- [ ] Verified responsive design on mobile (if needed)

---

## Monitoring & Maintenance

### Render Backend Monitoring

1. Go to https://render.com/dashboard
2. Select your web service
3. View **"Logs"** for any errors
4. Set up **"Alert Rules"** for downtime notifications

### Vercel Frontend Monitoring

1. Go to https://vercel.com/dashboard
2. Select your project
3. View **"Deployments"** history
4. View **"Analytics"** for performance metrics

### Update Deployments

When you make changes:

```bash
# Commit and push to GitHub
git add .
git commit -m "Update feature"
git push origin main
```

Both Render and Vercel will automatically redeploy.

---

## Scaling & Upgrades

### Free Tier Limitations

- **Render Free Tier**: Spins down after 15 minutes of inactivity
- **Vercel Free Tier**: Limited deployments and functions

### Upgrade to Production

1. **Render**:
   - Upgrade to Starter or higher plan for always-on service
   - Migrate database to PostgreSQL

2. **Vercel**:
   - Upgrade to Pro for priority support
   - Use Vercel Functions for serverless backend (optional)

---

## Support & Additional Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

**Deployment Status**: Ready for production ✅

Congratulations! Your HRMS Lite application is now live and accessible to users.
