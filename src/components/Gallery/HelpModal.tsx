// src/components/Gallery/HelpModal.tsx

import React, { useEffect, useState } from "react";

interface HelpModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	if (!isOpen) return null;

	const handleModalClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<div
			className="fixed text-slate-800 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			onClick={onClose}
		>
			<div
				className="bg-white p-6 rounded-lg max-w-md"
				onClick={handleModalClick}
			>
				<h2 className="text-2xl font-bold mb-4">Gallery Controls</h2>
				{isMobile ? (
					<ul className="list-disc pl-5">
						<li>Swipe left/right: Navigate to next/previous image</li>
						<li>Swipe up: Open the thumbnail view</li>
						<li>Swipe down: Hide/show controls</li>
						<li>Tap: Toggle visibility of controls</li>
						<li>Double tap: Enter/exit fullscreen mode</li>
						<li>Tap and hold: Toggle mark for deletion</li>
						<li>Pinch in/out: Zoom in/out on the image</li>
					</ul>
				) : (
					<ul className="list-disc pl-5">
						<li>Left/Right Arrow: Navigate to next/previous image</li>
						<li>Space: Pause or resume the slideshow</li>
						<li>F: Enter/exit fullscreen mode</li>
						<li>H: Show/hide this help modal</li>
						<li>Esc: Close the current view or modal</li>
						<li>Click and hold: Toggle mark for deletion</li>
					</ul>
				)}
				<button
					className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
					onClick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default HelpModal;
