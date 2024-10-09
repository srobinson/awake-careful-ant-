// src/components/Gallery/Controls.tsx

import React from "react";
import { CONFIG } from "../../utils/config";

interface ControlsProps {
	controlsState: {
		isControlsVisible: boolean;
		isFullscreen: boolean;
		isHelpModalOpen: boolean;
		isThumbnailViewActive: boolean;
	};
	isPaused: boolean;
	toggleFullscreen: () => void;
	toggleHelpModal: () => void;
	togglePause: () => void;
	toggleThumbnailView: () => void;
	toggleMarkForDeletion: () => void;
	isMarkedForDeletion: boolean;
	exportMarkedFiles: () => void;
}

// SVG Components
const FullscreenIcon: React.FC = () => (
	<svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
		<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
	</svg>
);

const FullscreenExitIcon: React.FC = () => (
	<svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
		<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
	</svg>
);

const ExportIcon: React.FC = () => (
	<svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
		<path d="M5 20h14v-2H5v2zm7-18l-5 5h3v4h4V7h3l-5-5z" />
	</svg>
);

const TrashIcon: React.FC = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="w-6 h-6 text-white"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth={2}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M4 7h16M10 11v6m4-6v6M5 7h14l-1 12H6L5 7z"
		/>
	</svg>
);

const Controls: React.FC<ControlsProps> = ({
	controlsState,
	isPaused,
	toggleFullscreen,
	toggleHelpModal,
	togglePause,
	toggleThumbnailView,
	toggleMarkForDeletion,
	isMarkedForDeletion,
	exportMarkedFiles,
}) => {
	return (
		<div
			className={`controls-container fixed top-4 right-4 flex space-x-2 z-[16000] bg-gray-900 bg-opacity-50 rounded-lg p-1 transition-opacity duration-300 ${
				controlsState.isControlsVisible ? "opacity-100" : "opacity-0"
			}`}
		>
			{CONFIG.MARK_CONTROLS_ENABLED && !controlsState.isThumbnailViewActive && (
				<>
					{/* New button to mark/unmark for deletion */}
					<button
						onClick={toggleMarkForDeletion}
						className={`p-2 sm:p-1.5 bg-gray-800 bg-opacity-70 rounded hover:bg-opacity-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-transparent
        ${isMarkedForDeletion ? "border-2 border-red-500" : "border-2 border-transparent"}`}
					>
						<TrashIcon />
					</button>
					{/* New button to export marked files */}
					<button
						onClick={exportMarkedFiles}
						className="p-2 sm:p-1.5 bg-gray-800 bg-opacity-70 rounded hover:bg-opacity-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-transparent"
					>
						<ExportIcon />
					</button>
				</>
			)}
			{CONFIG.HELP_CONTROLS_ENABLED && !controlsState.isThumbnailViewActive && (
				<button
					onClick={toggleHelpModal}
					className={`p-2 sm:p-1.5 bg-gray-800 bg-opacity-70 rounded hover:bg-opacity-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-transparent
          ${controlsState.isHelpModalOpen ? "border-2 border-white" : "border-2 border-transparent"}`}
				>
					{/* Help icon */}
					<svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.17-5.17c-.66.66-1.17 1.12-1.17 2.17h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25L14.17 12.83z" />
					</svg>
				</button>
			)}
			<button
				onClick={toggleThumbnailView}
				className={`p-2 sm:p-1.5 bg-gray-800 bg-opacity-70 rounded hover:bg-opacity-100 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-transparent
          ${
						controlsState.isThumbnailViewActive
							? "border-2 border-white"
							: "border-2 border-transparent"
					}`}
			>
				{/* Thumbnail icon */}
				<svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
					<path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v6z" />
				</svg>
			</button>
			{!controlsState.isThumbnailViewActive && (
				<button
					onClick={togglePause}
					className="p-2 sm:p-1.5 bg-gray-800 bg-opacity-70 rounded hover:bg-opacity-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-transparent"
				>
					{isPaused ? (
						<svg
							className="w-6 h-6 fill-current text-white"
							viewBox="0 0 24 24"
						>
							<path d="M8 5v14l11-7z" />
						</svg>
					) : (
						<svg
							className="w-6 h-6 fill-current text-white"
							viewBox="0 0 24 24"
						>
							<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
						</svg>
					)}
				</button>
			)}
			<button
				onClick={toggleFullscreen}
				className={`sm:block p-1.5 bg-gray-800 bg-opacity-70 rounded hover:bg-opacity-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-transparent
        ${controlsState.isFullscreen ? "border-2 border-white" : "border-2 border-transparent"}`}
			>
				{/* Fullscreen icon */}
				{controlsState.isFullscreen ? (
					<FullscreenExitIcon />
				) : (
					<FullscreenIcon />
				)}
			</button>
		</div>
	);
};

export default Controls;
