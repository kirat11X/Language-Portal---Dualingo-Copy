# Backend Server Techical specs

## Business Goal: 
A language learning school wants to build a prototype of learning portal which will act as three things:
-Inventory of possible vocabulary that can be learned
-Act as a  Learning record store (LRS), providing correct and wrong score on practice vocabulary
-A unified launchpad to launch different learning apps

## Technical Requirements:
-the backend will be in python
-the database used is SQLite3
-the API will be made using python
-the API used is FastAPI
-the API will always return JSON
-Does not require authentication/authorization, assume there is a single user

## Database Schema:
We have the following table:
- words - stored vocabulary words
- words_groups - joins table for words and groups to many to many relationship
- groups -thematic groups of words
- study_activities - a specific study activity, linking a study session to group
- Study_sessions - record of a study session, linking to a group and a timestamp
- word_review_items- a record of a word practices,determining if the user got it right or wrong

## Database Schema Detailing:

- 🟩 words — Stores individual Punjabi vocabulary words
id (Primary Key): Unique identifier for each word
gurmukhi (String, Required): The word written in Punjabi (Gurmukhi script)
romanized (String, Required): Romanized/transliterated version of the word
english (String, Required): English translation of the word
parts (JSON, Required): Word components stored in JSON format

💡 Example parts:
{
  "type": "noun",
  "gender": "masculine",
  "difficulty": "beginner",
  "example": "ਇਹ ਇੱਕ ਕਿਤਾਬ ਹੈ",
  "pronunciation_hint": "kitaab"
}

- 🟦 groups — Manages collections of words (topics)
id (Primary Key): Unique identifier for each group
name (String, Required): Name of the group
👉 Examples: "Greetings", "Food", "Daily Conversation", "Family"
words_count (Integer, Default: 0): Counter cache for number of words
- 🟨 word_groups — Many-to-many mapping
word_id (Foreign Key): References words.id
group_id (Foreign Key): References groups.id
- 🟪 study_activities — Types of learning modes
id (Primary Key): Unique identifier for each activity
name (String, Required): Name of the activity
👉 Examples:
"Flashcards"
"Punjabi → English Quiz"
"English → Punjabi Quiz"
"Listening Practice"
url (String, Required): Full URL of the activity
- 🟥 study_sessions — Records each learning session
id (Primary Key): Unique identifier for each session
group_id (Foreign Key): References groups.id
study_activity_id (Foreign Key): References study_activities.id
created_at (Timestamp, Default: Current Time): Session start time
- 🟫 word_review_items — Tracks performance per word
id (Primary Key): Unique identifier for each review
word_id (Foreign Key): References words.id
study_session_id (Foreign Key): References study_sessions.id
correct (Boolean, Required): Whether answer was correct
created_at (Timestamp, Default: Current Time): Review time


## Fututre Considerations:

- ⭐ Add audio support
audio_url in words
→ helps pronunciation learning
- ⭐ Add difficulty system
difficulty field (easy / medium / hard)
- ⭐ Add script learning support
script_stage (beginner Gurmukhi letters → words → sentences)
- ⭐ Add spaced repetition readiness
next_review_at in word_review_items