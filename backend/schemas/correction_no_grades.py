from pydantic import BaseModel
from typing import List

class CorrectionNoGrades(BaseModel):
    essay_id: int
    corrector_id: int
    comment_ids: List[int]