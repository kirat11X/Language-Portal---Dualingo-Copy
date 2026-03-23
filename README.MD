# 🧠 Punjabi LangPortal — Fullstack Technical Specification

---

## 📌 Business Goal

A language learning school wants to build a prototype portal that acts as:

1. 📚 Vocabulary Inventory (Punjabi words in Gurmukhi)
2. 📊 Learning Record Store (tracks correct/wrong attempts)
3. 🚀 Launchpad for multiple learning apps (Flashcards, Typing Tutor, Quiz)

---

## 🏗️ System Architecture

```
Frontend (React + Vite + TS)
        ↓
REST API (FastAPI)
        ↓
SQLite3 Database
```

---

## ⚙️ Technical Stack

### Frontend

* TypeScript
* React (Vite)
* Tailwind CSS
* ShadCN UI
* React Router
* React Query (API caching)

### Backend 

* Python
* FastAPI
* SQLite3
* JSON responses only
* No authentication (single user system)

---

## 🧭 App Navigation (Frontend)

* Dashboard
* Study Activities
* Words
* Word Groups
* Sessions
* Settings

---

## 🗄️ Database Schema (Frontend Awareness Required)

Frontend MUST align with backend schema:

### 🟩 words

* id
* gurmukhi
* romanized
* english
* parts (JSON)

### 🟦 groups

* id
* name
* words_count

### 🟨 word_groups

* word_id
* group_id

### 🟪 study_activities

* id
* name
* url

### 🟥 study_sessions

* id
* group_id
* study_activity_id
* created_at

### 🟫 word_review_items

* id
* word_id
* study_session_id
* correct
* created_at

---

## 🔗 Relationships (IMPORTANT for UI Logic)

* Word ↔ Groups (many-to-many)
* Session → Group
* Session → Study Activity
* Session → Word Reviews
* Word Review → Word

👉 Frontend must JOIN data from multiple endpoints logically

---

## 🌐 API Contract (Backend ↔ Frontend)

---

## 🔤 WORDS API

### GET /words

Used in:

* Words Page
* Group Detail Page

**Query Params:**

* page (default: 1)
* sort_by ('kanji' → use 'gurmukhi', 'romanized', 'english', 'correct_count', 'wrong_count')
* order ('asc', 'desc')

**Response:**

```json
[
  {
    "id": 1,
    "gurmukhi": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    "romanized": "sat sri akaal",
    "english": "hello",
    "correct_count": 3,
    "wrong_count": 1
  }
]
```

---

## 📚 GROUPS API

### GET /groups

Used in:

* Word Groups Page
* Dropdown in Study Activity

---

### GET /groups/:id

Used in:

* Group Detail Page
* Study Activity Launch

**Query Params:**

* page
* sort_by ('name', 'words_count')
* order

---

## 🎯 STUDY SESSION APIs

### POST /study_sessions

Used when:

* User clicks "Launch"

```json
{
  "group_id": 2,
  "study_activity_id": 1
}
```

---

### POST /study_sessions/:id/review

Used during:

* Quiz / Typing Tutor

```json
{
  "word_id": 5,
  "correct": true
}
```

---

### GET /study-sessions

Used in:

* Sessions Page

---

### GET /study-sessions/:id

Used in:

* Session Detail Page

---

## 📊 FRONTEND PAGES (Mapped to Backend)

---

## 🏠 Dashboard

### Data Sources:

* Aggregated from:

  * study_sessions
  * word_review_items
  * words

### UI:

* Last Session
* Progress Bar
* Stats (success rate, streak)

---

## 🧩 Study Activities

### Backend Mapping:

* GET /study-activities
* POST /study_sessions

### UI Flow:

1. Select Group
2. Launch Activity
3. Create Session

---

## 🔤 Words Page

### Backend Mapping:

* GET /words

### UI:

* Table with:

  * Gurmukhi
  * Romanized
  * English
  * Correct / Wrong

---

## 📖 Word Detail

### Backend:

* GET /words/:id

### UI:

* Large Gurmukhi text
* Stats
* Group tags

---

## 📚 Word Groups

### Backend:

* GET /groups

### UI:

* Group name
* Word count

---

## 📂 Group Detail

### Backend:

* GET /groups/:id

### UI:

* Words in group
* Performance stats

---

## 🕒 Study Sessions

### Backend:

* GET /study-sessions

### UI:

* Table of sessions

---

## 🔍 Study Session Detail

### Backend:

* GET /study-sessions/:id

### UI:

* Words reviewed
* Correct / Wrong

---

## ⚙️ Settings

### UI:

* Theme toggle
* Reset history

---

## 🔁 Complete Data Flow

1. User opens Dashboard
2. Selects Study Activity
3. Selects Group
4. → POST /study_sessions
5. Words fetched via /groups/:id
6. User answers:
   → POST /study_sessions/:id/review
7. Dashboard updates

---

## 🧠 Frontend State Design

* activeSessionId
* selectedGroupId
* wordsCache
* reviewProgress

---

## ⚡ Optimization Strategy

* React Query caching for:

  * words
  * groups
* Pagination support
* Lazy loading tables
* Debounced filters

---

## 🚀 Future Enhancements (Fullstack)

### Backend 

* audio_url (pronunciation)
* difficulty levels
* spaced repetition (next_review_at)

### Frontend

* Audio playback
* Speech input (Punjabi)
* Gamification (XP, streaks)
* AI difficulty adaptation

---

## 🎯 Final System Summary

Punjabi LangPortal is a:

* 📚 Vocabulary database
* 📊 Learning analytics engine
* 🎮 Multi-activity learning platform

Built using:

* FastAPI + SQLite backend
* React + Tailwind frontend

---

## 🏆 Hackathon Positioning

> “A Punjabi-first adaptive language learning system with Gurmukhi support, performance tracking, and modular AI-powered learning activities.”

---
