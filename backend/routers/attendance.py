from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models.employee import Employee
from models.attendance import Attendance
from schemas import AttendanceCreate, AttendanceResponse

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("", status_code=201)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    if attendance.status not in ["Present", "Absent"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    emp = db.query(Employee).filter(Employee.employee_id == attendance.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    try:
        date_obj = datetime.strptime(attendance.date, "%Y-%m-%d").date()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    existing = db.query(Attendance).filter(
        Attendance.employee_id == attendance.employee_id,
        Attendance.date == date_obj
    ).first()
    
    if existing:
        raise HTTPException(status_code=409, detail="Already marked for this date")
    
    rec = Attendance(
        employee_id=attendance.employee_id,
        date=date_obj,
        status=attendance.status
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {
        "id": rec.id,
        "employee_id": rec.employee_id,
        "date": rec.date.isoformat(),
        "status": rec.status,
        "created_at": rec.created_at
    }



@router.get("/employee/{employee_id}")
def get_employee_attendance(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    records = db.query(Attendance).filter(Attendance.employee_id == employee_id).all()
    return [
        {
            "id": r.id,
            "employee_id": r.employee_id,
            "date": r.date.isoformat(),
            "status": r.status,
            "created_at": r.created_at
        }
        for r in records
    ]



@router.get("")
def get_all_attendance(db: Session = Depends(get_db)):
    records = db.query(Attendance).all()
    return [
        {
            "id": r.id,
            "employee_id": r.employee_id,
            "date": r.date.isoformat(),
            "status": r.status,
            "created_at": r.created_at
        }
        for r in records
    ]
