from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class PaginationResponse(BaseModel):
    page: int
    per_page: int
    total_items: int
    total_pages: int
    has_next: bool
    has_prev: bool

class PaginatedResponse(BaseModel):
    items: List[Any]
    pagination: PaginationResponse

class WordBase(BaseModel):
    id: int
    gurmukhi: str
    romanized: str
    english: str
    correct_count: int
    wrong_count: int

class WordDetailGroup(BaseModel):
    id: int
    name: str

class WordDetailResponse(WordBase):
    parts: dict
    groups: List[WordDetailGroup]

class GroupBase(BaseModel):
    id: int
    name: str
    words_count: int

class GroupDetailResponse(BaseModel):
    group: GroupBase
    items: List[WordBase]
    pagination: PaginationResponse

class LastSession(BaseModel):
    activity: str
    correct: int
    wrong: int
    date: str

class DashboardProgress(BaseModel):
    studied: int
    total: int

class DashboardStats(BaseModel):
    success_rate: int
    sessions: int
    groups: int
    streak: int

class DashboardResponse(BaseModel):
    last_session: Optional[LastSession]
    progress: DashboardProgress
    stats: DashboardStats

class StudyActivityBase(BaseModel):
    id: int
    name: str
    url: str

class StudyActivitiesResponse(BaseModel):
    items: List[StudyActivityBase]

class StudySessionCreate(BaseModel):
    group_id: int
    study_activity_id: int

class StudySessionCreated(BaseModel):
    id: int
    group_id: int
    study_activity_id: int
    created_at: datetime

class StudySessionBase(BaseModel):
    id: int
    group_id: int
    group_name: str
    study_activity_id: int
    study_activity_name: str
    created_at: datetime
    review_items_count: int
    correct_count: int
    wrong_count: int

class StudySessionsResponse(BaseModel):
    items: List[StudySessionBase]
    pagination: PaginationResponse

class WordReviewCreate(BaseModel):
    word_id: int
    correct: bool

class WordReviewResponse(BaseModel):
    id: int
    study_session_id: int
    word_id: int
    correct: bool
    created_at: datetime
    word_stats: dict

class ReviewItemDetail(BaseModel):
    id: int
    word_id: int
    gurmukhi: str
    romanized: str
    english: str
    correct: bool
    created_at: datetime

class StudySessionDetailResponse(BaseModel):
    session: StudySessionBase
    review_items: List[ReviewItemDetail]

class ResetHistoryRequest(BaseModel):
    scope: str

class ResetHistoryResponse(BaseModel):
    message: str
    deleted: dict
