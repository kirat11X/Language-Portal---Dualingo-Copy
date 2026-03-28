from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/study_sessions")

@router.post("", response_model=schemas.StudySessionCreated, status_code=201)
def create_session(session: schemas.StudySessionCreate, db: Session = Depends(get_db)):
    group = db.query(models.Group).filter(models.Group.id == session.group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    activity = db.query(models.StudyActivity).filter(models.StudyActivity.id == session.study_activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    db_session = models.StudySession(
        group_id=session.group_id,
        study_activity_id=session.study_activity_id
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("", response_model=schemas.StudySessionsResponse)
def get_sessions(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(models.StudySession).order_by(models.StudySession.created_at.desc())
    total_items = query.count()
    total_pages = (total_items + per_page - 1) // per_page
    sessions = query.offset((page - 1) * per_page).limit(per_page).all()

    items = []
    for s in sessions:
        items.append({
            "id": s.id,
            "group_id": s.group_id,
            "group_name": s.group.name,
            "study_activity_id": s.study_activity_id,
            "study_activity_name": s.activity.name,
            "created_at": s.created_at,
            "review_items_count": len(s.reviews),
            "correct_count": len([r for r in s.reviews if r.correct]),
            "wrong_count": len([r for r in s.reviews if not r.correct])
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

@router.get("/{session_id}", response_model=schemas.StudySessionDetailResponse)
def get_session(session_id: int, db: Session = Depends(get_db)):
    s = db.query(models.StudySession).filter(models.StudySession.id == session_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")

    return {
        "session": {
            "id": s.id,
            "group_id": s.group_id,
            "group_name": s.group.name,
            "study_activity_id": s.study_activity_id,
            "study_activity_name": s.activity.name,
            "created_at": s.created_at,
            "review_items_count": len(s.reviews),
            "correct_count": len([r for r in s.reviews if r.correct]),
            "wrong_count": len([r for r in s.reviews if not r.correct])
        },
        "review_items": [{
            "id": r.id,
            "word_id": r.word_id,
            "gurmukhi": r.word.gurmukhi,
            "romanized": r.word.romanized,
            "english": r.word.english,
            "correct": r.correct,
            "created_at": r.created_at
        } for r in s.reviews]
    }

@router.post("/{session_id}/review", response_model=schemas.WordReviewResponse, status_code=201)
def review_word(session_id: int, review: schemas.WordReviewCreate, db: Session = Depends(get_db)):
    s = db.query(models.StudySession).filter(models.StudySession.id == session_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
        
    w = db.query(models.Word).filter(models.Word.id == review.word_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Word not found")

    r = models.WordReviewItem(
        word_id=review.word_id,
        study_session_id=session_id,
        correct=review.correct
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    
    # Calculate word stats
    correct_count = db.query(models.WordReviewItem).filter(
        models.WordReviewItem.word_id == review.word_id, 
        models.WordReviewItem.correct == True
    ).count()
    wrong_count = db.query(models.WordReviewItem).filter(
        models.WordReviewItem.word_id == review.word_id, 
        models.WordReviewItem.correct == False
    ).count()

    return {
        "id": r.id,
        "study_session_id": r.study_session_id,
        "word_id": r.word_id,
        "correct": r.correct,
        "created_at": r.created_at,
        "word_stats": {
            "correct_count": correct_count,
            "wrong_count": wrong_count
        }
    }
