import firebase_admin
from firebase_admin import credentials, firestore
import os
from ..core.config import settings

db = None

def get_db():
    global db
    if db:
        return db
        
    cred_path = settings.FIREBASE_CREDENTIALS_PATH
    if not os.path.exists(cred_path):
        # Try looking one level up (in root backend folder)
        cred_path = os.path.join(os.getcwd(), settings.FIREBASE_CREDENTIALS_PATH)
        
    if os.path.exists(cred_path):
        try:
            # Check if app is already initialized
            firebase_admin.get_app()
        except ValueError:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            
        db = firestore.client()
        return db
    else:
        print(f"CRITICAL: Firebase credentials not found at {cred_path}")
        return None
