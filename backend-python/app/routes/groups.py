from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("", response_model=schemas.PaginatedResponse)
def get_groups(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    sort_by: str = Query("name"),
    order: str = Query("asc"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Group)
    sort_col = getattr(models.Group, sort_by, models.Group.name)
    if order == "desc":
        query = query.order_by(sort_col.desc())
    else:
        query = query.order_by(sort_col.asc())

    total_items = db.query(models.Group).count()
    total_pages = (total_items + per_page - 1) // per_page
    groups = query.offset((page - 1) * per_page).limit(per_page).all()

    items = [{"id": g.id, "name": g.name, "words_count": g.words_count} for g in groups]

    return {
        "items": items,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total_items": total_items,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }

@router.get("/{group_id}", response_model=schemas.GroupDetailResponse)
def get_group(
    group_id: int, 
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    sort_by: str = Query("gurmukhi"),
    order: str = Query("asc"),
    db: Session = Depends(get_db)
):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    c_count = func.count(models.WordReviewItem.id).filter(models.WordReviewItem.correct == True).label('correct_count')
    w_count = func.count(models.WordReviewItem.id).filter(models.WordReviewItem.correct == False).label('wrong_count')

    query = db.query(
        models.Word,
        c_count,
        w_count
    ).join(models.WordGroup).outerjoin(models.WordReviewItem).filter(models.WordGroup.group_id == group_id).group_by(models.Word.id)

    # Sort
    if sort_by == 'correct_count':
        sort_column = c_count
    elif sort_by == 'wrong_count':
        sort_column = w_count
    else:
        sort_column = getattr(models.Word, sort_by, models.Word.gurmukhi)
        
    if order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    total_items = query.count()
    total_pages = (total_items + per_page - 1) // per_page
    words = query.offset((page - 1) * per_page).limit(per_page).all()

    items = [{
        "id": w.id,
        "gurmukhi": w.gurmukhi,
        "romanized": w.romanized,
        "english": w.english,
        "correct_count": cc or 0,
        "wrong_count": wc or 0
    } for w, cc, wc in words]

    return {
        "group": {"id": group.id, "name": group.name, "words_count": group.words_count},
        "items": items,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total_items": total_items,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }
