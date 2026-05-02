from pydantic import BaseModel
from enum import Enum
from typing import Optional, List
from datetime import datetime

class RequestType(str, Enum):
    OD = "OD"
    LEAVE = "LEAVE"
    MEDICAL = "MEDICAL"
    EMERGENCY = "EMERGENCY"

class ReviewStage(str, Enum):
    ADVISOR = "ADVISOR"
    HOD = "HOD"
    PRINCIPAL = "PRINCIPAL"
    COMPLETED = "COMPLETED"

class RequestStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class RequestCreate(BaseModel):
    student_id: str
    type: RequestType
    start_date: str 
    end_date: str
    days: int
    reason: str
    
class ApprovalAction(BaseModel):
    request_id: str
    approver_role: ReviewStage # Role of the person approving
    decision: RequestStatus # APPROVED / REJECTED
    comments: Optional[str] = None
