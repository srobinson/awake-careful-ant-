// src/utils/config.ts

export const CONFIG = {
	// Start the transitioning on page load
	AUTO_START: false,

	// Path to the background images
	BACKGROUND_PATH: "/assets/",

	// Path to the main images
	IMAGE_PATH: "/assets/",

	// Number of items to load per page in the thumbnail view
	ITEMS_PER_PAGE: 20,

	// Keyboard shortcuts
	KEYS: {
		FULLSCREEN: "f",
		HELP: "h",
		NEXT: "ArrowRight",
		PAUSE: " ",
		PREV: "ArrowLeft", // Space key
	},

	MARK_CONTROLS_ENABLED: false,

	// Maximum number of retries for image loading
	MAX_LOAD_RETRIES: 3,

	// TODO: Same as TRANSITION_DURATION?
	MIN_DISPLAY_TIME: 600,

	// Duration of the progress bar in milliseconds
	PROGRESS_BAR_DURATION: 15000,

	// Delay between retries in milliseconds
	RETRY_DELAY: 1000,

	// Total number of images in the gallery
	TOTAL_IMAGES: 86,

	// Transition duration for image changes in milliseconds
	TRANSITION_DURATION: 500,
};
