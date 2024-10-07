// src/app/page.tsx

"use client";

import React from "react";

import Gallery from "../components/Gallery";

const Page: React.FC = () => {
	if (typeof window === "undefined") return;
	return <Gallery />;
};

export default Page;
