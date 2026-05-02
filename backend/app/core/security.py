from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from ..db.firebase import get_db
from typing import List

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verifies the Firebase ID Token and returns user data with Role.
    """
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
        # Fetch role from Firestore
        db = get_db()
        if not db:
             raise HTTPException(status_code=500, detail="Database connection unavailable")
             
        user_doc = db.collection("users").document(uid).get()
        if not user_doc.exists:
             # Fallback or Error. For now assuming minimal user data exists.
             # If seeding worked, this should exist.
             role = "STUDENT" 
             department = None
             class_name = None
        else:
             user_data = user_doc.to_dict()
             role = user_data.get("role", "STUDENT")
             department = user_data.get("department")
             class_name = user_data.get("class_name")

        return {
            "uid": uid,
            "email": decoded_token.get("email"),
            "role": role,
            "department": department,
            "class_name": class_name
        }
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid credential")

def require_role(allowed_roles: List[str]):
    """
    Dependency to enforce Role-Based Access Control.
    """
    async def role_checker(user: dict = Depends(get_current_user)):
        if user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail=f"Access forbidden. User role '{user['role']}' is not authorized."
            )
        return user
    return role_checker
