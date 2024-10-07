// src/components/ThumbnailView.tsx

"use client";

import { useGalleryData } from "@/hooks/useGalleryData";
import React, { useCallback, useRef } from "react";
import ThumbnailCard from "./Gallery/ThumbnailCard";

interface ThumbnailViewProps {
	currentIndex: number;
	onThumbnailClick: (index: number) => void;
	isVisible: boolean;
	items: number[];
	hasMore: boolean;
	isLoading: boolean;
	onLoadMore: () => void;
	toggleMarkForDeletion: (index: number) => void;
	markedForDeletion: Set<number>;
}

const ThumbnailView: React.FC<ThumbnailViewProps> = ({
	currentIndex,
	onThumbnailClick,
	isVisible,
	items,
	hasMore,
	isLoading,
	onLoadMore,
	toggleMarkForDeletion,
	markedForDeletion,
}) => {
	const { galleryData } = useGalleryData();
	const scrollRef = useRef<HTMLDivElement>(null);

	const lastItemRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (node && hasMore && !isLoading) {
				const observer = new IntersectionObserver(
					entries => {
						if (entries[0].isIntersecting) {
							onLoadMore();
						}
					},
					{ threshold: 1 }
				);
				observer.observe(node);
				return () => observer.disconnect();
			}
		},
		[hasMore, isLoading, onLoadMore]
	);

	if (!isVisible || !galleryData) return null;

	return (
		<div
			ref={scrollRef}
			className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto p-4"
		>
			<div className="container mx-auto">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{items.map((index, arrayIndex) => (
						<div
							key={index}
							ref={arrayIndex === items.length - 1 ? lastItemRef : null}
						>
							<ThumbnailCard
								image={{
									variants: {
										"320": {
											filename:
												galleryData.images[index].variants["320"].filename,
										},
									},
									comment: galleryData.images[index].comment,
								}}
								isSelected={index === currentIndex}
								onClick={() => onThumbnailClick(index)}
								toggleMarkForDeletion={() => toggleMarkForDeletion(index)}
								isMarkedForDeletion={markedForDeletion.has(index)}
							/>
						</div>
					))}
				</div>
			</div>
			{isLoading && (
				<div className="text-center py-4">
					<div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}
			{!hasMore && !isLoading && (
				<div className="text-center py-4 text-white">No more images</div>
			)}
		</div>
	);
};

export default ThumbnailView;
