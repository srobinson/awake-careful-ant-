import React, { useEffect, useState } from "react";

interface ImageDisplayProps {
	currentBackgroundRef: React.RefObject<HTMLDivElement>;
	nextBackgroundRef: React.RefObject<HTMLDivElement>;
	currentImageRef: React.RefObject<HTMLImageElement>;
	nextImageRef: React.RefObject<HTMLImageElement>;
	isInitialLoad: boolean;
	currentImage: any | null; // Add this line
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
	currentBackgroundRef,
	nextBackgroundRef,
	currentImageRef,
	nextImageRef,
	isInitialLoad,
	currentImage, // Add this line
}) => {
	const [animationKey, setAnimationKey] = useState(0);

	useEffect(() => {
		setAnimationKey(prevKey => prevKey + 1);
	}, [currentImage]);

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
					className={`gallery-image gallery-image-current absolute !h-screen object-cover transition-all duration-500 ease-in-out ${
						isInitialLoad ? "opacity-0" : ""
					}`}
					alt="Current gallery image"
				/>
				{/* <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
					<div className="overflow-hidden w-full absolute bottom-0">
						<span
							id="image-description"
							key={animationKey}
							className="mix-blend-difference indent-10 border-[1vh] border-white text-[5vh] font-extrabold uppercase tracking-wider inline-block box-shadow-md"
							style={{
								lineHeight: "1",
								textShadow: "0 0 1vh rgba(255,255,255,0.5)",
								whiteSpace: "nowrap",
								// animation: `textSlide 15s linear infinite`, // Set a fixed duration
								animation: `textSlide ${currentImage?.comment?.length * 0.2}s linear infinite`,
							}}
						>
							{currentImage?.comment || "No description available"}
						</span>
					</div>
				</div>
				<style jsx>{`
					@keyframes textSlide {
						0% {
							transform: translateX(100vw);
						}
						100% {
							transform: translateX(-100vw);
						}
					}
				`}</style> */}
				<div
					className="absolute inset-0"
					style={{
						mixBlendMode: "difference",
					}}
				></div>
				<img
					ref={nextImageRef}
					className="absolute !h-screen object-cover transition-all duration-500 ease-in-out opacity-0"
					alt="Next gallery image"
					src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
				/>
			</div>
		</>
	);
};

export default ImageDisplay;
