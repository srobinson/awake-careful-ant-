// src/hooks/useNavigationManager.ts

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CONFIG } from "@/utils/config";

import { useGalleryContext } from "../context/GalleryContext";

export const useNavigationManager = () => {
	const { state } = useGalleryContext();
	const [progress, setProgress] = useState(0);
	const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const lastUpdateTimeRef = useRef<number | null>(null);

	const startProgress = useCallback(() => {
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current);
		}

		lastUpdateTimeRef.current = Date.now();
		progressIntervalRef.current = setInterval(() => {
			const now = Date.now();
			const elapsed = now - (lastUpdateTimeRef.current ?? now);
			lastUpdateTimeRef.current = now;

			setProgress(prevProgress => {
				const newProgress =
					prevProgress + (elapsed / CONFIG.PROGRESS_BAR_DURATION) * 100;
				return newProgress >= 100 ? 100 : newProgress;
			});
		}, 100);
	}, []);

	const stopProgress = useCallback(() => {
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current);
			progressIntervalRef.current = null;
		}
	}, []);

	const resetProgress = useCallback(() => {
		setProgress(0);
		if (!state.isPaused) {
			startProgress();
		}
	}, [state.isPaused, startProgress]);

	useEffect(() => {
		if (state.isPaused) {
			stopProgress();
		} else {
			startProgress();
		}

		return () => {
			stopProgress();
		};
	}, [state.isPaused, startProgress, stopProgress]);

	return {
		progress,
		resetProgress,
		setProgress,
		startProgress,
		stopProgress,
	};
};
