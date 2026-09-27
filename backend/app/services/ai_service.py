import json
import time
from groq import Groq
from app.core.config import GROQ_API_KEY, GROQ_MODEL
from app.schemas.trip import Trip

client = Groq(api_key=GROQ_API_KEY,timeout=30.0)

TRIP_JSON_SCHEMA = {
    "name": "trip",
    "strict": True,
    "schema": Trip.model_json_schema()
}


SYSTEM_PROMPT = """
You are TripCraft's itinerary generation engine.
Your task is to transform the user's free-form travel request
into a practical, coherent, day-by-day travel itinerary.
Rules:
1. Return only the structured data requested by the JSON schema.
2. Do not include markdown.
3. Do not include explanations outside the structured response.
4. Respect the requested destination, duration, and preferences.
5. Do not invent impossible day numbers.
6. Keep stop IDs unique.
7. Keep each day logically ordered by time.
8. Avoid unrealistic schedules with excessive travel or activities.
9. If the user does not specify a travel style, choose a sensible balanced plan.
10. Each stop should have a useful description.
11. Use only the allowed category values.
12. Make the itinerary useful rather than filling fields with generic text.
13. The days array MUST contain exactly one object for every day from 1 through durationDays.
14. If durationDays is 3, the days array MUST contain: dayNumber 1, dayNumber 2, and dayNumber 3.
15. Never return a partial itinerary.
16. Never omit a day.
17. Never duplicate a day number.
18. The number of day objects MUST equal durationDays.
19. Before returning the result, internally verify that every day from 1 through durationDays is present.
20. Each day should contain at least one useful stop.
"""

def call_groq(prompt: str):
    last_error = None
    for attempt in range(2):
        try:
            return client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": SYSTEM_PROMPT
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                response_format={
                    "type": "json_schema",
                    "json_schema": TRIP_JSON_SCHEMA
                }
            )

        except Exception as error:
            last_error = error
            print(
                f"Groq attempt {attempt + 1} failed:",
                repr(error)
            )
            if attempt == 0:
                time.sleep(1)

    raise last_error


class AIServiceError(Exception):
    pass


def generate_trip_with_ai(prompt: str) -> Trip:
    try:
        response = call_groq(prompt)
        content = response.choices[0].message.content

        if not content:
            raise AIServiceError("The AI returned an empty response.")


        try:

            data = json.loads(content)

        except json.JSONDecodeError as error:

            raise AIServiceError("The AI returned invalid JSON.") from error

        try:
            trip = Trip.model_validate(data)

        except Exception as error:

            raise AIServiceError(
                "The AI returned data that does not match "
                "the expected trip format."
            ) from error


        return trip


    except AIServiceError:
        raise


    except Exception as error:

        raise AIServiceError("The AI service failed.") from error


def refine_trip_with_ai(trip: Trip,instruction: str) -> Trip:

    prompt = f"""
You are an expert travel itinerary editor.
You will receive an existing trip itinerary and a user's
requested modification.
Modify the existing itinerary according to the user's request.
Important rules:
1. Preserve the existing structure.
2. Make only the changes necessary.
3. Do not invent unrelated changes.
4. Keep the itinerary logically consistent.
5. Preserve existing stop IDs whenever the stop itself remains.
6. If a stop is removed, remove it completely.
7. Keep all stop IDs unique.
8. Keep all day numbers unique.
9. Keep the itinerary within the existing trip duration.
10. Return JSON only.
11. The response must follow the same trip schema.
Existing trip:
{trip.model_dump_json(indent=2)}
User refinement:
{instruction}
"""

    try:

        response = call_groq(prompt)
        content = response.choices[0].message.content

        if not content:

            raise AIServiceError("The AI returned an empty response.")

        try:
            data = json.loads(content)
        except json.JSONDecodeError as error:

            raise AIServiceError("The AI returned invalid JSON.") from error

        try:

            updated_trip = Trip.model_validate(data)

        except Exception as error:
            raise AIServiceError(
                "The AI returned data that does not match "
                "the expected trip format."
            ) from error

        return updated_trip

    except AIServiceError:
        raise

    except Exception as error:

        raise AIServiceError("The AI service failed to refine the trip.") from error