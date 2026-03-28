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
* per_page (default: 50, max: 100)
* sort_by ('gurmukhi', 'romanized', 'english', 'correct_count', 'wrong_count')
* order ('asc', 'desc')

**Response:**

```json
{
  "items": [
    {
      "id": 1,
      "gurmukhi": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
      "romanized": "sat sri akaal",
      "english": "hello",
      "correct_count": 3,
      "wrong_count": 1
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total_items": 124,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

### GET /words/:id

Used in:

* Word Detail Page

**Response:**

```json
{
  "id": 1,
  "gurmukhi": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
  "romanized": "sat sri akaal",
  "english": "hello",
  "parts": {
    "type": "phrase",
    "difficulty": "beginner"
  },
  "correct_count": 3,
  "wrong_count": 1,
  "groups": [
    {
      "id": 1,
      "name": "Greetings"
    }
  ]
}
```

---

## 📚 GROUPS API

### GET /groups

Used in:

* Word Groups Page
* Dropdown in Study Activity

**Response:**

```json
{
  "items": [
    {
      "id": 1,
      "name": "Greetings",
      "words_count": 25
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total_items": 12,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

---

### GET /groups/:id

Used in:

* Group Detail Page
* Study Activity Launch

**Query Params:**

* page
* per_page (default: 50, max: 100)
* sort_by ('gurmukhi', 'romanized', 'english', 'correct_count', 'wrong_count')
* order

**Response:**

```json
{
  "group": {
    "id": 1,
    "name": "Greetings",
    "words_count": 25
  },
  "items": [
    {
      "id": 1,
      "gurmukhi": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
      "romanized": "sat sri akaal",
      "english": "hello",
      "correct_count": 3,
      "wrong_count": 1
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total_items": 25,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

---

## 🎯 STUDY SESSION APIs

### GET /dashboard

Used in:

* Dashboard page

**Response:**

```json
{
  "last_session": {
    "activity": "Typing Tutor",
    "correct": 4,
    "wrong": 1,
    "date": "2025-02-08"
  },
  "progress": {
    "studied": 3,
    "total": 124
  },
  "stats": {
    "success_rate": 80,
    "sessions": 1,
    "groups": 1,
    "streak": 1
  }
}
```

Derived Logic:

* `progress.studied` = number of unique words reviewed at least once
* `progress.total` = total words in database
* `stats.success_rate` = `(total_correct_reviews / total_reviews) * 100`
* `stats.streak` = consecutive days with at least one study session
* all dashboard metrics are computed over the entire dataset (all-time)

### GET /study_activities

Used in:

* Study Activities page

**Response:**

```json
{
  "items": [
    {
      "id": 1,
      "name": "Typing Tutor",
      "url": "/activities/typing-tutor"
    }
  ]
}
```

Study activities are pre-seeded and read-only.

### POST /study_sessions

Used when:

* User clicks "Launch"

```json
{
  "group_id": 2,
  "study_activity_id": 1
}
```

**Response:**

```json
{
  "id": 10,
  "group_id": 2,
  "study_activity_id": 1,
  "created_at": "2026-03-23T12:00:00"
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

**Response:**

```json
{
  "id": 101,
  "study_session_id": 10,
  "word_id": 5,
  "correct": true,
  "created_at": "2026-03-23T12:10:00",
  "word_stats": {
    "correct_count": 8,
    "wrong_count": 2
  }
}
```

---

### GET /study_sessions

Used in:

* Sessions Page

**Response:**

```json
{
  "items": [
    {
      "id": 10,
      "group_id": 2,
      "group_name": "Greetings",
      "study_activity_id": 1,
      "study_activity_name": "Typing Tutor",
      "created_at": "2026-03-23T12:00:00",
      "review_items_count": 15,
      "correct_count": 11,
      "wrong_count": 4
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total_items": 8,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

---

### GET /study_sessions/:id

Used in:

* Session Detail Page

**Response:**

```json
{
  "session": {
    "id": 10,
    "group_id": 2,
    "group_name": "Greetings",
    "study_activity_id": 1,
    "study_activity_name": "Typing Tutor",
    "created_at": "2026-03-23T12:00:00",
    "review_items_count": 15,
    "correct_count": 11,
    "wrong_count": 4
  },
  "review_items": [
    {
      "id": 101,
      "word_id": 5,
      "gurmukhi": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
      "romanized": "sat sri akaal",
      "english": "hello",
      "correct": true,
      "created_at": "2026-03-23T12:10:00"
    }
  ]
}
```

### POST /reset_history

Used in:

* Settings page

**Request:**

```json
{
  "scope": "all"
}
```

`scope` values:

* `all` — reset sessions and reviews
* `sessions` — reset sessions and dependent review items
* `reviews` — reset only review items

**Response:**

```json
{
  "message": "History reset successfully",
  "deleted": {
    "study_sessions": 12,
    "word_review_items": 340
  }
}
```

---

## ❗ Standard Error Response

All endpoints should return this shape for errors:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Group with id 999 was not found",
    "details": null
  }
}
```

Common HTTP status codes:

* `400` — invalid request/query/body
* `404` — resource not found
* `422` — schema validation failure
* `500` — server error

### Request Constraints and Validation Rules

* max JSON request size: 1 MB
* pagination: `per_page` default `50`, max `100`
* `word_id` must exist
* `group_id` must exist
* `study_activity_id` must exist
* `correct` must be boolean

Rate limiting:

* not enforced in this single-user prototype
* recommended production default: 60 requests/minute per IP

---

## 🧾 Response Field Dictionary

Use this dictionary as the source of truth for response payloads.

### Word Summary Object

```json
{
  "id": 1,
  "gurmukhi": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
  "romanized": "sat sri akaal",
  "english": "hello",
  "correct_count": 3,
  "wrong_count": 1
}
```

Field definitions:

* `id` (integer) — unique word id
* `gurmukhi` (string) — word in Gurmukhi script
* `romanized` (string) — transliteration
* `english` (string) — English meaning
* `correct_count` (integer) — total correct attempts
* `wrong_count` (integer) — total wrong attempts

### Group Object

```json
{
  "id": 1,
  "name": "Greetings",
  "words_count": 25
}
```

Field definitions:

* `id` (integer) — unique group id
* `name` (string) — group label
* `words_count` (integer) — words in the group

### Study Session Summary Object

```json
{
  "id": 10,
  "group_id": 2,
  "group_name": "Greetings",
  "study_activity_id": 1,
  "study_activity_name": "Typing Tutor",
  "created_at": "2026-03-23T12:00:00",
  "review_items_count": 15,
  "correct_count": 11,
  "wrong_count": 4
}
```

Field definitions:

* `id` (integer) — study session id
* `group_id` (integer) — related group id
* `group_name` (string) — related group name
* `study_activity_id` (integer) — study activity id
* `study_activity_name` (string) — study activity name
* `created_at` (string, ISO-8601 datetime) — session creation timestamp
* `review_items_count` (integer) — number of reviewed items in session
* `correct_count` (integer) — correct answers in session
* `wrong_count` (integer) — wrong answers in session

### Review Item Object

```json
{
  "id": 101,
  "word_id": 5,
  "gurmukhi": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
  "romanized": "sat sri akaal",
  "english": "hello",
  "correct": true,
  "created_at": "2026-03-23T12:10:00"
}
```

Field definitions:

* `id` (integer) — review item id
* `word_id` (integer) — related word id
* `gurmukhi` (string) — reviewed word in Gurmukhi
* `romanized` (string) — reviewed word transliteration
* `english` (string) — reviewed word English meaning
* `correct` (boolean) — result of this attempt
* `created_at` (string, ISO-8601 datetime) — review timestamp

### Pagination Object

```json
{
  "page": 1,
  "per_page": 50,
  "total_items": 124,
  "total_pages": 3,
  "has_next": true,
  "has_prev": false
}
```

Field definitions:

* `page` (integer) — current page number
* `per_page` (integer) — items per page (default `50`, max `100`)
* `total_items` (integer) — total available records
* `total_pages` (integer) — total pages for current `per_page`
* `has_next` (boolean) — whether a next page exists
* `has_prev` (boolean) — whether a previous page exists

### Suggested Indexes

* index on `word_review_items.word_id`
* index on `study_sessions.group_id`
* index on `word_groups.group_id`

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

* GET /study_activities
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

* GET /study_sessions

### UI:

* Table of sessions

---

## 🔍 Study Session Detail

### Backend:

* GET /study_sessions/:id

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
