import DayCard from "../DayCard/DayCard";
import "./tripview.css";
const TripView = ({ trip, onTripChange }) => {
	if (!trip) {
		return null;
	}

	const allStops = [];

	trip.days.forEach((day) => {
		day.stops.forEach((stop) => {
			allStops.push(stop);
		});
	});

	const completedStops = allStops.filter((stop) => stop.completed).length;

	const totalStops = allStops.length;

	const progress =
		totalStops === 0 ? 0 : Math.round((completedStops / totalStops) * 100);

	return (
		<section className="trip-view">
			<div className="trip-progress">
				<div>
					<strong>
						{completedStops}/{totalStops}
					</strong>

					<span>stops completed</span>
				</div>

				<div className="progress-bar">
					<div
						className="progress-value"
						style={{
							width: `${progress}%`,
						}}
					/>
				</div>
			</div>
			<div className="trip-header">
				<div>
					<p className="trip-eyebrow">YOUR ITINERARY</p>

					<h2>{trip.title}</h2>

					<p>{trip.destination}</p>
				</div>

				<div className="trip-meta">{trip.durationDays} days</div>
			</div>

			<div className="days-list">
				{trip.days.map((day) => {
					if (day.stops.length === 0) {
						return null;
					}
					return (
						<DayCard
							key={day.dayNumber}
							day={day}
							onDayChange={(updatedDay) => {
								const updatedDays = trip.days.map((currentDay) => {
									if (currentDay.dayNumber === day.dayNumber) {
										return updatedDay;
									}

									return currentDay;
								});

								onTripChange({
									...trip,
									days: updatedDays,
								});
							}}
						/>
					);
				})}
			</div>
		</section>
	);
};

export default TripView;
