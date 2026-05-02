import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from dotenv import load_dotenv
import time

load_dotenv()

# Initialize Firebase
cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
if not cred_path or not os.path.exists(cred_path):
    print(f"Error: Credentials not found at {cred_path}")
    exit(1)

cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

DEPARTMENTS = ["CSE", "ECE", "MECH", "CIVIL"]
CLASSES_PER_DEPT = ["A", "B", "C", "D"]
STUDENTS_PER_CLASS = 10
COMMON_PASSWORD = "password123"

def seed_users():
    print("Starting massive seeding process... This might take a few minutes!")
    
    users_to_create = []

    # 1. Add Principal & Admin
    users_to_create.append({
        "email": "principal@college.edu", "role": "PRINCIPAL", "name": "College Principal", "department": "", "class_name": ""
    })
    users_to_create.append({
        "email": "admin@college.edu", "role": "ADMIN", "name": "System Admin", "department": "", "class_name": ""
    })

    # 2. Add HODs, Advisors, and Students
    for dept in DEPARTMENTS:
        # HOD for the department
        users_to_create.append({
            "email": f"hod_{dept.lower()}@college.edu", "role": "HOD", "name": f"HOD {dept}", "department": dept, "class_name": ""
        })

        for cls in CLASSES_PER_DEPT:
            class_name = f"{dept}-{cls}"
            # Advisor for the class
            users_to_create.append({
                "email": f"advisor_{dept.lower()}_{cls.lower()}@college.edu", "role": "ADVISOR", "name": f"Advisor {class_name}", "department": dept, "class_name": class_name
            })

            # Students for the class
            for i in range(1, STUDENTS_PER_CLASS + 1):
                users_to_create.append({
                    "email": f"student{i}_{dept.lower()}_{cls.lower()}@college.edu", "role": "STUDENT", "name": f"Student {i} {class_name}", "department": dept, "class_name": class_name
                })

    print(f"Total accounts to process: {len(users_to_create)}")

    created_count = 0
    updated_count = 0

    for idx, user_data in enumerate(users_to_create):
        try:
            # 1. Create User in Firebase Auth
            try:
                user = auth.get_user_by_email(user_data["email"])
                updated_count += 1
            except auth.UserNotFoundError:
                user = auth.create_user(
                    email=user_data["email"],
                    password=COMMON_PASSWORD,
                    display_name=user_data["name"]
                )
                created_count += 1

            # 2. Add Role to Firestore
            db.collection("users").document(user.uid).set({
                "uid": user.uid,
                "email": user_data["email"],
                "role": user_data["role"],
                "name": user_data["name"],
                "department": user_data["department"],
                "class_name": user_data["class_name"],
                "createdAt": firestore.SERVER_TIMESTAMP
            }, merge=True)
            
            # Print progress every 10 users
            if (idx + 1) % 10 == 0:
                print(f"Processed {idx + 1}/{len(users_to_create)} accounts...")

        except Exception as e:
            print(f"Failed to process {user_data['email']}: {e}")

    print("\n--- Seeding Complete ---")
    print(f"Created: {created_count} new accounts")
    print(f"Updated: {updated_count} existing accounts")
    print(f"Password for all accounts is: {COMMON_PASSWORD}")

if __name__ == "__main__":
    seed_users()
