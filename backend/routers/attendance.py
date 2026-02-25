from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from database import get_db
from models.employee import Employee
from models.attendance import Attendance
from schemas import AttendanceCreate, AttendanceResponse

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post(
    "",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Mark attendance for an employee",
    responses={
        201: {"description": "Attendance marked successfully"},
        400: {"description": "Invalid input data"},
        404: {"description": "Employee not found"},
        409: {"description": "Attendance already marked for this date"}
    }
)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    """
    Mark attendance for an employee.
    
    - **employee_id**: The employee's unique ID
    - **date**: Date in YYYY-MM-DD format
    - **status**: Either 'Present' or 'Absent'
    """
    try:
        # Validate status
        if attendance.status not in ["Present", "Absent"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status must be either 'Present' or 'Absent'"
            )

        # Check if employee exists
        employee = db.query(Employee).filter(
            Employee.employee_id == attendance.employee_id
        ).first()

        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{attendance.employee_id}' not found"
            )

        # Parse date
        try:
            date_obj = datetime.strptime(attendance.date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid date format. Use YYYY-MM-DD"
            )

        # Check if attendance already exists for this date
        existing = db.query(Attendance).filter(
            Attendance.employee_id == attendance.employee_id,
            Attendance.date == date_obj
        ).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Attendance already marked for employee '{attendance.employee_id}' on {attendance.date}"
            )

        db_attendance = Attendance(
            employee_id=attendance.employee_id,
            date=date_obj,
            status=attendance.status
        )
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        
        return {
            "id": db_attendance.id,
            "employee_id": db_attendance.employee_id,
            "date": db_attendance.date.isoformat(),
            "status": db_attendance.status,
            "created_at": db_attendance.created_at
        }

    except HTTPException:
        raise
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Duplicate attendance record for this date"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "/employee/{employee_id}",
    response_model=list[AttendanceResponse],
    summary="Get attendance records for an employee",
    responses={
        200: {"description": "List of attendance records"},
        404: {"description": "Employee not found"}
    }
)
def get_employee_attendance(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve all attendance records for a specific employee"""
    
    # Check if employee exists
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )

    records = db.query(Attendance).filter(
        Attendance.employee_id == employee_id
    ).order_by(Attendance.date.desc()).all()

    return [
        {
            "id": record.id,
            "employee_id": record.employee_id,
            "date": record.date.isoformat(),
            "status": record.status,
            "created_at": record.created_at
        }
        for record in records
    ]


@router.get(
    "",
    response_model=list[AttendanceResponse],
    summary="Get all attendance records",
    responses={200: {"description": "List of all attendance records"}}
)
def get_all_attendance(db: Session = Depends(get_db)):
    """Retrieve all attendance records"""
    records = db.query(Attendance).order_by(Attendance.date.desc()).all()
    return [
        {
            "id": record.id,
            "employee_id": record.employee_id,
            "date": record.date.isoformat(),
            "status": record.status,
            "created_at": record.created_at
        }
        for record in records
    ]
