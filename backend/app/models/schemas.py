from pydantic import BaseModel
from enum import Enum
from typing import Optional, List
from datetime import datetime

class RequestType(str, Enum):
    OD = "OD"
    MEDICAL = "MEDICAL"
    EMERGENCY = "EMERGENCY"
    OTHER = "OTHER"

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
    type: RequestType
    start_date: str 
    end_date: str
    days: int
    reason: str
    register_number: str
    # student_id and class_name are inserted from Auth Token, not request body

class ApprovalAction(BaseModel):
    request_id: str
    approver_role: ReviewStage # Explicitly claiming role (will be verified against real User Role)
    decision: RequestStatus # APPROVED / REJECTED
    comments: Optional[str] = None
