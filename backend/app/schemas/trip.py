from enum import Enum
from pydantic import Field, model_validator
from app.schemas.base import StrictBaseModel
from pydantic import BaseModel

class TravelStyle(str, Enum):
    RELAXED = "relaxed"
    BALANCED = "balanced"
    PACKED = "packed"

class StopCategory(str, Enum):
    ACTIVITY = "activity"
    FOOD = "food"
    LANDMARK = "landmark"
    NATURE = "nature"
    SHOPPING = "shopping"
    STAY = "stay"
    TRANSPORT = "transport"
    RELAXATION = "relaxation"

class Stop(StrictBaseModel):
    id: str = Field(min_length=1)
    time: str = Field(min_length=1)
    title: str = Field(min_length=1)
    category: StopCategory
    durationMinutes: int = Field(
        ge=15,
        le=1440
    )
    description: str = Field(min_length=1)


class Day(StrictBaseModel):
    dayNumber: int = Field(ge=1)
    title: str = Field(min_length=1)
    stops: list[Stop]


class Trip(StrictBaseModel):
    title: str = Field(min_length=1)
    destination: str = Field(min_length=1)
    durationDays: int = Field(ge=1,le=30)
    travelStyle: TravelStyle
    days: list[Day] = Field(min_length=1)

    @model_validator(mode="after")
    def validate_days(self):
        day_numbers = [
            day.dayNumber
            for day in self.days
        ]
        expected_days = set(range(1, self.durationDays + 1))
        actual_days = set(day_numbers)
        if actual_days != expected_days:
            raise ValueError("Trip must contain exactly one day for each day number.")

        if len(day_numbers) != len(set(day_numbers)):

            raise ValueError("Day numbers must be unique.")

        stop_ids = []

        for day in self.days:
            for stop in day.stops:
                stop_ids.append(stop.id)

        if len(stop_ids) != len(set(stop_ids)):
            raise ValueError("Stop IDs must be unique.")

        return self

class RefineTripRequest(BaseModel):
    trip: Trip
    instruction: str = Field(min_length=1,max_length=1000)