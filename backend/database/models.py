import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer, Text, JSON
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

def get_utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(80), default="Chief Executive Officer", nullable=False)
    company_name = Column(String(120), default="Enterprise Global Corp", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    salt = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role,
            "company_name": self.company_name,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now, nullable=False)

class ReportArchive(Base):
    __tablename__ = "report_archives"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    report_type = Column(String(50), nullable=False)
    title = Column(String(200), nullable=False)
    record_count = Column(Integer, default=0)
    generated_by = Column(String(100), default="System AI Engine")
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
