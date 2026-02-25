from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.employee import Employee
from schemas import EmployeeCreate, EmployeeResponse

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("", response_model=EmployeeResponse, status_code=201)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    if db.query(Employee).filter(Employee.employee_id == employee.employee_id).first():
        raise HTTPException(status_code=409, detail="Employee ID already exists")
    
    if db.query(Employee).filter(Employee.email == employee.email).first():
        raise HTTPException(status_code=409, detail="Email already exists")
    
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


@router.get("", response_model=list[EmployeeResponse])
def get_all_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp


@router.delete("/{employee_id}")
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(emp)
    db.commit()
    return {"message": "Deleted"}
