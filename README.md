# HRMS Lite – Human Resource Management System

A lightweight, production-ready HR management system built using FastAPI and React.  
This application enables administrators to manage employee records and track attendance through a clean and intuitive interface.

---

## 🎯 Project Overview

HRMS Lite is a full-stack web application designed to handle core HR operations:

- Manage employee records (Add, View, Delete)
- Track daily attendance (Present / Absent)
- View attendance history with filtering
- Prevent duplicate attendance entries
- Validate data at both frontend and backend

The system focuses on essential HR functionality while maintaining clean architecture and professional UI standards.

---

## 🏗 Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: CSS Modules

### DevOps
- **Containerization**: Docker
- **Backend Deployment**: Render
- **Frontend Deployment**: Vercel

---

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   ├── models/
│   ├── schemas/
│   └── routers/
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── components/
│   │   ├── api.js
│   │   └── App.jsx
│
├── docker-compose.yml
└── README.md
```

---

## ✨ Features

### Employee Management
- Add employee with validation
- View employee list
- Delete employee
- Unique Employee ID & Email enforcement
- Timestamp tracking

### Attendance Management
- Mark attendance (Present / Absent)
- Prevent duplicate attendance for same date
- Filter attendance by employee
- View complete attendance history

### UI & UX
- Clean and responsive interface
- Loading states
- Empty states
- Error handling with clear messages
- Form validation feedback
- Confirmation before delete

---

## 🔒 Data Validation

### Employee
- Employee ID: Required, unique
- Email: Required, valid format, unique
- Full Name & Department: Required

### Attendance
- Employee must exist
- One record per employee per date
- Status must be Present or Absent

---

## 📋 Database Schema

### Employees Table

```sql
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  department VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Attendance Table

```sql
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, date)
);
```

---

# 🚀 Local Setup

## Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:
```
http://localhost:8000
```

Swagger Docs:
```
http://localhost:8000/docs
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

# 🐳 Docker Setup

## Run Backend

```bash
cd backend
docker build -t hrms-backend .
docker run -p 8000:8000 hrms-backend
```

## Run Frontend

```bash
cd frontend
docker build -t hrms-frontend .
docker run -p 5173:5173 hrms-frontend
```

## Run Using Docker Compose

```bash
docker-compose up --build
```

---

# 🌐 Deployment

### Backend
- Hosted on Render
- Connected to PostgreSQL (Render Database)

### Frontend
- Hosted on Vercel
- Connected to live backend via environment variable:

```
VITE_API_URL=https://your-backend-url
```

---

# 🧪 Testing Flow

1. Add employees
2. Mark attendance
3. Try duplicate employee ID (should fail)
4. Try duplicate attendance for same date (should fail)
5. Delete employee
6. Verify error handling works correctly

---

# 📝 Assumptions

- Single admin user
- No authentication required
- Only Present / Absent status supported
- No payroll or leave management

---

# 🚧 Future Improvements

- Authentication & role-based access
- Leave management
- Reporting dashboard
- Export to CSV
- Pagination
- Real-time analytics

---

# ✅ Production Readiness

- Modular backend architecture
- Proper HTTP status codes
- Database integrity constraints
- Clean React component structure
- Docker support
- Deployed frontend & backend
- PostgreSQL for persistent storage

---