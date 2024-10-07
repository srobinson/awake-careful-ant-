// src/components/Gallery/GalleryContent.tsx

"use client";

import { useGalleryContext } from "@/context/GalleryContext";
import { useControlsManager } from "@/hooks/useControlsManager";
import { useGalleryData } from "@/hooks/useGalleryData";
import { useGestures } from "@/hooks/useGestures";
import { useImageManager } from "@/hooks/useImageManager";
import { useNavigationManager } from "@/hooks/useNavigationManager";
import { CONFIG } from "@/utils/config";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import ThumbnailView from "../ThumbnailView";
import Controls from "./Controls";
import HelpModal from "./HelpModal";
import ImageDisplay from "./ImageDisplay";
import PreLoader from "./PreLoader";
import ProgressBar from "./ProgressBar";

const useThumbnails = (totalImages: number) => {
	const [thumbnailItems, setThumbnailItems] = useState<number[]>([]);
	const [hasMoreThumbnails, setHasMoreThumbnails] = useState(true);
	const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);

	const loadInitialThumbnails = useCallback(() => {
		const initialItems = Array.from(
			{ length: Math.min(CONFIG.ITEMS_PER_PAGE, totalImages) },
			(_, i) => i
		);
		setThumbnailItems(initialItems);
		setHasMoreThumbnails(initialItems.length < totalImages);
	}, [totalImages]);

	const fetchMoreThumbnails = useCallback(() => {
		if (isLoadingThumbnails || thumbnailItems.length >= totalImages) {
			return;
		}

		setIsLoadingThumbnails(true);

		setTimeout(() => {
			const newItems = Array.from(
				{
					length: Math.min(
						CONFIG.ITEMS_PER_PAGE,
						totalImages - thumbnailItems.length
					),
				},
				(_, i) => thumbnailItems.length + i
			);
			setThumbnailItems(prevItems => [...prevItems, ...newItems]);
			setHasMoreThumbnails(
				thumbnailItems.length + newItems.length < totalImages
			);
			setIsLoadingThumbnails(false);
		}, 500); // Simulating network delay
	}, [thumbnailItems, isLoadingThumbnails, totalImages]);

	return {
		thumbnailItems,
		hasMoreThumbnails,
		isLoadingThumbnails,
		loadInitialThumbnails,
		fetchMoreThumbnails,
	};
};

const Gallery: React.FC = () => {
	const [isMounted, setIsMounted] = useState(false);
	const [markedFiles, setMarkedFiles] = useState<Set<string>>(new Set());

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const { state, markedForDeletion, setMarkedForDeletion } =
		useGalleryContext();
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const {
		galleryData,
		isLoading: isDataLoading,
		error: dataError,
	} = useGalleryData();
	const {
		isLoading,
		currentIndex,
		error,
		updateImage,
		preloadNextImage,
		currentImageRef,
		nextImageRef,
		currentBackgroundRef,
		nextBackgroundRef,
	} = useImageManager();

	const {
		controlsState,
		toggleFullscreen,
		toggleHelpModal,
		toggleThumbnailView,
		closeThumbnailView,
		toggleControls,
		togglePause,
	} = useControlsManager();

	const { progress, resetProgress, startProgress } = useNavigationManager();

	const totalImages = galleryData?.totalImages ?? 0;
	const {
		thumbnailItems,
		hasMoreThumbnails,
		isLoadingThumbnails,
		loadInitialThumbnails,
		fetchMoreThumbnails,
	} = useThumbnails(totalImages);

	const toggleMarkForDeletion = useCallback(
		(index: number) => {
			const filename = galleryData?.images[index].filename;
			if (!filename) return;

			setMarkedForDeletion(prevMarked => {
				const newMarked = new Set(prevMarked);
				if (newMarked.has(index)) {
					newMarked.delete(index);
					setMarkedFiles(prevFiles => {
						const newFiles = new Set(prevFiles);
						newFiles.delete(filename);
						return newFiles;
					});
				} else {
					newMarked.add(index);
					setMarkedFiles(prevFiles => new Set(prevFiles).add(filename));
				}
				return newMarked;
			});
		},
		[galleryData, setMarkedForDeletion]
	);

	const exportMarkedFiles = () => {
		const fileList = Array.from(markedFiles).join("\n");
		console.log("Files marked for deletion:\n", fileList);
		// You can use this list to create a bash script or save it to a file
	};

	useEffect(() => {
		if (galleryData) {
			loadInitialThumbnails();
		}
	}, [galleryData, loadInitialThumbnails]);

	useEffect(() => {
		if (!isLoading && isInitialLoad) {
			setIsInitialLoad(false);
			if (CONFIG.AUTO_START) {
				startProgress(); // Start navigation on page load
				togglePause();
			}
		}
	}, [isLoading, isInitialLoad, startProgress, togglePause]);

	const [lastManualNavigationTime, setLastManualNavigationTime] = useState(0);

	const calculateNewIndex = (
		direction: "next" | "prev",
		currentIndex: number,
		totalImages: number
	) => {
		return direction === "next"
			? (currentIndex + 1) % totalImages
			: (currentIndex - 1 + totalImages) % totalImages;
	};

	const handleManualNavigation = useCallback(
		(direction: "next" | "prev") => {
			const newIndex = calculateNewIndex(direction, currentIndex, totalImages);
			updateImage(newIndex, direction);
			resetProgress();
			setLastManualNavigationTime(Date.now());
		},
		[currentIndex, totalImages, updateImage, resetProgress]
	);

	useEffect(() => {
		const shouldAutoNavigate =
			!state.isPaused &&
			!controlsState.isThumbnailViewActive &&
			!isLoading &&
			!isInitialLoad &&
			progress >= 100 &&
			Date.now() - lastManualNavigationTime > 1000;

		if (shouldAutoNavigate) {
			const timeoutId = setTimeout(() => {
				handleManualNavigation("next");
			}, 100);

			return () => clearTimeout(timeoutId);
		}
	}, [
		state.isPaused,
		controlsState.isThumbnailViewActive,
		isLoading,
		isInitialLoad,
		progress,
		lastManualNavigationTime,
		handleManualNavigation,
	]);

	useEffect(() => {
		preloadNextImage(currentIndex);
	}, [currentIndex, preloadNextImage]);

	const gestureHandlers = useMemo(
		() => ({
			onSwipeLeft: () => handleManualNavigation("next"),
			onSwipeRight: () => handleManualNavigation("prev"),
			onDoubleTap: toggleFullscreen,
			onPinchIn: () => {
				/* Implement zoom in */
			},
			onPinchOut: () => {
				/* Implement zoom out */
			},
		}),
		[handleManualNavigation, toggleFullscreen]
	);

	const { triggerGesture } = useGestures(gestureHandlers);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (controlsState.isHelpModalOpen) {
				if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					toggleHelpModal();
				}
				return;
			}
			if (controlsState.isThumbnailViewActive && e.key === "Escape") {
				e.preventDefault();
				closeThumbnailView();
				return;
			}

			switch (e.key) {
				case "ArrowRight":
					triggerGesture("onSwipeLeft");
					break;
				case "ArrowLeft":
					triggerGesture("onSwipeRight");
					break;
				case " ":
					e.preventDefault();
					togglePause();
					break;
				case "f":
					toggleFullscreen();
					break;
				case "h":
					toggleHelpModal();
					break;
			}
		},
		[
			triggerGesture,
			controlsState.isHelpModalOpen,
			controlsState.isThumbnailViewActive,
			toggleHelpModal,
			closeThumbnailView,
			togglePause,
			toggleFullscreen,
		]
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	const handleThumbnailClick = useCallback(
		(index: number) => {
			updateImage(index, index > currentIndex ? "next" : "prev");
			resetProgress();
			closeThumbnailView(); // Ensure the thumbnail view is closed
		},
		[closeThumbnailView, currentIndex, updateImage, resetProgress]
	);

	const handleScreenClick = useCallback(
		(e: React.MouseEvent) => {
			const target = e.target as HTMLElement;
			const isClickInsideControls = target.closest(".controls-container");
			const isClickInsideThumbnails = target.closest(".thumbnail-view");

			if (!isClickInsideControls && !isClickInsideThumbnails) {
				if (controlsState.isThumbnailViewActive) {
					closeThumbnailView();
				} else if (!controlsState.isHelpModalOpen) {
					toggleControls();
				}
			}
		},
		[
			controlsState.isThumbnailViewActive,
			controlsState.isHelpModalOpen,
			closeThumbnailView,
			toggleControls,
		]
	);

	const galleryRef = useRef<HTMLDivElement>(null);

	if (!isMounted) {
		return null; // or a loading indicator
	}

	return (
		<div
			ref={galleryRef}
			className="relative w-full h-screen overflow-hidden bg-black"
			onClick={handleScreenClick}
		>
			<ProgressBar isPaused={state.isPaused} progress={progress} />

			<ImageDisplay
				currentBackgroundRef={currentBackgroundRef}
				nextBackgroundRef={nextBackgroundRef}
				currentImageRef={currentImageRef}
				nextImageRef={nextImageRef}
				isInitialLoad={isInitialLoad}
			/>

			{(error ?? dataError) && (
				<div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded">
					{error ?? dataError}
				</div>
			)}

			<PreLoader
				isLoading={isLoading || isDataLoading}
				isInitialLoad={isInitialLoad}
			/>

			<Controls
				controlsState={controlsState}
				toggleHelpModal={toggleHelpModal}
				toggleThumbnailView={toggleThumbnailView}
				toggleFullscreen={toggleFullscreen}
				togglePause={togglePause}
				isPaused={state.isPaused}
				toggleMarkForDeletion={() => toggleMarkForDeletion(currentIndex)}
				isMarkedForDeletion={markedForDeletion.has(currentIndex)}
				exportMarkedFiles={exportMarkedFiles} // Pass the export function
			/>

			<HelpModal
				isOpen={controlsState.isHelpModalOpen}
				onClose={toggleHelpModal}
			/>

			<ThumbnailView
				currentIndex={currentIndex}
				onThumbnailClick={handleThumbnailClick}
				isVisible={controlsState.isThumbnailViewActive}
				items={thumbnailItems}
				hasMore={hasMoreThumbnails}
				isLoading={isLoadingThumbnails}
				onLoadMore={fetchMoreThumbnails}
				toggleMarkForDeletion={toggleMarkForDeletion} // Pass the toggle function
				markedForDeletion={markedForDeletion} // Pass the marked set
			/>
		</div>
	);
};

export default Gallery;
