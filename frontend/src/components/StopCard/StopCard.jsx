import "./stopcard.css";

const StopCard = ({
	stop,
	index,
	totalStops,
	onChange,
	onRemove,
	onMoveUp,
	onMoveDown,
}) => {
	const handleComplete = () => {
		onChange({
			...stop,
			completed: !stop.completed,
		});
	};

	return (
		<div className={stop.completed ? "stop-card completed" : "stop-card"}>
			<div className="stop-time">{stop.time}</div>

			<div className="stop-content">
				<div className="stop-title-row">
					<h4>{stop.title}</h4>

					<span>{stop.category}</span>
				</div>

				<p>{stop.description}</p>

				<div className="stop-actions">
					<button onClick={handleComplete}>
						{stop.completed ? "✓ Completed" : "Mark complete"}
					</button>

					<button
						onClick={onMoveUp}
						disabled={index === 0}
						aria-label={`Move ${stop.title} up`}
					>
						↑
					</button>

					<button
						onClick={onMoveDown}
						disabled={index === totalStops - 1}
						aria-label={`Move ${stop.title} down`}
					>
						↓
					</button>

					<button onClick={() => onRemove(stop.id)}>Remove</button>
				</div>
			</div>
		</div>
	);
};

export default StopCard;
