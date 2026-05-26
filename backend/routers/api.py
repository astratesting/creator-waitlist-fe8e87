import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import (
    WaitlistCreate, WaitlistUpdate, WaitlistOut,
    WaitlistEntryCreate, WaitlistEntryOut, EntryStatusUpdate,
    NotificationOut, NotificationType,
)
from routers.auth import get_current_user
from services.core import (
    create_waitlist,
    get_waitlists_for_owner,
    get_waitlist_by_id,
    get_waitlist_by_slug,
    update_waitlist,
    delete_waitlist,
    get_entry_count,
    join_waitlist,
    get_entries_for_waitlist,
    update_entry_status,
    get_entry_by_id,
    create_notification,
    get_notifications_for_user,
    mark_notification_read,
    mark_all_notifications_read,
)

router = APIRouter(tags=["api"])


# ---------------------------------------------------------------------------
# Waitlists
# ---------------------------------------------------------------------------

@router.post("/waitlists", response_model=WaitlistOut, status_code=status.HTTP_201_CREATED)
async def create_new_waitlist(
    data: WaitlistCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing = await get_waitlist_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=409, detail="Slug already taken")
    waitlist = await create_waitlist(db, current_user.id, data)
    out = WaitlistOut.model_validate(waitlist)
    out.entry_count = 0
    return out


@router.get("/waitlists", response_model=List[WaitlistOut])
async def list_waitlists(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    waitlists = await get_waitlists_for_owner(db, current_user.id)
    result = []
    for w in waitlists:
        out = WaitlistOut.model_validate(w)
        out.entry_count = await get_entry_count(db, w.id)
        result.append(out)
    return result


@router.get("/waitlists/{waitlist_id}", response_model=WaitlistOut)
async def get_waitlist(
    waitlist_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    waitlist = await get_waitlist_by_id(db, waitlist_id)
    if not waitlist or waitlist.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    out = WaitlistOut.model_validate(waitlist)
    out.entry_count = await get_entry_count(db, waitlist.id)
    return out


@router.patch("/waitlists/{waitlist_id}", response_model=WaitlistOut)
async def patch_waitlist(
    waitlist_id: uuid.UUID,
    data: WaitlistUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    waitlist = await get_waitlist_by_id(db, waitlist_id)
    if not waitlist or waitlist.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    waitlist = await update_waitlist(db, waitlist, data)
    out = WaitlistOut.model_validate(waitlist)
    out.entry_count = await get_entry_count(db, waitlist.id)
    return out


@router.delete("/waitlists/{waitlist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_waitlist(
    waitlist_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    waitlist = await get_waitlist_by_id(db, waitlist_id)
    if not waitlist or waitlist.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    await delete_waitlist(db, waitlist)


# ---------------------------------------------------------------------------
# Public: join a waitlist by slug
# ---------------------------------------------------------------------------

@router.post("/waitlists/join/{slug}", response_model=WaitlistEntryOut, status_code=status.HTTP_201_CREATED)
async def public_join_waitlist(
    slug: str,
    data: WaitlistEntryCreate,
    db: AsyncSession = Depends(get_db),
):
    waitlist = await get_waitlist_by_slug(db, slug)
    if not waitlist:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    from models import WaitlistStatus
    if waitlist.status != WaitlistStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Waitlist is not accepting signups")
    try:
        entry = await join_waitlist(db, waitlist, data)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    # Notify owner
    await create_notification(
        db,
        user_id=waitlist.owner_id,
        notification_type=NotificationType.JOINED,
        title="New signup",
        message=f"{data.email} joined your waitlist '{waitlist.name}' (position {entry.position})",
        waitlist_id=waitlist.id,
    )
    return entry


# ---------------------------------------------------------------------------
# Entries management (owner only)
# ---------------------------------------------------------------------------

@router.get("/waitlists/{waitlist_id}/entries", response_model=List[WaitlistEntryOut])
async def list_entries(
    waitlist_id: uuid.UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    waitlist = await get_waitlist_by_id(db, waitlist_id)
    if not waitlist or waitlist.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    return await get_entries_for_waitlist(db, waitlist_id, skip=skip, limit=limit)


@router.patch("/waitlists/{waitlist_id}/entries/{entry_id}", response_model=WaitlistEntryOut)
async def patch_entry_status(
    waitlist_id: uuid.UUID,
    entry_id: uuid.UUID,
    data: EntryStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    waitlist = await get_waitlist_by_id(db, waitlist_id)
    if not waitlist or waitlist.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    entry = await get_entry_by_id(db, entry_id)
    if not entry or entry.waitlist_id != waitlist_id:
        raise HTTPException(status_code=404, detail="Entry not found")
    entry = await update_entry_status(db, entry, data.status)
    return entry


# ---------------------------------------------------------------------------
# Notifications
# ---------------------------------------------------------------------------

@router.get("/notifications", response_model=List[NotificationOut])
async def list_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await get_notifications_for_user(db, current_user.id, skip=skip, limit=limit)


@router.patch("/notifications/{notification_id}/read", response_model=NotificationOut)
async def read_notification(
    notification_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    from sqlalchemy import select
    from models import Notification
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )
    notif = result.scalar_one_or_none()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return await mark_notification_read(db, notif)


@router.post("/notifications/read-all")
async def read_all_notifications(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    count = await mark_all_notifications_read(db, current_user.id)
    return {"marked_read": count}
