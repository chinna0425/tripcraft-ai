from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.trips import router as trips_router
from app.core.config import APP_NAME
from fastapi.responses import JSONResponse
from app.services.ai_service import AIServiceError

app = FastAPI(
    title=APP_NAME,
    description="AI-powered interactive trip planner API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(trips_router)    

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "TripCraft API is running"
    }
    

@app.exception_handler(AIServiceError)
async def ai_service_error_handler(request, exc):
    return JSONResponse(
        status_code=503,
        content={
            "success": False,
            "error": {
                "code": "AI_SERVICE_ERROR",
                "message": str(exc)
            }
        }
    )