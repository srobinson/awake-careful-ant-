// src/hooks/useImageManager.ts

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGalleryData } from "./useGalleryData";

import { CONFIG } from "@/utils/config";

const loadImageWithRetry = async (
	src: string,
	retries = 3
): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = err => {
			if (retries === 0) reject(err);
			else
				setTimeout(
					() => loadImageWithRetry(src, retries - 1).then(resolve, reject),
					1000
				);
		};
		img.src = src;
	});
};

export const useImageManager = () => {
	const {
		galleryData,
		isLoading: isDataLoading,
		error: dataError,
	} = useGalleryData();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const currentImageRef = useRef<HTMLImageElement>(null);
	const nextImageRef = useRef<HTMLImageElement>(null);
	const currentBackgroundRef = useRef<HTMLDivElement>(null);
	const nextBackgroundRef = useRef<HTMLDivElement>(null);

	const totalImages = galleryData?.totalImages ?? 0;

	const getImageSrc = useCallback(
		(index: number): string => {
			if (!galleryData) return "";
			const image = galleryData.images[index];
			return `https://i.awake-careful-ant.com/optimized/${image.variants.original.filename}`;
		},
		[galleryData]
	);

	const setupNextImage = (
		loadedImage: HTMLImageElement,
		direction: "next" | "prev"
	) => {
		if (!nextImageRef.current || !nextBackgroundRef.current) return;

		nextImageRef.current.src = loadedImage.src;
		nextBackgroundRef.current.style.backgroundImage = `url(${loadedImage.src})`;

		const translateValue = direction === "next" ? "10%" : "-10%";
		nextImageRef.current.style.transform = `translateX(${translateValue})`;
		nextBackgroundRef.current.style.transform = `translateX(${translateValue}) scale(1.01)`;
		nextImageRef.current.style.opacity = "0";
		nextBackgroundRef.current.style.opacity = "0";
	};

	const slideInNextElements = () => {
		if (!nextImageRef.current || !nextBackgroundRef.current) return;

		nextImageRef.current.style.transform = "translateX(0)";
		nextImageRef.current.style.opacity = "1";
		nextBackgroundRef.current.style.transform = "translateX(0) scale(1.02)";
		nextBackgroundRef.current.style.opacity = "0.66";
	};

	const slideOutCurrentElements = (direction: "next" | "prev") => {
		if (!currentImageRef.current || !currentBackgroundRef.current) return;

		currentImageRef.current.style.transform =
			direction === "next" ? "translateX(-10%)" : "translateX(10%)";
		currentImageRef.current.style.opacity = "0";
		currentBackgroundRef.current.style.transform =
			direction === "next"
				? "translateX(-10%) scale(1.01)"
				: "translateX(10%) scale(1.01)";
		currentBackgroundRef.current.style.opacity = "0";
	};

	const transitionImage = useCallback(
		async (loadedImage: HTMLImageElement, direction: "next" | "prev") => {
			setupNextImage(loadedImage, direction);

			// Force a reflow
			void nextImageRef.current?.offsetHeight;
			void nextBackgroundRef.current?.offsetHeight;

			slideInNextElements();
			slideOutCurrentElements(direction);

			await new Promise(resolve =>
				setTimeout(resolve, CONFIG.MIN_DISPLAY_TIME)
			);

			// Update current elements with next image content
			if (currentImageRef.current && currentBackgroundRef.current) {
				currentImageRef.current.src = loadedImage.src;
				currentBackgroundRef.current.style.backgroundImage = `url(${loadedImage.src})`;
				currentImageRef.current.style.transform = "translateX(0)";
				currentImageRef.current.style.opacity = "1";
				currentBackgroundRef.current.style.transform =
					"translateX(0) scale(1.02)";
				currentBackgroundRef.current.style.opacity = "0.66";
			}

			// Reset next elements
			if (nextBackgroundRef.current && nextImageRef.current) {
				nextBackgroundRef.current.style.backgroundImage = "none";
				if (direction === "next") {
					nextImageRef.current.src =
						"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOU1WCoBwABdQDGakZHEwAAAABJRU5ErkJggg==";
				} else {
					nextImageRef.current.src =
						"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPMa8irBwAEnQHdCzL1gwAAAABJRU5ErkJggg==";
				}
				nextImageRef.current.style.transform = "translateX(0)";
				nextImageRef.current.style.opacity = "0";
				nextBackgroundRef.current.style.transform = "translateX(0) scale(1)";
				nextBackgroundRef.current.style.opacity = "0.5";
			}
		},
		[]
	);

	const updateImage = useCallback(
		async (index: number, direction: "next" | "prev") => {
			if (!galleryData) return;
			setIsLoading(true);
			setError(null);

			const imageSrc = getImageSrc(index);

			try {
				const loadedImage = await loadImageWithRetry(imageSrc);
				await transitionImage(loadedImage, direction);
				setCurrentIndex(index);
			} catch (err) {
				console.error(`Error loading image: ${err}`);
				setError("Failed to load image. Please try again.");
			} finally {
				setIsLoading(false);
			}
		},
		[galleryData, getImageSrc, transitionImage]
	);

	const preloadNextImage = useCallback(
		(index: number) => {
			if (!galleryData) return;
			const nextIndex = (index + 1) % totalImages;
			const imageSrc = getImageSrc(nextIndex);
			loadImageWithRetry(imageSrc);
		},
		[galleryData, totalImages, getImageSrc]
	);

	// Load initial image
	useEffect(() => {
		if (galleryData) {
			updateImage(0, "next");
		}
	}, [galleryData, updateImage]);

	return {
		currentBackgroundRef,
		currentImageRef,
		currentIndex,
		error: error ?? dataError,
		isLoading: isLoading || isDataLoading,
		isInitialLoad,
		nextBackgroundRef,
		nextImageRef,
		preloadNextImage,
		updateImage,
		setIsLoading,
		setIsInitialLoad,
		setError,
		galleryData,
	};
};
