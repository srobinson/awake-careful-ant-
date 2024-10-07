import React from "react";

interface ImageDisplayProps {
	currentBackgroundRef: React.RefObject<HTMLDivElement>;
	nextBackgroundRef: React.RefObject<HTMLDivElement>;
	currentImageRef: React.RefObject<HTMLImageElement>;
	nextImageRef: React.RefObject<HTMLImageElement>;
	isInitialLoad: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
	currentBackgroundRef,
	nextBackgroundRef,
	currentImageRef,
	nextImageRef,
	isInitialLoad,
}) => {
	return (
		<>
			<div
				ref={currentBackgroundRef}
				className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out ${
					isInitialLoad ? "opacity-0" : ""
				}`}
			></div>
			<div
				ref={nextBackgroundRef}
				className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out opacity-0"
			></div>
			<div className="relative z-10 w-full h-full flex justify-center items-center overflow-hidden">
				<img
					ref={currentImageRef}
					className={`absolute !h-screen object-cover transition-all duration-500 ease-in-out ${
						isInitialLoad ? "opacity-0" : ""
					}`}
					alt="Current gallery image"
				/>
				<img
					ref={nextImageRef}
					className="absolute !h-screen object-cover transition-all duration-500 ease-in-out opacity-0"
					alt="Next gallery image"
				/>
			</div>
		</>
	);
};

export default ImageDisplay;
