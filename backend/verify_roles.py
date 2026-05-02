import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase (assuming same as backend)
cred_path = "serviceAccountKey.json"
try:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
except Exception as e:
    pass # App already initialized or error

db = firestore.client()
users = db.collection('users').stream()

for user in users:
    data = user.to_dict()
    print(f"User: {data.get('email')} -> Role: {data.get('role')}")
