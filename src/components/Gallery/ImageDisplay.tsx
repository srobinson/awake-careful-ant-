import { CONFIG } from "@/utils/config";
import React, { useEffect, useRef, useState } from "react";

interface ImageDisplayProps {
	currentBackgroundRef: React.RefObject<HTMLDivElement>;
	nextBackgroundRef: React.RefObject<HTMLDivElement>;
	currentImageRef: React.RefObject<HTMLImageElement>;
	nextImageRef: React.RefObject<HTMLImageElement>;
	isInitialLoad: boolean;
	currentImage: any | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
	currentBackgroundRef,
	nextBackgroundRef,
	currentImageRef,
	nextImageRef,
	isInitialLoad,
	currentImage,
}) => {
	const [animationDuration, setAnimationDuration] = useState(15);
	const [animationKey, setAnimationKey] = useState(0);
	const marqueeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (marqueeRef.current) {
			const textWidth = marqueeRef.current.scrollWidth;
			const containerWidth = marqueeRef.current.parentElement?.offsetWidth || 0;
			const speed = CONFIG.IS_MOBILE ? 150 : 300; // pixels per second
			const duration = (textWidth + containerWidth) / speed;
			setAnimationDuration(duration);
		}
		setAnimationKey(prevKey => prevKey + 1); // Update the key to reset animation
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
				<div className="absolute inset-0 flex items-center justify-center overflow-hidden">
					<div
						className="overflow-hidden flex w-full absolute bottom-0"
						style={{
							justifyContent: "end",
							width: "100%",
						}}
					>
						<div
							id="image-description"
							key={animationKey} // Use the key to reset animation
							ref={marqueeRef}
							className="flex uppercase w-max mix-blend-difference border-[1vh] border-white text-[5vh] font-extrabold"
							// className="flex w-max mix-blend-difference padd-10 border-[1vh] border-white text-[5vh] font-extrabold uppercase tracking-wider inline-block box-shadow-md"
							style={{
								// textShadow: "0 0 1vh rgba(0,0,0,0.5)",
								padding: "0 2vh",
								whiteSpace: "nowrap",
								animation: `marquee-move-text ${animationDuration}s linear infinite`,
							}}
						>
							<div className="marquee-content">
								{currentImage?.comment || "No description available"}
							</div>
						</div>
					</div>
				</div>
				<style jsx>{`
					@keyframes marquee-move-text {
						0% {
							transform: translateX(100%);
						}
						100% {
							transform: translateX(-100%);
						}
					}
				`}</style>
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
