"use client"; // Add this at the top of the file

import React, {
	createContext,
	ReactNode,
	useContext,
	useMemo,
	useReducer,
	useState,
} from "react";

type GalleryState = {
	currentIndex: number;
	error: string | null;
	isInitialLoad: boolean;
	isLoading: boolean;
	isPaused: boolean;
	progress: number;
	currentImage: any | null; // Store the current image object
};

type GalleryAction =
	| { type: "SET_CURRENT_INDEX"; payload: number }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_INITIAL_LOAD"; payload: boolean }
	| { type: "SET_PAUSED"; payload: boolean }
	| { type: "SET_PROGRESS"; payload: number }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "SET_CURRENT_IMAGE"; payload: any | null }; // Add this case

const initialState: GalleryState = {
	currentIndex: 0,
	error: null,
	isInitialLoad: true,
	isLoading: true,
	isPaused: true,
	progress: 0,
	currentImage: null, // Initialize with null
};

const galleryReducer = (
	state: GalleryState,
	action: GalleryAction
): GalleryState => {
	switch (action.type) {
		case "SET_CURRENT_INDEX":
			return { ...state, currentIndex: action.payload };
		case "SET_LOADING":
			return { ...state, isLoading: action.payload };
		case "SET_INITIAL_LOAD":
			return { ...state, isInitialLoad: action.payload };
		case "SET_PAUSED":
			return { ...state, isPaused: action.payload };
		case "SET_PROGRESS":
			return { ...state, progress: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload };
		case "SET_CURRENT_IMAGE": // Add this case
			return { ...state, currentImage: action.payload };
		default:
			return state;
	}
};

const GalleryContext = createContext<
	| {
			state: GalleryState;
			dispatch: React.Dispatch<GalleryAction>;
			markedForDeletion: Set<number>;
			setMarkedForDeletion: React.Dispatch<React.SetStateAction<Set<number>>>;
	  }
	| undefined
>(undefined);

export const GalleryProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(galleryReducer, initialState);
	const [markedForDeletion, setMarkedForDeletion] = useState<Set<number>>(
		new Set()
	);

	const value = useMemo(
		() => ({ state, dispatch, markedForDeletion, setMarkedForDeletion }),
		[state, dispatch, markedForDeletion]
	);

	return (
		<GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
	);
};

export const useGalleryContext = () => {
	const context = useContext(GalleryContext);
	if (context === undefined) {
		throw new Error("useGalleryContext must be used within a GalleryProvider");
	}
	return context;
};
