import uuid
import secrets
import os
from datetime import datetime, timedelta, timezone
from typing import Optional, List

from jose import jwt
from passlib.context import CryptContext
from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from models import (
    User, Waitlist, WaitlistEntry, Notification,
    WaitlistStatus, EntryStatus, NotificationType,
    UserCreate, WaitlistCreate, WaitlistUpdate, WaitlistEntryCreate,
)

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return jwt.encode({"sub": subject, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except Exception:
        return None


# ---------------------------------------------------------------------------
# User services
# ---------------------------------------------------------------------------

async def create_user(db: AsyncSession, data: UserCreate) -> User:
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    db.add(user)
    await db.flush()
    return user


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
    user = await get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


# ---------------------------------------------------------------------------
# Waitlist services
# ---------------------------------------------------------------------------

async def create_waitlist(db: AsyncSession, owner_id: uuid.UUID, data: WaitlistCreate) -> Waitlist:
    waitlist = Waitlist(
        owner_id=owner_id,
        name=data.name,
        description=data.description,
        slug=data.slug,
        max_capacity=data.max_capacity,
        referral_enabled=data.referral_enabled,
        welcome_message=data.welcome_message,
    )
    db.add(waitlist)
    await db.flush()
    return waitlist


async def get_waitlists_for_owner(db: AsyncSession, owner_id: uuid.UUID) -> List[Waitlist]:
    result = await db.execute(
        select(Waitlist).where(Waitlist.owner_id == owner_id).order_by(Waitlist.created_at.desc())
    )
    return list(result.scalars().all())


async def get_waitlist_by_id(db: AsyncSession, waitlist_id: uuid.UUID) -> Optional[Waitlist]:
    result = await db.execute(select(Waitlist).where(Waitlist.id == waitlist_id))
    return result.scalar_one_or_none()


async def get_waitlist_by_slug(db: AsyncSession, slug: str) -> Optional[Waitlist]:
    result = await db.execute(select(Waitlist).where(Waitlist.slug == slug))
    return result.scalar_one_or_none()


async def update_waitlist(db: AsyncSession, waitlist: Waitlist, data: WaitlistUpdate) -> Waitlist:
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(waitlist, field, value)
    db.add(waitlist)
    await db.flush()
    return waitlist


async def delete_waitlist(db: AsyncSession, waitlist: Waitlist) -> None:
    await db.delete(waitlist)
    await db.flush()


async def get_entry_count(db: AsyncSession, waitlist_id: uuid.UUID) -> int:
    result = await db.execute(
        select(func.count()).where(WaitlistEntry.waitlist_id == waitlist_id)
    )
    return result.scalar_one()


# ---------------------------------------------------------------------------
# Entry services
# ---------------------------------------------------------------------------

async def join_waitlist(db: AsyncSession, waitlist: Waitlist, data: WaitlistEntryCreate) -> WaitlistEntry:
    # Check duplicate
    existing = await db.execute(
        select(WaitlistEntry).where(
            WaitlistEntry.waitlist_id == waitlist.id,
            WaitlistEntry.email == data.email,
        )
    )
    if existing.scalar_one_or_none():
        raise ValueError("Email already on this waitlist")

    # Check capacity
    if waitlist.max_capacity:
        count = await get_entry_count(db, waitlist.id)
        if count >= waitlist.max_capacity:
            raise ValueError("Waitlist is at full capacity")

    position_result = await db.execute(
        select(func.coalesce(func.max(WaitlistEntry.position), 0)).where(
            WaitlistEntry.waitlist_id == waitlist.id
        )
    )
    next_position = position_result.scalar_one() + 1

    referral_code = secrets.token_urlsafe(8) if waitlist.referral_enabled else None

    # Credit referrer
    if data.referred_by and waitlist.referral_enabled:
        await db.execute(
            update(WaitlistEntry)
            .where(WaitlistEntry.referral_code == data.referred_by)
            .values(referral_count=WaitlistEntry.referral_count + 1)
        )

    entry = WaitlistEntry(
        waitlist_id=waitlist.id,
        email=data.email,
        full_name=data.full_name,
        position=next_position,
        referral_code=referral_code,
        referred_by=data.referred_by,
    )
    db.add(entry)
    await db.flush()
    return entry


async def get_entries_for_waitlist(
    db: AsyncSession, waitlist_id: uuid.UUID, skip: int = 0, limit: int = 50
) -> List[WaitlistEntry]:
    result = await db.execute(
        select(WaitlistEntry)
        .where(WaitlistEntry.waitlist_id == waitlist_id)
        .order_by(WaitlistEntry.position)
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


async def update_entry_status(
    db: AsyncSession, entry: WaitlistEntry, status: EntryStatus
) -> WaitlistEntry:
    entry.status = status
    db.add(entry)
    await db.flush()
    return entry


async def get_entry_by_id(db: AsyncSession, entry_id: uuid.UUID) -> Optional[WaitlistEntry]:
    result = await db.execute(select(WaitlistEntry).where(WaitlistEntry.id == entry_id))
    return result.scalar_one_or_none()


# ---------------------------------------------------------------------------
# Notification services
# ---------------------------------------------------------------------------

async def create_notification(
    db: AsyncSession,
    user_id: uuid.UUID,
    notification_type: NotificationType,
    title: str,
    message: str,
    waitlist_id: Optional[uuid.UUID] = None,
) -> Notification:
    notif = Notification(
        user_id=user_id,
        waitlist_id=waitlist_id,
        type=notification_type,
        title=title,
        message=message,
    )
    db.add(notif)
    await db.flush()
    return notif


async def get_notifications_for_user(
    db: AsyncSession, user_id: uuid.UUID, skip: int = 0, limit: int = 50
) -> List[Notification]:
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


async def mark_notification_read(db: AsyncSession, notification: Notification) -> Notification:
    notification.is_read = True
    db.add(notification)
    await db.flush()
    return notification


async def mark_all_notifications_read(db: AsyncSession, user_id: uuid.UUID) -> int:
    result = await db.execute(
        update(Notification)
        .where(Notification.user_id == user_id, Notification.is_read.is_(False))
        .values(is_read=True)
        .returning(Notification.id)
    )
    rows = result.all()
    return len(rows)
