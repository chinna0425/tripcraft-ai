from fastapi import APIRouter
from app.schemas.request import GenerateTripRequest
from app.schemas.response import TripResponse
from app.services.trip_service import generate_trip,refine_trip
from app.schemas.request import RefineTripRequest

router = APIRouter(prefix="/api/trips",tags=["Trips"])

@router.post("/generate", response_model=TripResponse)
def generate_trip_endpoint(request: GenerateTripRequest):
    trip = generate_trip(request.prompt)
    return TripResponse(success=True,trip=trip)
    

@router.post("/refine",)
def refine_trip_endpoint(request: RefineTripRequest):
    trip = refine_trip(request.trip,request.instruction)
    return TripResponse(success=True,trip=trip)