// src/hooks/useGalleryData.ts

"use client";

import { useEffect, useState } from "react";

interface ImageVariant {
	width: number;
	height: number;
	filename: string;
}

interface GalleryImage {
	filename: string;
	author: string;
	comment: string;
	midjourneyInstructions: string;
	variants: {
		[key: string]: ImageVariant;
	};
}

interface GalleryData {
	totalImages: number;
	images: GalleryImage[];
}

const fetchGalleryData = async (): Promise<GalleryData> => {
	const response = await fetch("https://i.awake-careful-ant.com/gallery.json");
	if (!response.ok) {
		throw new Error("Failed to fetch gallery data");
	}
	return response.json();
};

export const useGalleryData = () => {
	const [galleryData, setGalleryData] = useState<GalleryData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadGalleryData = async () => {
			try {
				const data = await fetchGalleryData();
				// data.images = shuffleArray(data.images);
				setGalleryData(data);
			} catch (err) {
				setError("Error fetching gallery data");
			} finally {
				setIsLoading(false);
			}
		};

		loadGalleryData();
	}, []);

	return { galleryData, isLoading, error };
};
