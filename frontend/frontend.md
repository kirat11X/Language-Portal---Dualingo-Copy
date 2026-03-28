# 🧠 Punjabi LangPortal — Frontend Technical Specification

## 📌 Overview

Punjabi LangPortal is a frontend web application for learning Punjabi vocabulary using:

* Gurmukhi script
* Romanized transliteration
* English meaning
* Performance tracking
* Interactive study activities

This frontend consumes a REST API backend and provides a structured learning experience through dashboards, word groups, sessions, and activities.

---

## 🏗️ Tech Stack

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS / ShadCN UI
* **Routing:** React Router
* **State Management:** React Query / Zustand (optional)
* **HTTP Client:** Axios / Fetch API
* **UI Pattern:** Sidebar + Content Layout

---

## 🧭 App Layout

### Sidebar Navigation

* Dashboard
* Study Activities
* Words
* Word Groups
* Sessions
* Settings

---

## 📊 Pages & UI Components

---

## 🏠 1. Dashboard

### Features

* Last Study Session
* Study Progress Bar
* Quick Stats

### UI Elements

* **Last Session Card**

  * Activity Name
  * Date
  * Correct / Wrong count
  * Link to group

* **Progress Section**

  * Total Words Studied (e.g., 3 / 124)
  * Mastery Progress Bar

* **Quick Stats**

  * Success Rate
  * Study Sessions
  * Active Groups
  * Study Streak

* CTA Button:

  * `Start Studying`

---

### API

```http
GET /dashboard
```

**Derived Logic Notes (from backend contract):**
- `progress.studied` = number of unique words reviewed at least once
- `progress.total` = total words in database
- `stats.success_rate` = `(total_correct_reviews / total_reviews) * 100`
- `stats.streak` = consecutive days with at least one study session
- all dashboard metrics are computed over the entire dataset (all-time)

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

---

## 🧩 2. Study Activities

### Features

* List all activities
* Launch activity
* View past sessions

### UI

* Activity Card:

  * Thumbnail
  * Name (Typing Tutor)
  * Launch Button
  * View Button

---

### Launch Page

* Select Word Group (Dropdown)
* Launch Button

---

### API

```http
GET /study_activities
POST /study_sessions
```

Study activities are pre-seeded and read-only.

**GET /study_activities Response (200):**
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

**POST /study_sessions Request Body:**
```json
{
  "group_id": 2,
  "study_activity_id": 1
}
```

**Parameters:**
- `group_id` (integer, required): ID of the group to study
- `study_activity_id` (integer, required): ID of the study activity

**POST /study_sessions Response (201):**
```json
{
  "id": 10,
  "group_id": 2,
  "study_activity_id": 1,
  "created_at": "2026-03-23T12:00:00"
}
```

---

## 🔤 3. Words Page

### Features

* List all Punjabi words
* Track performance

### Table Columns

* Gurmukhi
* Romanized
* English
* Correct Count
* Wrong Count

---

### API

```http
GET /words
```

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `per_page` (integer, optional): Items per page (default: 50, max: 100)
- `sort_by` (string, optional): Sort field - 'gurmukhi', 'romanized', 'english', 'correct_count', 'wrong_count' (default: 'gurmukhi')
- `order` (string, optional): Sort order - 'asc' or 'desc' (default: 'asc')

**Response (200):**
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

---

## 📖 4. Word Details Page

### Features

* Full word info
* Study stats
* Group membership

### UI

* Gurmukhi word (large)

* Romanized

* English meaning

* Stats:

  * Correct Answers
  * Wrong Answers

* Groups:

  * Chips (e.g., Core Verbs)

---

### API

```http
GET /words/:id
```

**Response (200):**
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

## 📚 5. Word Groups

### Features

* List all groups

### UI Table

* Group Name
* Word Count

---

### API

```http
GET /groups
```

**Response (200):**
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

## 📂 6. Word Group Detail

### Features

* Group statistics
* Words inside group

### UI

* Group Name (e.g., Core Adjectives)
* Total Words

### Table

* Gurmukhi
* Romanized
* English
* Correct
* Wrong

---

### API

```http
GET /groups/:id
```

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `per_page` (integer, optional): Items per page (default: 50, max: 100)
- `sort_by` (string, optional): Sort field - 'gurmukhi', 'romanized', 'english', 'correct_count', 'wrong_count' (default: 'gurmukhi')
- `order` (string, optional): Sort order - 'asc' or 'desc' (default: 'asc')

**Response (200):**
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

## 🕒 7. Study Sessions

### Features

* View all sessions

### Table

* ID
* Activity Name
* Group Name
* Start Time
* End Time
* Review Items Count

---

### API

```http
GET /study_sessions
```

**Response (200):**
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

## 🔍 8. Study Session Details

### Features

* View session performance

### UI

* Activity Name
* Group Name
* Start Time
* Review Items Count

### Words Reviewed Table

* Gurmukhi
* Romanized
* English
* Correct
* Wrong

---

### API

```http
GET /study_sessions/:id
```

**Response (200):**
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

---

## 📝 Study Session Review

### Features

* Log review attempts for words during study session
* Track correctness of each word

### API

```http
POST /study_sessions/:id/review
```

**Request Body:**
```json
{
  "word_id": 5,
  "correct": true
}
```

**Parameters:**
- `word_id` (integer, required): ID of the word being reviewed
- `correct` (boolean, required): Whether the answer was correct

**Response (201):**
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

## ⚙️ 9. Settings Page

### Features

* Theme toggle (Light/Dark)
* Reset History

---

### API

```http
POST /reset_history
```

**Request Body:**
```json
{
  "scope": "all"
}
```

**Scope values:**
- `all`: reset sessions and reviews
- `sessions`: reset sessions and dependent review items
- `reviews`: reset only review items

**Response (200):**
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

## 🔁 Data Flow

1. User selects activity
2. Selects word group
3. Starts session → `POST /study_sessions`
4. Reviews words → `POST /study_sessions/:id/review`
5. Dashboard updates dynamically

---

## 🧠 Key Frontend Concepts

### State

* Current Session
* Selected Group
* Word Progress Cache

### Optimization

* Cache words using React Query
* Lazy load tables
* Debounce search (if added)

---

## 🚀 Future Enhancements

* Punjabi Audio Pronunciation
* Speech Recognition Practice
* AI-based difficulty adaptation
* Gamification (XP, Levels)
* Leaderboard

---

## 🎯 Final Note

This frontend is designed to:

* Support Punjabi-first learning (Gurmukhi + Romanized)
* Track performance deeply
* Plug into multiple learning apps
* Scale into a full language learning ecosystem

---
