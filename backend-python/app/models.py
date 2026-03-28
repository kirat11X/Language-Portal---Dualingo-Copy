from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Word(Base):
    __tablename__ = "words"
    id = Column(Integer, primary_key=True, index=True)
    gurmukhi = Column(String, nullable=False)
    romanized = Column(String, nullable=False)
    english = Column(String, nullable=False)
    parts = Column(JSON, nullable=False)

    groups = relationship("Group", secondary="word_groups", back_populates="words")
    reviews = relationship("WordReviewItem", back_populates="word", cascade="all, delete-orphan")

class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    words_count = Column(Integer, default=0)

    words = relationship("Word", secondary="word_groups", back_populates="groups")
    sessions = relationship("StudySession", back_populates="group", cascade="all, delete-orphan")

class WordGroup(Base):
    __tablename__ = "word_groups"
    word_id = Column(Integer, ForeignKey("words.id", ondelete="CASCADE"), primary_key=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"), primary_key=True)

class StudyActivity(Base):
    __tablename__ = "study_activities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)

    sessions = relationship("StudySession", back_populates="activity")

class StudySession(Base):
    __tablename__ = "study_sessions"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"), nullable=False)
    study_activity_id = Column(Integer, ForeignKey("study_activities.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    group = relationship("Group", back_populates="sessions")
    activity = relationship("StudyActivity", back_populates="sessions")
    reviews = relationship("WordReviewItem", back_populates="session", cascade="all, delete-orphan")

class WordReviewItem(Base):
    __tablename__ = "word_review_items"
    id = Column(Integer, primary_key=True, index=True)
    word_id = Column(Integer, ForeignKey("words.id", ondelete="CASCADE"), nullable=False)
    study_session_id = Column(Integer, ForeignKey("study_sessions.id", ondelete="CASCADE"), nullable=False)
    correct = Column(Boolean, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    word = relationship("Word", back_populates="reviews")
    session = relationship("StudySession", back_populates="reviews")
