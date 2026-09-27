from app.schemas.trip import Trip


valid_trip = {
    "title": "Goa Getaway",
    "destination": "Goa, India",
    "durationDays": 2,
    "travelStyle": "relaxed",
    "days": [
        {
            "dayNumber": 1,
            "title": "Arrival",
            "stops": [
                {
                    "id": "day-1-stop-1",
                    "time": "4:00 PM",
                    "title": "Hotel Check-in",
                    "category": "stay",
                    "durationMinutes": 60,
                    "description": "Check in and settle down."
                }
            ]
        },
        {
            "dayNumber": 2,
            "title": "Beach Day",
            "stops": [
                {
                    "id": "day-2-stop-1",
                    "time": "9:00 AM",
                    "title": "Beach Walk",
                    "category": "nature",
                    "durationMinutes": 120,
                    "description": "Enjoy a relaxed morning at the beach."
                }
            ]
        }
    ]
}


trip = Trip.model_validate(valid_trip)

print(trip)
print("VALIDATION SUCCESS")