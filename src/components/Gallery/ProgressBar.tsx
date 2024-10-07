import React from "react";

interface ProgressBarProps {
	isPaused: boolean;
	progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isPaused, progress }) => {
	return (
		<div
			className={`absolute transition-opacity top-0 left-0 right-0 h-1 border-bottom-1 border-black z-40 ${
				isPaused ? "opacity-30" : "opacity-100"
			}`}
		>
			<div
				className="h-full bg-white transition-all duration-100 ease-linear"
				style={{ width: `${progress}%` }}
			></div>
		</div>
	);
};

export default ProgressBar;
