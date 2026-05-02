import asyncio
import uuid
from datetime import datetime
from app.db.firebase import get_db
from app.models.schemas import RequestCreate, RequestType, RequestStatus, ReviewStage
from app.services.workflow import get_required_approvals

def test_create():
    try:
        db = get_db()
        if not db:
            print("DB IS NONE")
            return
            
        request = RequestCreate(
            type=RequestType.MEDICAL,
            start_date="2026-04-08",
            end_date="2026-04-22",
            days=15,
            reason="I have stone in my kidney"
        )
        
        user = {
            "uid": "test_uid",
            "email": "student@college.edu",
            "role": "STUDENT",
            "department": None
        }
        
        required_approvals = get_required_approvals(request.type, request.days)
        initial_stage = required_approvals[0]
        
        req_id = str(uuid.uuid4())
        req_data = request.dict()
        req_data.update({
            "id": req_id,
            "studentId": user['uid'],
            "studentName": user.get('email', 'Unknown'),
            "department": user.get('department'),
            "status": RequestStatus.PENDING.value,
            "stage": initial_stage.value,
            "required_approvals": [s.value for s in required_approvals],
            "history": [],
            "created_at": datetime.utcnow()
        })
        req_data['type'] = request.type.value
        
        print("Data to insert:", req_data)
        db.collection("requests").document(req_id).set(req_data)
        print("SUCCESS")
    except Exception as e:
        print("ERROR:", str(e))
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_create()
