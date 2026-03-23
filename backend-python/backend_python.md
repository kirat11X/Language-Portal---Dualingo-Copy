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

## 🏗️ System Responsibilities

The backend is responsible for:

* Managing vocabulary data
* Tracking learning performance
* Handling study sessions
* Serving data to multiple frontend learning apps
* Maintaining relational integrity across entities

---

## 🗄️ Database Schema Overview

The system consists of the following tables:

* `words` — Punjabi vocabulary
* `groups` — thematic collections
* `word_groups` — many-to-many mapping
* `study_activities` — learning modes
* `study_sessions` — session tracking
* `word_review_items` — performance tracking

---

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
* `sort_by`:

  * `gurmukhi`
  * `romanized`
  * `english`
  * `correct_count`
  * `wrong_count`
* `order`: `asc` | `desc`

### Response:

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

## 📚 GET `/groups`

Returns paginated list of word groups.

### Response:

```json
[
  {
    "id": 1,
    "name": "Greetings",
    "words_count": 25
  }
]
```

---

## 📂 GET `/groups/:id`

Returns words inside a group.

### Query Parameters:

* `page`
* `sort_by`: `name`, `words_count`
* `order`: `asc`, `desc`

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

### Response:

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

### Behavior:

* Creates entry in `word_review_items`
* Updates aggregated counts for word

---

## 🕒 (Recommended) GET `/study-sessions`

Returns all study sessions.

---

## 🔍 (Recommended) GET `/study-sessions/:id`

Returns session details including reviewed words.

---

## 📊 Derived Data Logic

Backend should compute:

* `correct_count` per word
* `wrong_count` per word
* success rate (frontend may also compute)
* session review counts

---

## ⚙️ Design Notes

* Auto-increment primary keys
* Foreign key constraints enforced
* JSON field for flexible word structure
* `groups.words_count` acts as counter cache
* Efficient aggregation using joins

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

- ⭐ Add audio support
audio_url in words
→ helps pronunciation learning
- ⭐ Add difficulty system
difficulty field (easy / medium / hard)
- ⭐ Add script learning support
script_stage (beginner Gurmukhi letters → words → sentences)
- ⭐ Add spaced repetition readiness
next_review_at in word_review_items
- ⭐ Add recommendation engine
suggest words based on performance
- ⭐ Add adaptive difficulty
adjust word difficulty based on user performance
- ⭐ Add analytics endpoints
performance trends, weak words, etc.
- ⭐ Add leaderboards
compare performance across users (if multi-user support added)

### Data Enhancements

* `audio_url` in `words` (pronunciation)
* `difficulty` field
* `script_stage` (learning progression)
* `next_review_at` (spaced repetition)

### System Enhancements

* Recommendation engine
* Adaptive difficulty
* Analytics endpoints
* Leaderboards



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
