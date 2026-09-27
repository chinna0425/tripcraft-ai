from app.schemas.trip import Trip
from app.schemas.base import StrictBaseModel

class TripResponse(StrictBaseModel):
    success: bool
    trip: Trip