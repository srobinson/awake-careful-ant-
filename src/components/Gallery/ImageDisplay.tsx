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
			<div className="relative z-10 w-full h-full flex justify-center items-center">
				<img
					ref={currentImageRef}
					className={`gallery-image gallery-image-current absolute !h-screen object-cover transition-all duration-500 ease-in-out ${
						isInitialLoad ? "opacity-0" : ""
					}`}
					alt="Current gallery image"
				/>
				{currentImage?.comment && (
					<>
						<div
							key={animationKey} // Use the key to reset animation
							ref={marqueeRef}
							className="flex uppercase w-max border-[1vh] text-[5vh] font-extrabold text-white"
							style={{
								padding: "0 2vh 0 0",
								whiteSpace: "nowrap",
								animation: `marquee-move-text ${animationDuration}s linear infinite`,
							}}
						>
							<div className="marquee-content">
								<span
									className="inline-block mr-4 px-8 bg-black text-white border-r-10"
									style={{
										borderRight: "1vh solid white",
									}}
								>
									{currentImage?.author || "johndoe"}
								</span>
								<span>
									{currentImage?.comment || "No description available"}
								</span>
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
					</>
				)}
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
