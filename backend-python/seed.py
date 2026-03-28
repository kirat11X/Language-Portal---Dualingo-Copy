import os
import sys

# Add the current directory to python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app import models

def seed():
    print("Creating tables...")
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if db.query(models.StudyActivity).count() == 0:
        print("Seeding Study Activities...")
        db.add(models.StudyActivity(name="Typing Tutor", url="/activities/typing-tutor"))
        db.add(models.StudyActivity(name="Flashcards", url="/activities/flashcards"))
        db.add(models.StudyActivity(name="Quiz", url="/activities/quiz"))
        
        print("Seeding Groups...")
        group1 = models.Group(name="Greetings", words_count=2)
        group2 = models.Group(name="Numbers", words_count=2)
        db.add(group1)
        db.add(group2)
        
        print("Seeding Words...")
        word1 = models.Word(gurmukhi="ਸਤ ਸ੍ਰੀ ਅਕਾਲ", romanized="Sat Sri Akaal", english="Hello", parts={"type": "phrase"})
        word2 = models.Word(gurmukhi="ਧੰਨਵਾਦ", romanized="Dhanvaad", english="Thank you", parts={"type": "phrase"})
        word3 = models.Word(gurmukhi="ਇੱਕ", romanized="Ikk", english="One", parts={"type": "number"})
        word4 = models.Word(gurmukhi="ਦੋ", romanized="Do", english="Two", parts={"type": "number"})
        
        db.add_all([word1, word2, word3, word4])
        db.commit()
        
        print("Linking Words to Groups...")
        db.add(models.WordGroup(word_id=word1.id, group_id=group1.id))
        db.add(models.WordGroup(word_id=word2.id, group_id=group1.id))
        db.add(models.WordGroup(word_id=word3.id, group_id=group2.id))
        db.add(models.WordGroup(word_id=word4.id, group_id=group2.id))
        
        db.commit()
        print("Database seeded successfully!")
    else:
        print("Database already seeded.")

if __name__ == "__main__":
    seed()
