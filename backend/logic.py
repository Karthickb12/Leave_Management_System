from models import RequestType, ReviewStage

def get_required_approvals(request_type: RequestType, days: int) -> list[ReviewStage]:
    """
    Returns the list of modification stages required based on type and duration.
    Result does NOT include COMPLETED, just the approval steps.
    """
    if request_type == RequestType.EMERGENCY:
        return [ReviewStage.ADVISOR]
    
    if request_type == RequestType.MEDICAL:
        return [ReviewStage.ADVISOR, ReviewStage.HOD, ReviewStage.PRINCIPAL]

    if request_type == RequestType.OD:
        return [ReviewStage.ADVISOR, ReviewStage.HOD]

    if request_type == RequestType.LEAVE:
        if days <= 2:
            return [ReviewStage.ADVISOR]
        elif days <= 5:
            return [ReviewStage.ADVISOR, ReviewStage.HOD]
        else:
            return [ReviewStage.ADVISOR, ReviewStage.HOD, ReviewStage.PRINCIPAL]
    
    # Default fallback
    return [ReviewStage.ADVISOR]

def get_next_stage(current_stage: ReviewStage, required_approvals: list[ReviewStage]) -> ReviewStage:
    """
    Determines the next stage given the current approval state.
    """
    try:
        current_index = required_approvals.index(current_stage)
        if current_index + 1 < len(required_approvals):
            return required_approvals[current_index + 1]
        return ReviewStage.COMPLETED
    except ValueError:
        # If current stage not in required list (shouldn't happen), return COMPLETED or Error
        return ReviewStage.COMPLETED
