import uuid
from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional, List

from sqlalchemy import (
    String, Text, Boolean, DateTime, ForeignKey, Integer, Enum as SAEnum, func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pydantic import BaseModel, EmailStr, ConfigDict

from database import Base


# ---------------------------------------------------------------------------
# SQLAlchemy ORM models
# ---------------------------------------------------------------------------

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    clerk_user_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    waitlists: Mapped[List["Waitlist"]] = relationship("Waitlist", back_populates="owner", cascade="all, delete-orphan")
    waitlist_entries: Mapped[List["WaitlistEntry"]] = relationship("WaitlistEntry", back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class WaitlistStatus(str, PyEnum):
    ACTIVE = "active"
    PAUSED = "paused"
    CLOSED = "closed"


class Waitlist(Base):
    __tablename__ = "waitlists"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    status: Mapped[WaitlistStatus] = mapped_column(SAEnum(WaitlistStatus), default=WaitlistStatus.ACTIVE)
    max_capacity: Mapped[Optional[int]] = mapped_column(Integer)
    referral_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    welcome_message: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    owner: Mapped["User"] = relationship("User", back_populates="waitlists")
    entries: Mapped[List["WaitlistEntry"]] = relationship("WaitlistEntry", back_populates="waitlist", cascade="all, delete-orphan")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="waitlist")


class EntryStatus(str, PyEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    INVITED = "invited"


class WaitlistEntry(Base):
    __tablename__ = "waitlist_entries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    waitlist_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("waitlists.id"), nullable=False)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    full_name: Mapped[Optional[str]] = mapped_column(String(255))
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[EntryStatus] = mapped_column(SAEnum(EntryStatus), default=EntryStatus.PENDING)
    referral_code: Mapped[Optional[str]] = mapped_column(String(64), unique=True, index=True)
    referred_by: Mapped[Optional[str]] = mapped_column(String(64))
    referral_count: Mapped[int] = mapped_column(Integer, default=0)
    metadata_json: Mapped[Optional[str]] = mapped_column(Text)
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    waitlist: Mapped["Waitlist"] = relationship("Waitlist", back_populates="entries")
    user: Mapped[Optional["User"]] = relationship("User", back_populates="waitlist_entries")


class NotificationType(str, PyEnum):
    JOINED = "joined"
    APPROVED = "approved"
    REJECTED = "rejected"
    INVITED = "invited"
    POSITION_UPDATE = "position_update"
    CUSTOM = "custom"


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    waitlist_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("waitlists.id"))
    type: Mapped[NotificationType] = mapped_column(SAEnum(NotificationType), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    email_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="notifications")
    waitlist: Mapped[Optional["Waitlist"]] = relationship("Waitlist", back_populates="notifications")


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    email: str
    full_name: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class WaitlistCreate(BaseModel):
    name: str
    description: Optional[str] = None
    slug: str
    max_capacity: Optional[int] = None
    referral_enabled: bool = False
    welcome_message: Optional[str] = None


class WaitlistUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[WaitlistStatus] = None
    max_capacity: Optional[int] = None
    referral_enabled: Optional[bool] = None
    welcome_message: Optional[str] = None


class WaitlistOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    name: str
    description: Optional[str]
    slug: str
    status: WaitlistStatus
    max_capacity: Optional[int]
    referral_enabled: bool
    welcome_message: Optional[str]
    created_at: datetime
    entry_count: Optional[int] = None


class WaitlistEntryCreate(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    referred_by: Optional[str] = None


class WaitlistEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    email: str
    full_name: Optional[str]
    position: int
    status: EntryStatus
    referral_code: Optional[str]
    referral_count: int
    joined_at: datetime


class EntryStatusUpdate(BaseModel):
    status: EntryStatus


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    type: NotificationType
    title: str
    message: str
    is_read: bool
    email_sent: bool
    created_at: datetime
