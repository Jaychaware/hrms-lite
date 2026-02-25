from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AttendanceCreate(BaseModel):
    employee_id: str
    date: str
    status: str

class AttendanceResponse(BaseModel):
    id: int
    employee_id: str
    date: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
