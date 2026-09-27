import { useState } from "react";
import "./refinement.css";

const RefinementBox = ({ onRefine, loading }) => {
	const [instruction, setInstruction] = useState("");
	const [lastInstruction, setLastInstruction] = useState("");
	const [refinementError, setRefinementError] = useState("");

	async function submitInstruction(value) {
		const trimmedValue = value.trim();

		if (!trimmedValue) {
			return;
		}

		setRefinementError("");

		const success = await onRefine(trimmedValue);

		if (success) {
			setInstruction("");
			setLastInstruction("");
		} else {
			setLastInstruction(trimmedValue);
			setRefinementError(
				"We couldn't update your itinerary. Your current trip is still safe.",
			);
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();

		await submitInstruction(instruction);
	}

	async function handleRetry() {
		if (!lastInstruction) {
			return;
		}

		await submitInstruction(lastInstruction);
	}

	return (
		<section className="refinement-box">
			<div className="refinement-header">
				<p className="refinement-label">REFINE YOUR ITINERARY</p>

				<h3>Want to change something?</h3>

				<p>Describe what you want to change in your current trip.</p>
			</div>

			<form onSubmit={handleSubmit}>
				<textarea
					value={instruction}
					onChange={(event) => {
						setInstruction(event.target.value);
						setRefinementError("");
					}}
					placeholder={
						"Example: Make Day 2 less crowded " +
						"and add more time for local food."
					}
					disabled={loading}
					maxLength={1000}
				/>

				<div className="refinement-footer">
					<span>{instruction.length}/1000</span>

					<button type="submit" disabled={loading || !instruction.trim()}>
						{loading ? "Updating..." : "Apply Changes"}
					</button>
				</div>
			</form>

			{refinementError && (
				<div className="refinement-error">
					<div>
						<strong>Refinement failed</strong>

						<p>{refinementError}</p>
					</div>

					<button type="button" onClick={handleRetry} disabled={loading}>
						{loading ? "Retrying..." : "Retry"}
					</button>
				</div>
			)}
		</section>
	);
};

export default RefinementBox;
