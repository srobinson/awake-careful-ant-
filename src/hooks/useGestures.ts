// src/hooks/useGestures.ts

"use client";

import { useCallback, useEffect, useRef } from "react";

export interface GestureHandlers {
	onSwipeLeft?: () => void;
	onSwipeRight?: () => void;
	onSwipeUp?: () => void;
	onSwipeDown?: () => void;
	onTap?: () => void;
	onDoubleTap?: () => void;
	onPinchIn?: () => void;
	onPinchOut?: () => void;
}

export const useGestures = (handlers: GestureHandlers) => {
	const hammerRef = useRef<HammerManager | null>(null);

	const setupHammer = async () => {
		const Hammer = (await import("hammerjs")).default;
		const element = document.body;
		hammerRef.current = new Hammer(element);

		const hammer = hammerRef.current;

		hammer.get("swipe").set({
			direction: Hammer.DIRECTION_ALL,
			threshold: 10,
			velocity: 0.65,
		});
		hammer.get("pinch").set({ enable: true });

		// Adjust tap settings
		hammer.get("tap").set({ time: 250, threshold: 9, posThreshold: 10 });
		hammer.get("doubletap").set({ interval: 300 });

		// Improve gesture recognition order
		const tap = hammer.get("tap");
		const doubleTap = hammer.get("doubletap");
		const swipe = hammer.get("swipe");

		tap.requireFailure(doubleTap);
		swipe.requireFailure([tap, doubleTap]);

		hammer.on("swipeleft", () => handlers.onSwipeLeft?.());
		hammer.on("swiperight", () => handlers.onSwipeRight?.());
		hammer.on("swipeup", () => handlers.onSwipeUp?.());
		hammer.on("swipedown", () => handlers.onSwipeDown?.());
		hammer.on("tap", () => handlers.onTap?.());
		hammer.on("doubletap", () => handlers.onDoubleTap?.());
		hammer.on("pinchin", () => handlers.onPinchIn?.());
		hammer.on("pinchout", () => handlers.onPinchOut?.());
	};

	useEffect(() => {
		if (typeof window === "undefined") return;

		setupHammer();

		return () => {
			if (hammerRef.current) {
				hammerRef.current.destroy();
			}
		};
	}, [handlers]);

	const triggerGesture = useCallback(
		(gestureType: keyof GestureHandlers) => {
			if (typeof window !== "undefined") {
				handlers[gestureType]?.();
			}
		},
		[handlers]
	);

	return { triggerGesture };
};
