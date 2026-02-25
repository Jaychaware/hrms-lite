# HRMS Lite - Quick Start Guide

Get HRMS Lite running locally in minutes.

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

## Setup (3 minutes)

### 1. Clone/Download Repository

```bash
git clone <repository-url>
cd hrms-lite
```

### 2. Start Backend (Terminal 1)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs on http://localhost:8000

### 3. Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## Usage

1. Open http://localhost:5173 in your browser
2. **Employees Tab**: Add, view, and delete employees
3. **Attendance Tab**: Mark attendance and view records
4. **API Docs**: http://localhost:8000/docs

## Key Files

```
backend/
  ├── main.py           # FastAPI app
  ├── database.py       # DB setup
  ├── models/           # Data models
  ├── schemas/          # Validation
  └── routers/          # API endpoints

frontend/
  ├── src/App.jsx       # Main component
  ├── src/api.js        # API client
  └── src/components/   # React components
```

## Features

✅ Add/View/Delete Employees
✅ Mark Daily Attendance
✅ Filter Attendance Records
✅ Form Validation
✅ Error Handling
✅ Professional UI

## Next Steps

- Deploy to production: See [DEPLOYMENT.md](DEPLOYMENT.md)
- Read API docs: [README.md](README.md)
- Explore code: Check component structure
