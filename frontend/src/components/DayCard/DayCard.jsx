import { useState } from "react";

import StopCard from "../StopCard/StopCard";
import "./daycard.css";

function DayCard({ day, onDayChange }) {
	const [isExpanded, setIsExpanded] = useState(true);

	function handleStopChange(updatedStop) {
		const updatedStops = day.stops.map((stop) => {
			if (stop.id === updatedStop.id) {
				return updatedStop;
			}

			return stop;
		});

		onDayChange({
			...day,
			stops: updatedStops,
		});
	}

	function handleMoveUp(index) {
		if (index === 0) {
			return;
		}

		const updatedStops = [...day.stops];

		const currentStop = updatedStops[index];

		updatedStops[index] = updatedStops[index - 1];

		updatedStops[index - 1] = currentStop;

		onDayChange({
			...day,
			stops: updatedStops,
		});
	}

	function handleMoveDown(index) {
		if (index === day.stops.length - 1) {
			return;
		}

		const updatedStops = [...day.stops];

		const currentStop = updatedStops[index];

		updatedStops[index] = updatedStops[index + 1];

		updatedStops[index + 1] = currentStop;

		onDayChange({
			...day,
			stops: updatedStops,
		});
	}

	function handleRemoveStop(stopId) {
		const updatedStops = day.stops.filter((stop) => stop.id !== stopId);

		onDayChange({
			...day,
			stops: updatedStops,
		});
	}

	const completedStops = day.stops.filter((stop) => stop.completed).length;

	const totalStops = day.stops.length;

	const progress =
		totalStops === 0 ? 0 : Math.round((completedStops / totalStops) * 100);

	const cleanDayTitle = day.title.replace(/^day\s*\d+\s*:\s*/i, "");
	return (
		<article className="day-card">
			<button className="day-header" onClick={() => setIsExpanded(!isExpanded)}>
				<div className="day-header-content">
					<div className="day-info">
						<span>DAY {day.dayNumber}</span>

						<h3>{cleanDayTitle}</h3>

						<small>
							{completedStops} / {totalStops} completed
						</small>
					</div>

					<span className="day-toggle">{isExpanded ? "−" : "+"}</span>

					<div className="progress-bar">
						<div
							className="progress-value"
							style={{
								width: `${progress}%`,
							}}
						/>
					</div>
				</div>
			</button>

			{isExpanded && (
				<div className="stops-list">
					{day.stops.map((stop, index) => (
						<StopCard
							key={stop.id}
							stop={stop}
							index={index}
							totalStops={day.stops.length}
							onChange={handleStopChange}
							onRemove={handleRemoveStop}
							onMoveUp={() => handleMoveUp(index)}
							onMoveDown={() => handleMoveDown(index)}
						/>
					))}
				</div>
			)}
		</article>
	);
}

export default DayCard;
