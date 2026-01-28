from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    position: str
    department: str
    is_active: Optional[bool] = True

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int

    class Config:
        orm_mode = True

class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    status: str

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int

    class Config:
        orm_mode = True
