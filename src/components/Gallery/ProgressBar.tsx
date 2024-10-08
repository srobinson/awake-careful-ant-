import React from "react";

interface ProgressBarProps {
	isPaused: boolean;
	progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isPaused, progress }) => {
	return (
		<div
			className={`absolute transition-opacity top-0 left-0 right-0 h-1 z-40 ${
				isPaused ? "opacity-30" : "opacity-100"
			}`}
		>
			<div
				className="h-full bg-white border-1 border-black transition-all duration-100 ease-linear"
				style={{ width: `${progress}%`, borderBottom: "1px solid black" }}
			></div>
		</div>
	);
};

export default ProgressBar;
