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
						<li>Swipe left/right: Next/previous image</li>
						<li>Swipe up: Open thumbnail view</li>
						<li>Swipe down: Toggle controls</li>
						<li>Tap: Toggle controls</li>
						<li>Double tap: Toggle fullscreen</li>
						<li>Pinch in/out: Zoom in/out</li>
					</ul>
				) : (
					<ul className="list-disc pl-5">
						<li>Left/Right Arrow: Next/previous image</li>
						<li>Space: Pause/resume slideshow</li>
						<li>F: Toggle fullscreen</li>
						<li>H: Toggle this help modal</li>
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
