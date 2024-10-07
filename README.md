# Awake Careful Ant

## Introduction

Awake Careful Ant is a React-based application designed to showcase AI-generated images in an interactive gallery format. This project leverages modern web technologies to provide a seamless and engaging user experience, allowing users to navigate through images, mark them for deletion, and manage their viewing preferences.

This application was fully developed using Cursor and Claude 3.5 over the course of a weekend as an experimental project.

## Features

- Interactive image gallery with thumbnail navigation
- Fullscreen mode for immersive viewing
- Mark images for deletion with visual indicators
- Export list of marked images
- Gesture support for intuitive navigation
- Dynamic loading of images with preloading for smooth transitions

## Tech Stack

- React, TypeScript
- Context API for state management
- Intersection Observer for lazy loading
- Hammer.js for gesture recognition
- Cloudflare for hosting and CDN

## Setup and Usage

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/awake-careful-ant.git
   cd awake-careful-ant
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Start the production server**:
   ```bash
   npm start
   ```

## Development

- Make changes in the `src/` directory
- Use `npm run lint` for code style checks
- Use `npm run build` to compile TypeScript
- Use `npm run dev` for development with auto-restart

## Project Structure

```
awake-careful-ant/
├── src/
│   ├── components/
│   │   ├── Gallery/
│   │   │   ├── Controls.tsx
│   │   │   ├── GalleryContent.tsx
│   │   │   ├── ImageDisplay.tsx
│   │   │   ├── ThumbnailView.tsx
│   │   │   └── index.tsx
│   ├── context/
│   │   └── GalleryContext.tsx
│   ├── hooks/
│   │   ├── useControlsManager.ts
│   │   ├── useGalleryData.ts
│   │   ├── useGestures.ts
│   │   ├── useImageManager.ts
│   │   └── useNavigationManager.ts
│   ├── utils/
│   │   └── config.ts
│   └── pages/
│       ├── layout.tsx
│       └── page.tsx
├── package.json
└── README.md
```

## Configuration

- **`src/utils/config.ts`**: Contains configuration constants such as image paths, transition durations, and keyboard shortcuts.

## License

MIT License
