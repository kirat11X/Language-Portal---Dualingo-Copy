# 🧠 Punjabi LangPortal — Backend Technical Specification

---

## 📌 Business Goal

A language learning school wants to build a prototype portal that acts as:

* 📚 Inventory of Punjabi vocabulary (Gurmukhi + Romanized + English)
* 📊 Learning Record Store (LRS) to track correct/wrong answers
* 🚀 Unified launchpad for multiple learning applications (Flashcards, Quiz, Typing Tutor)

---

## ⚙️ Technical Requirements

* **Language:** Python
* **Framework:** FastAPI
* **Database:** SQLite3
* **Response Format:** JSON only
* **Authentication:** Not required (single-user system)

---


## 📁 Project Structure (Recommended)

The backend should follow a modular FastAPI structure:

app/
  main.py
  database.py
  models.py
  schemas.py
  routes/
    words.py
    groups.py
    sessions.py


- `main.py` → FastAPI app entry point  
- `database.py` → DB connection setup  
- `models.py` → SQLAlchemy models  
- `schemas.py` → Pydantic request/response models  
- `routes/` → API route definitions  

This structure improves maintainability and allows easy scaling.

## 🏗️ System Responsibilities

The backend is responsible for:

* Managing vocabulary data
* Tracking learning performance
* Handling study sessions
* Serving data to multiple frontend learning apps
* Maintaining relational integrity across entities

---

## 🗄️ Database Schema Overview
our database will be named 'words.db'

The system consists of the following tables:

* `words` — Punjabi vocabulary
* `groups` — thematic collections
* `word_groups` — many-to-many mapping
* `study_activities` — learning modes
* `study_sessions` — session tracking
* `word_review_items` — performance tracking
---

## 🗃️ SQL Schema (Reference Implementation)

This SQL schema defines the exact structure of the SQLite database (`words.db`).

```sql
CREATE TABLE words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gurmukhi TEXT NOT NULL,
  romanized TEXT NOT NULL,
  english TEXT NOT NULL,
  parts JSON NOT NULL
);

CREATE TABLE groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  words_count INTEGER DEFAULT 0
);

CREATE TABLE word_groups (
  word_id INTEGER,
  group_id INTEGER,
  FOREIGN KEY(word_id) REFERENCES words(id),
  FOREIGN KEY(group_id) REFERENCES groups(id)
);

## 🧩 Database Schema (Detailed)

---

### 🟩 `words` — Punjabi Vocabulary

* `id` (Primary Key)
* `gurmukhi` (String, Required)
* `romanized` (String, Required)
* `english` (String, Required)
* `parts` (JSON, Required)

#### Example:

```json
{
  "type": "noun",
  "gender": "masculine",
  "difficulty": "beginner",
  "example": "ਇਹ ਇੱਕ ਕਿਤਾਬ ਹੈ",
  "pronunciation_hint": "kitaab"
}
```

---

### 🟦 `groups` — Word Categories

* `id` (Primary Key)
* `name` (String, Required)
* `words_count` (Integer, Default: 0)

Examples:

* Greetings
* Food
* Daily Conversation
* Family

---

### 🟨 `word_groups` — Many-to-Many Mapping

* `word_id` (Foreign Key → words.id)
* `group_id` (Foreign Key → groups.id)

---

### 🟪 `study_activities` — Learning Modes

* `id` (Primary Key)
* `name` (String, Required)
* `url` (String, Required)

Examples:

* Flashcards
* Punjabi → English Quiz
* English → Punjabi Quiz
* Typing Tutor

---

### 🟥 `study_sessions` — Learning Sessions

* `id` (Primary Key)
* `group_id` (Foreign Key)
* `study_activity_id` (Foreign Key)
* `created_at` (Timestamp, Default: current time)

---

### 🟫 `word_review_items` — Performance Tracking

* `id` (Primary Key)
* `word_id` (Foreign Key)
* `study_session_id` (Foreign Key)
* `correct` (Boolean, Required)
* `created_at` (Timestamp)

---

## 🔗 Relationships

* Word ↔ Groups (Many-to-Many via `word_groups`)
* Session → Group
* Session → Study Activity
* Session → Word Review Items
* Word Review Item → Word

---

## 🌐 API Endpoints

---

## 🔤 GET `/words`

Returns paginated Punjabi vocabulary with performance stats.

### Query Parameters:

* `page` (default: 1)
* `per_page` (default: 50, max: 100)
* `sort_by`:

  * `gurmukhi`
  * `romanized`
  * `english`
  * `correct_count`
  * `wrong_count`
* `order`: `asc` | `desc`

### Response (200):

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

Pagination limits:

* default `per_page` = `50`
* maximum `per_page` = `100`

---

## 📖 GET `/words/:id`

Returns full details for a single word.

### Response (200):

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

## 📚 GET `/groups`

Returns paginated list of word groups.

### Query Parameters:

* `page` (default: 1)
* `per_page` (default: 50, max: 100)
* `sort_by`: `name`, `words_count`
* `order`: `asc`, `desc`

### Response (200):

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

## 📂 GET `/groups/:id`

Returns words inside a group.

### Query Parameters:

* `page`
* `per_page` (default: 50, max: 100)
* `sort_by`: `gurmukhi`, `romanized`, `english`, `correct_count`, `wrong_count`
* `order`: `asc`, `desc`

### Response (200):

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

## 🏠 GET `/dashboard`

Returns aggregated learning summary for the dashboard.

### Response (200):

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

### Derived Logic

* `progress.studied` = number of unique words reviewed at least once
* `progress.total` = total words in database
* `stats.success_rate` = `(total_correct_reviews / total_reviews) * 100`
* `stats.streak` = consecutive days with at least one study session
* all dashboard metrics are computed over the entire dataset (all-time)

---

## 🧩 GET `/study_activities`

Returns study activities available to launch.

Study activities are pre-seeded and read-only.

### Response (200):

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

---

## 🎯 POST `/study_sessions`

Creates a new study session.

### Request Body:

```json
{
  "group_id": 2,
  "study_activity_id": 1
}
```

### Response (201):

```json
{
  "id": 10,
  "group_id": 2,
  "study_activity_id": 1,
  "created_at": "2026-03-23T12:00:00"
}
```

---

## 📝 POST `/study_sessions/:id/review`

Logs a review attempt.

### Request Body:

```json
{
  "word_id": 5,
  "correct": true
}
```

### Response (201):

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

## 🕒 GET `/study_sessions`

Returns all study sessions.

### Response (200):

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

## 🔍 GET `/study_sessions/:id`

Returns session details including reviewed words.

### Response (200):

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

## ⚙️ POST `/reset_history`

Resets tracked study progress and session history.

### Request Body:

```json
{
  "scope": "all"
}
```

`scope` values:

* `all` — reset sessions and reviews
* `sessions` — reset sessions and dependent review items
* `reviews` — reset only review items

### Response (200):

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

---

## 📊 Derived Data Logic

Backend should compute:

* `correct_count` per word
* `wrong_count` per word
* success rate (frontend may also compute)
* session review counts

### Example Aggregation Logic

The following SQL-style logic is used to compute review statistics:


correct_count = COUNT(word_review_items WHERE correct = true GROUP BY word_id)
wrong_count = COUNT(word_review_items WHERE correct = false GROUP BY word_id)


These counts should be computed using efficient SQL aggregation (GROUP BY) rather than in-memory processing.

---

## ⚙️ Design Notes

* Auto-increment primary keys
* Foreign key constraints enforced
* JSON field for flexible word structure
* `groups.words_count` acts as counter cache
* Efficient aggregation using joins

Indexes:

* index on `word_review_items.word_id`
* index on `study_sessions.group_id`
* index on `word_groups.group_id`

---

## 🔁 Data Flow

1. User selects study activity
2. Backend creates session → `/study_sessions`
3. Words fetched via `/groups/:id`
4. User answers → `/study_sessions/:id/review`
5. Backend stores performance
6. `/words` reflects updated stats

---

## 🚀 Future Considerations

* `audio_url` in `words` for pronunciation playback
* `difficulty` field (`easy` | `medium` | `hard`)
* `script_stage` for learning progression
* `next_review_at` in `word_review_items` for spaced repetition
* recommendation engine based on user performance
* adaptive difficulty adjustments
* analytics endpoints for trends and weak words
* leaderboards (if multi-user support is added)



---

## 🧪 Home Challenge

* **Level 1:** Implement missing endpoints
* **Level 5:** Rebuild entire system with custom improvements

---

## 🎯 Final Summary

Punjabi LangPortal backend is a:

* 📚 Vocabulary management system
* 📊 Learning analytics engine
* 🚀 Multi-activity backend platform

Built using:

* FastAPI (Python)
* SQLite (lightweight DB)

---
