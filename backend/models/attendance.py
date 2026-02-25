from sqlalchemy import Column, Integer, String, Date, ForeignKey, UniqueConstraint, DateTime
from datetime import datetime
from database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False)  # "Present" or "Absent"
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Ensure unique (employee_id, date) constraint
    __table_args__ = (
        UniqueConstraint("employee_id", "date", name="uq_employee_date"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "date": self.date.isoformat(),
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }
