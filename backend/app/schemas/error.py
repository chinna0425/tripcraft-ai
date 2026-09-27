from app.schemas.base import StrictBaseModel

class ErrorDetail(StrictBaseModel):
    code: str
    message: str

class ErrorResponse(StrictBaseModel):
    success: bool = False
    error: ErrorDetail