from pydantic import Field
from app.schemas.base import StrictBaseModel
from app.schemas.trip import Trip

class GenerateTripRequest(StrictBaseModel):
    prompt: str = Field(min_length=10, max_length=3000)


class RefineTripRequest(StrictBaseModel):
    trip: Trip
    instruction: str = Field(min_length=10, max_length=1000)