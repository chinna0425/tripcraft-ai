const API_BASE_URL =https://tripcraft-ai-8u78.onrender.com;

export async function generateTrip(prompt, signal) {
	const response = await fetch(`${API_BASE_URL}/api/trips/generate`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			prompt,
		}),

		signal,
	});

	const data = await response.json();

	if (!response.ok) {
		const message = data?.detail || "Failed to generate trip.";

		throw new Error(message);
	}

	return data;
}

function createCleanTrip(trip) {
	return {
		title: trip.title,

		destination: trip.destination,

		durationDays: trip.durationDays,

		travelStyle: trip.travelStyle,

		days: trip.days.map((day) => ({
			dayNumber: day.dayNumber,

			title: day.title,

			stops: day.stops.map((stop) => ({
				id: stop.id,

				time: stop.time,

				title: stop.title,

				category: stop.category,

				durationMinutes: stop.durationMinutes,

				description: stop.description,
			})),
		})),
	};
}

export async function refineTrip(trip, instruction, signal) {
	const cleanTrip = createCleanTrip(trip);

	let response;

	try {
		response = await fetch(`${API_BASE_URL}/api/trips/refine`, {
			method: "POST",

			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify({
				trip: cleanTrip,
				instruction: instruction.trim(),
			}),

			signal,
		});
	} catch (error) {
		if (error.name === "AbortError") {
			throw error;
		}

		throw new Error(
			"Unable to connect to the TripCraft server. " +
				"Please make sure the backend is running.",
		);
	}

	let data;

	try {
		data = await response.json();
	} catch {
		throw new Error("The server returned an invalid response.");
	}

	if (!response.ok) {
		const message =
			typeof data?.detail === "string"
				? data.detail
				: "Trip refinement failed.";

		throw new Error(message);
	}

	return data;
}
