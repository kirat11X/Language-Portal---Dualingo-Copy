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
GET /study-activities
POST /study-sessions
```

**POST /study-sessions Request Body:**
```json
{
  "group_id": 2,
  "study_activity_id": 1
}
```

**Parameters:**
- `group_id` (integer, required): ID of the group to study
- `study_activity_id` (integer, required): ID of the study activity

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
- `sort_by` (string, optional): Sort field - 'kanji', 'romaji', 'english', 'correct_count', 'wrong_count' (default: 'kanji')
- `order` (string, optional): Sort order - 'asc' or 'desc' (default: 'asc')

**Response:**
```json
[
  {
    "id": 1,
    "gurmukhi": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    "romanized": "sat sri akaal",
    "english": "hello",
    "correct": 3,
    "wrong": 1
  }
]
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
- `sort_by` (string, optional): Sort field - 'name', 'words_count' (default: 'name')
- `order` (string, optional): Sort order - 'asc' or 'desc' (default: 'asc')

**Response:**

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
GET /study-sessions
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
GET /study-sessions/:id
```

---

## 📝 Study Session Review

### Features

* Log review attempts for words during study session
* Track correctness of each word

### API

```http
POST /study-sessions/:id/review
```

**Request Body:**
```json
{
  "word_id": 5,
  "is_correct": true
}
```

**Parameters:**
- `word_id` (integer, required): ID of the word being reviewed
- `is_correct` (boolean, required): Whether the answer was correct

---

## ⚙️ 9. Settings Page

### Features

* Theme toggle (Light/Dark)
* Reset History

---

### API

```http
POST /reset-history
```

---

## 🔁 Data Flow

1. User selects activity
2. Selects word group
3. Starts session → `POST /study-sessions`
4. Reviews words → `POST /word-review`
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
