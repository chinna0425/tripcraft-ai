from app.schemas.trip import Trip
from app.services.ai_service import generate_trip_with_ai, refine_trip_with_ai

def generate_trip(prompt: str) -> Trip:
    return generate_trip_with_ai(prompt)

def refine_trip(trip: Trip, instruction: str) -> Trip:
    return refine_trip_with_ai(trip, instruction)