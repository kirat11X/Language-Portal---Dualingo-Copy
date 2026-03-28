from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("", response_model=schemas.PaginatedResponse)
def get_words(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    sort_by: str = Query("gurmukhi"),
    order: str = Query("asc"),
    db: Session = Depends(get_db)
):
    c_count = func.count(models.WordReviewItem.id).filter(models.WordReviewItem.correct == True).label('correct_count')
    w_count = func.count(models.WordReviewItem.id).filter(models.WordReviewItem.correct == False).label('wrong_count')
    
    query = db.query(
        models.Word,
        c_count,
        w_count
    ).outerjoin(models.WordReviewItem).group_by(models.Word.id)

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

    total_items = db.query(models.Word).count()
    total_pages = (total_items + per_page - 1) // per_page
    
    words = query.offset((page - 1) * per_page).limit(per_page).all()

    items = []
    for w, cc, wc in words:
        items.append({
            "id": w.id,
            "gurmukhi": w.gurmukhi,
            "romanized": w.romanized,
            "english": w.english,
            "correct_count": cc or 0,
            "wrong_count": wc or 0
        })

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

@router.get("/{word_id}", response_model=schemas.WordDetailResponse)
def get_word(word_id: int, db: Session = Depends(get_db)):
    c_count = func.count(models.WordReviewItem.id).filter(models.WordReviewItem.correct == True).label('correct_count')
    w_count = func.count(models.WordReviewItem.id).filter(models.WordReviewItem.correct == False).label('wrong_count')

    result = db.query(
        models.Word,
        c_count,
        w_count
    ).outerjoin(models.WordReviewItem).filter(models.Word.id == word_id).group_by(models.Word.id).first()

    if not result:
        raise HTTPException(status_code=404, detail=f"Word with id {word_id} not found")

    w, cc, wc = result
    
    groups = [{"id": g.id, "name": g.name} for g in w.groups]

    return {
        "id": w.id,
        "gurmukhi": w.gurmukhi,
        "romanized": w.romanized,
        "english": w.english,
        "correct_count": cc or 0,
        "wrong_count": wc or 0,
        "parts": w.parts,
        "groups": groups
    }
