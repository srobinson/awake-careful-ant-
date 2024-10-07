// src/utils/config.ts

// export const CONFIG = {
//   TOTAL_IMAGES: 86,
//   PROGRESS_BAR_DURATION: 5000,
//   MIN_DISPLAY_TIME: 500,
//   THUMBNAIL_WIDTH: 150,
//   THUMBNAIL_BUFFER_SIZE: 2,
//   ITEMS_PER_PAGE: 70,
//   TRANSITION_DURATION: 600,
//   PRELOAD_OFFSET: 1,
//   INITIAL_SCALE: 0.95,
//   BACKGROUND_SCALE: 1.1,
//   SLIDE_PERCENTAGE: 5,
// };

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
