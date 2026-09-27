import { useRef, useState } from "react";

import TripView from "./components/TripView/TripView";
import { generateTrip, refineTrip } from "./services/tripApi";
import RefinementBox from "./components/RefinementBox/RefinementBox";
import "./App.css";

const normalizeTrip = (trip) => {
	return {
		...trip,

		days: trip.days.map((day) => ({
			...day,

			stops: day.stops.map((stop) => ({
				...stop,
				completed: false,
			})),
		})),
	};
};

const preserveCompletedState = (previousTrip, updatedTrip) => {
	const completedStops = new Map();

	previousTrip.days.forEach((day) => {
		day.stops.forEach((stop) => {
			completedStops.set(stop.id, stop.completed === true);
		});
	});

	return {
		...updatedTrip,

		days: updatedTrip.days.map((day) => ({
			...day,

			stops: day.stops.map((stop) => ({
				...stop,

				completed: completedStops.get(stop.id) || false,
			})),
		})),
	};
};

const App = () => {
	const [prompt, setPrompt] = useState("");

	const [trip, setTrip] = useState(null);

	const [status, setStatus] = useState("idle");

	const [isRefining, setIsRefining] = useState(false);

	const [error, setError] = useState("");

	// Controller for trip generation
	const generateControllerRef = useRef(null);

	// Controller for trip refinement
	const refineControllerRef = useRef(null);

	async function handleGenerate() {
		if (!prompt.trim()) {
			setError("Please describe the trip you want to plan.");

			setStatus("error");

			return;
		}

		// Cancel previous generation request
		if (generateControllerRef.current) {
			generateControllerRef.current.abort();
		}

		const controller = new AbortController();

		generateControllerRef.current = controller;

		setStatus("loading");

		setError("");

		setTrip(null);

		const currentPrompt = prompt.trim();

		try {
			const data = await generateTrip(currentPrompt, controller.signal);

			// to update the UI.
			if (controller.signal.aborted) {
				return;
			}

			setTrip(normalizeTrip(data.trip));

			setStatus("success");
		} catch (error) {
			if (error.name === "AbortError") {
				return;
			}

			setError(error.message || "Failed to generate trip.");

			setStatus("error");
		} finally {
			if (generateControllerRef.current === controller) {
				generateControllerRef.current = null;
			}
		}
		setPrompt("");
	}

	async function handleRefine(instruction) {
		if (!trip) {
			return false;
		}

		// Cancel previous refinement request
		if (refineControllerRef.current) {
			refineControllerRef.current.abort();
		}

		const controller = new AbortController();

		refineControllerRef.current = controller;

		setIsRefining(true);
		setError("");

		try {
			const data = await refineTrip(trip, instruction, controller.signal);

			// Ignore an outdated response
			if (controller.signal.aborted) {
				return false;
			}

			setTrip(preserveCompletedState(trip, data.trip));

			return true;
		} catch (error) {
			if (error.name === "AbortError") {
				return false;
			}

			setError(error.message || "Failed to refine trip.");

			return false;
		} finally {
			if (refineControllerRef.current === controller) {
				refineControllerRef.current = null;
				setIsRefining(false);
			}
		}
	}

	return (
		<main className="app">
			<header className="app-header">
				<h1>TripCraft AI</h1>

				<p>Turn a simple travel idea into an interactive itinerary.</p>
			</header>

			<section className="prompt-box">
				<textarea
					value={prompt}
					onChange={(event) => setPrompt(event.target.value)}
					placeholder="Tell us about your trip..."
				/>

				<button
					className="generate-button"
					onClick={handleGenerate}
					disabled={status === "loading"}
				>
					{status === "loading" ? "Planning your trip..." : "Generate Trip"}
				</button>
			</section>

			{status === "error" && (
				<div className="error-state">
					<p>{error}</p>

					<button onClick={handleGenerate}>Try again</button>
				</div>
			)}

			{status === "success" && trip && (
				<TripView trip={trip} onTripChange={setTrip} />
			)}

			{trip && <RefinementBox onRefine={handleRefine} loading={isRefining} />}
		</main>
	);
};

export default App;
