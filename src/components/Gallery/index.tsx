// src/components/Gallery/index.tsx

"use client";

import React from "react";

import { GalleryProvider } from "../../context/GalleryContext";
import GalleryContent from "./GalleryContent";

const Gallery: React.FC = () => (
	<GalleryProvider>
		<GalleryContent />
	</GalleryProvider>
);

export default Gallery;
