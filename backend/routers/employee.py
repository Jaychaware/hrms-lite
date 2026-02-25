from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from database import get_db
from models.employee import Employee
from schemas import EmployeeCreate, EmployeeResponse

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.post(
    "",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new employee",
    responses={
        201: {"description": "Employee created successfully"},
        400: {"description": "Invalid input data"},
        409: {"description": "Employee with this ID or email already exists"}
    }
)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """
    Create a new employee record.
    
    - **employee_id**: Unique identifier (must be unique across system)
    - **full_name**: Employee's full name
    - **email**: Valid email address (must be unique)
    - **department**: Department name
    """
    try:
        # Check if employee_id already exists
        existing_emp_id = db.query(Employee).filter(
            Employee.employee_id == employee.employee_id
        ).first()
        if existing_emp_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee with ID '{employee.employee_id}' already exists"
            )

        # Check if email already exists
        existing_email = db.query(Employee).filter(
            Employee.email == employee.email
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Email '{employee.email}' is already registered"
            )

        db_employee = Employee(
            employee_id=employee.employee_id,
            full_name=employee.full_name,
            email=employee.email,
            department=employee.department
        )
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Duplicate employee ID or email"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "",
    response_model=list[EmployeeResponse],
    summary="Get all employees",
    responses={200: {"description": "List of all employees"}}
)
def get_all_employees(db: Session = Depends(get_db)):
    """Retrieve all employee records"""
    employees = db.query(Employee).order_by(Employee.created_at.desc()).all()
    return employees


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse,
    summary="Get employee by ID",
    responses={
        200: {"description": "Employee details"},
        404: {"description": "Employee not found"}
    }
)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve a specific employee by their employee ID"""
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    return employee


@router.delete(
    "/{employee_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an employee",
    responses={
        200: {"description": "Employee deleted successfully"},
        404: {"description": "Employee not found"}
    }
)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    """Delete an employee record by their employee ID"""
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )

    try:
        db.delete(employee)
        db.commit()
        return {
            "success": True,
            "message": f"Employee '{employee_id}' deleted successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error deleting employee: {str(e)}"
        )
