from fastapi import APIRouter, Depends, HTTPException
from ..db.firebase import get_db
from firebase_admin import firestore
from ..models.schemas import RequestCreate, ApprovalAction, RequestStatus, ReviewStage, RequestType
from ..services.workflow import get_required_approvals, get_next_stage
from ..core.security import get_current_user, require_role
from datetime import datetime
import uuid

router = APIRouter(prefix="/requests", tags=["Requests"])

@router.get("/create_test")
async def create_test():
    try:
        db = get_db()
        required_approvals = get_required_approvals(RequestType.OD, 2)
        initial_stage = required_approvals[0]
        req_id = str(uuid.uuid4())
        
        req_data = {
            "type": "OD",
            "start_date": "2026-04-22",
            "end_date": "2026-04-23",
            "days": 2,
            "reason": "Test reason",
            "id": req_id,
            "studentId": "test_uid",
            "studentName": "test@college.edu",
            "department": "CS",
            "status": "PENDING",
            "stage": "ADVISOR",
            "required_approvals": ["ADVISOR", "HOD"],
            "history": [],
            "created_at": datetime.utcnow()
        }
        
        db.collection("requests").document(req_id).set(req_data)
        return {"status": "SUCCESS"}
    except Exception as e:
        import traceback
        return {"status": "ERROR", "error": str(e), "traceback": traceback.format_exc()}

@router.post("/")
async def create_request(request: RequestCreate, user: dict = Depends(get_current_user)):
    """
    Submits a new request. 
    Authenticated User only.
    """
    db = get_db()
    
    # 1. Calc initial approval stage
    required_approvals = get_required_approvals(request.type, request.days)
    initial_stage = required_approvals[0]
    
    # 2. Create Doc
    req_id = str(uuid.uuid4())
    req_data = request.dict()
    req_data.update({
        "id": req_id,
        "studentId": user['uid'], # From Auth Token
        "studentName": user.get('email', 'Unknown'), # Or fetch name
        "department": user.get('department'), # Auto-assign from User Profile
        "class_name": user.get('class_name'), # Auto-assign from User Profile
        "register_number": request.register_number,
        "status": RequestStatus.PENDING.value if hasattr(RequestStatus.PENDING, 'value') else RequestStatus.PENDING,
        "stage": initial_stage.value if hasattr(initial_stage, 'value') else initial_stage,
        "required_approvals": [s.value if hasattr(s, 'value') else s for s in required_approvals],
        "history": [], # Init empty history
        "created_at": datetime.utcnow()
    })
    req_data['type'] = request.type.value if hasattr(request.type, 'value') else request.type
    
    db.collection("requests").document(req_id).set(req_data)
    
    return {"message": "Request created successfully", "id": req_id, "next_stage": initial_stage.value if hasattr(initial_stage, 'value') else initial_stage}

@router.get("/")
async def get_requests(
    status: str = None, 
    stage: str = None, 
    department: str = None,
    start_date: str = None,
    end_date: str = None,
    user: dict = Depends(get_current_user)
):
    """
    Fetch requests.
    - Admin: Can filter by Dept/Date.
    - Student: Own requests only.
    """
    db = get_db()
    query = db.collection("requests")
    
    if user['role'] == "STUDENT":
        query = query.where("studentId", "==", user['uid'])
    
    if user['role'] == "ADVISOR":
        query = query.where("class_name", "==", user.get("class_name", ""))
    
    if user['role'] == "HOD":
        query = query.where("department", "==", user.get("department", ""))
    
    if status:
        query = query.where("status", "==", status)
    
    if stage:
        query = query.where("stage", "==", stage)

    if department:
        query = query.where("department", "==", department)
        
    # Date filtering (simple string comparison or range if stored as ISO)
    # Note: Firestore range filters require composite indexes if mixing fields. 
    # For MVP, we might filter in memory if volume is low, but let's try basic query.
    if start_date:
        query = query.where("created_at", ">=", datetime.fromisoformat(start_date.replace("Z", "+00:00")))
    if end_date:
        query = query.where("created_at", "<=", datetime.fromisoformat(end_date.replace("Z", "+00:00")))
        
    docs = query.stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in docs]

@router.get("/logs/all", dependencies=[Depends(require_role(['ADMIN', 'PRINCIPAL']))])
async def get_approval_logs(user: dict = Depends(get_current_user)):
    """
    Admin/Principal Only: Fetch a flat list of all approval actions (audit trail).
    Useful for "Activity Log" dashboard.
    """
    db = get_db()
    # Fetch all requests (optimized query would be better, but this works for MVP)
    docs = db.collection("requests").stream()
    
    logs = []
    for doc in docs:
        data = doc.to_dict()
        req_id = doc.id
        history = data.get('history', [])
        for entry in history:
            logs.append({
                "request_id": req_id,
                "student_name": data.get('studentName', 'Unknown'),
                "request_type": data.get('type'),
                **entry
            })
            
    # Sort by timestamp desc
    logs.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
    return logs

@router.get("/{request_id}")
async def get_request_by_id(request_id: str, user: dict = Depends(get_current_user)):
    """
    Get a single request by ID.
    Students can only view their own.
    Faculty can view any (or ideally filtered, but open for now).
    """
    db = get_db()
    doc_ref = db.collection("requests").document(request_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Request not found")
        
    data = doc.to_dict()
    
    if user['role'] == 'STUDENT' and data['studentId'] != user['uid']:
        raise HTTPException(status_code=403, detail="You can only view your own requests")
        
    return {**data, "id": doc.id}

@router.post("/approve", dependencies=[Depends(require_role(['ADVISOR', 'HOD', 'PRINCIPAL']))])
async def approve_request(action: ApprovalAction, user: dict = Depends(get_current_user)):
    """
    Approve or Reject a request.
    Restricted to Faculty Roles.
    """
    db = get_db()
    req_ref = db.collection("requests").document(action.request_id)
    req_doc = req_ref.get()
    
    if not req_doc.exists:
        raise HTTPException(status_code=404, detail="Request not found")
        
    req_data = req_doc.to_dict()
    
    # Verify the Approver is the one expected at this stage
    # (e.g., if stage is HOD, user role must be HOD)
    # Ideally, match action.approver_role with user['role']
    if user['role'] != req_data['stage']:
         # Allow Principal to override? For now strict.
         raise HTTPException(status_code=403, detail=f"You are {user['role']}, but this request is waiting for {req_data['stage']}")
    
    if action.decision == RequestStatus.REJECTED:
        req_ref.update({
            "status": RequestStatus.REJECTED.value,
            "stage": ReviewStage.COMPLETED.value,
            "rejected_by": user['role'],
            "history": firestore.ArrayUnion([{
                "stage": req_data['stage'],
                "approver": user['role'],
                "decision": RequestStatus.REJECTED.value,
                "comments": action.comments,
                "timestamp": datetime.utcnow()
            }])
        })
        return {"message": "Request rejected"}
    
    # Logic for Approval
    current_stage = req_data['stage']
    # Re-construct required approvals (converting strings back to enum if needed, or trusting stored list)
    required_approvals = req_data['required_approvals']
    
    next_stage = get_next_stage(current_stage, required_approvals)
    next_stage_val = next_stage.value if hasattr(next_stage, 'value') else next_stage
    
    update_data = {
        "stage": next_stage_val
    }
    
    if next_stage_val == ReviewStage.COMPLETED.value:
        update_data["status"] = RequestStatus.APPROVED.value
    
    # Add to history
    history_entry = {
        "stage": current_stage,
        "approver": user['role'],
        "decision": RequestStatus.APPROVED.value,
        "comments": action.comments,
        "timestamp": datetime.utcnow()
    }
    
    req_ref.update({
        **update_data,
        "history": firestore.ArrayUnion([history_entry])
    })
    
    return {"message": "Request approved", "next_stage": next_stage_val}
