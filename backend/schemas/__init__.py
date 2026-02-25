from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class EmployeeCreate(BaseModel):
    """Schema for creating an employee"""
    employee_id: str = Field(..., min_length=1, max_length=50, description="Unique employee ID")
    full_name: str = Field(..., min_length=1, max_length=255, description="Full name of the employee")
    email: EmailStr = Field(..., description="Valid email address")
    department: str = Field(..., min_length=1, max_length=100, description="Department name")

    class Config:
        json_schema_extra = {
            "example": {
                "employee_id": "EMP001",
                "full_name": "John Doe",
                "email": "john@example.com",
                "department": "Engineering"
            }
        }


class EmployeeResponse(BaseModel):
    """Schema for employee response"""
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime

    class Config:
        from_attributes = True


class AttendanceCreate(BaseModel):
    """Schema for creating attendance record"""
    employee_id: str = Field(..., description="Employee ID")
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    status: str = Field(..., description="Status: 'Present' or 'Absent'")

    def validate_status(self):
        if self.status not in ["Present", "Absent"]:
            raise ValueError("Status must be either 'Present' or 'Absent'")
        return True

    class Config:
        json_schema_extra = {
            "example": {
                "employee_id": "EMP001",
                "date": "2024-01-15",
                "status": "Present"
            }
        }


class AttendanceResponse(BaseModel):
    """Schema for attendance response"""
    id: int
    employee_id: str
    date: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
