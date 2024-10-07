// src/hooks/useControlsManager.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import { useGalleryContext } from "../context/GalleryContext";

export const useControlsManager = () => {
	const { state, dispatch } = useGalleryContext();
	const [controlsState, setControlsState] = useState({
		isControlsVisible: true,
		isFullscreen: false,
		isHelpModalOpen: false,
		isThumbnailViewActive: false,
	});

	const toggleState = (key: keyof typeof controlsState) => {
		setControlsState(prev => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const toggleFullscreen = useCallback(() => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(err => {
				console.error(`Error attempting to enable fullscreen: ${err.message}`);
			});
		} else {
			document.exitFullscreen?.();
		}
	}, []);

	useEffect(() => {
		const handleFullscreenChange = () => {
			setControlsState(prev => ({
				...prev,
				isFullscreen: !!document.fullscreenElement,
			}));
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, []);

	const toggleHelpModal = useCallback(() => toggleState("isHelpModalOpen"), []);
	const toggleThumbnailView = useCallback(() => {
		setControlsState(prev => {
			const newThumbnailViewState = !prev.isThumbnailViewActive;
			dispatch({ payload: newThumbnailViewState, type: "SET_PAUSED" });
			return { ...prev, isThumbnailViewActive: newThumbnailViewState };
		});
	}, [dispatch]);

	const closeThumbnailView = useCallback(() => {
		setControlsState(prev => ({
			...prev,
			isThumbnailViewActive: false,
		}));
	}, []);

	const toggleControls = useCallback(
		() => toggleState("isControlsVisible"),
		[]
	);

	const togglePause = useCallback(() => {
		if (controlsState.isThumbnailViewActive && !state.isPaused) return;
		dispatch({ payload: !state.isPaused, type: "SET_PAUSED" });
	}, [dispatch, state.isPaused, controlsState.isThumbnailViewActive]);

	return {
		closeThumbnailView,
		controlsState,
		toggleControls,
		toggleFullscreen,
		toggleHelpModal,
		togglePause,
		toggleThumbnailView,
	};
};
