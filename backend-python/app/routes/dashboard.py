from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/dashboard", response_model=schemas.DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    last_session = db.query(models.StudySession).order_by(models.StudySession.created_at.desc()).first()
    ls_data = None
    if last_session:
        correct = len([r for r in last_session.reviews if r.correct])
        wrong = len([r for r in last_session.reviews if not r.correct])
        ls_data = {
            "activity": last_session.activity.name,
            "correct": correct,
            "wrong": wrong,
            "date": str(last_session.created_at)
        }

    total_words = db.query(models.Word).count()
    studied_words = db.query(models.WordReviewItem.word_id).distinct().count()

    total_reviews = db.query(models.WordReviewItem).count()
    correct_reviews = db.query(models.WordReviewItem).filter(models.WordReviewItem.correct == True).count()
    success_rate = int((correct_reviews / total_reviews * 100)) if total_reviews > 0 else 0

    total_sessions = db.query(models.StudySession).count()
    total_groups = db.query(models.Group).count()

    # Streak calculation is complex, return 1 for prototype
    streak = 1

    return {
        "last_session": ls_data,
        "progress": {
            "studied": studied_words,
            "total": total_words
        },
        "stats": {
            "success_rate": success_rate,
            "sessions": total_sessions,
            "groups": total_groups,
            "streak": streak
        }
    }

@router.get("/study_activities", response_model=schemas.StudyActivitiesResponse)
def get_activities(db: Session = Depends(get_db)):
    activities = db.query(models.StudyActivity).all()
    return {"items": activities}

@router.post("/reset_history", response_model=schemas.ResetHistoryResponse)
def reset_history(request: schemas.ResetHistoryRequest, db: Session = Depends(get_db)):
    deleted_sessions = 0
    deleted_reviews = 0

    if request.scope in ["all", "reviews"]:
        deleted_reviews = db.query(models.WordReviewItem).delete()
    if request.scope in ["all", "sessions"]:
        deleted_sessions = db.query(models.StudySession).delete()
    
    db.commit()

    return {
        "message": "History reset successfully",
        "deleted": {
            "study_sessions": deleted_sessions,
            "word_review_items": deleted_reviews
        }
    }
