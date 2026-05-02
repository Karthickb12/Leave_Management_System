import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from dotenv import load_dotenv

load_dotenv(os.path.join("backend", ".env"))

# Initialize Firebase
cred_path = os.path.join("backend", "serviceAccountKey.json")
if not os.path.exists(cred_path):
    print(f"Error: Credentials not found at {cred_path}")
    exit(1)

cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

# We will create a small, fast batch of test users specifically for CSE-A
USERS = [
    {"email": "student_csea@college.edu", "role": "STUDENT", "name": "Student CSE-A", "department": "CSE", "class_name": "CSE-A"},
    {"email": "advisor_csea@college.edu", "role": "ADVISOR", "name": "Advisor CSE-A", "department": "CSE", "class_name": "CSE-A"},
    {"email": "hod_cse@college.edu", "role": "HOD", "name": "HOD CSE", "department": "CSE", "class_name": ""},
    {"email": "principal_test@college.edu", "role": "PRINCIPAL", "name": "Principal Demo", "department": "", "class_name": ""},
]

def seed_users():
    print("Starting rapid seeding process...")
    for user_data in USERS:
        try:
            # 1. Auth
            try:
                user = auth.get_user_by_email(user_data["email"])
                print(f"Updating existing user: {user_data['email']}")
            except auth.UserNotFoundError:
                user = auth.create_user(
                    email=user_data["email"],
                    password="password123",
                    display_name=user_data["name"]
                )
                print(f"Created new Auth User: {user_data['email']}")

            # 2. Firestore Document (CRITICAL for role routing)
            db.collection("users").document(user.uid).set({
                "uid": user.uid,
                "email": user_data["email"],
                "role": user_data["role"],
                "name": user_data["name"],
                "department": user_data["department"],
                "class_name": user_data["class_name"],
                "createdAt": firestore.SERVER_TIMESTAMP
            }, merge=True)
            print(f"Successfully configured Dashboard Routing for {user_data['role']}")

        except Exception as e:
            print(f"Failed to process {user_data['email']}: {e}")

    print("\n✅ Seeding Complete! Database is fully configured.")

if __name__ == "__main__":
    seed_users()
