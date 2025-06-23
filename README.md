# AstroPic

AstroPic is a web application that displays NASA's Astronomy Picture of the Day (APOD) and related information in a visually appealing way. Built with React, Vite, and TypeScript, it provides a modern, fast, and responsive user experience.

## Features

- Fetches and displays NASA's APOD with title, image, and description
- Responsive card-based UI for browsing multiple APODs
- Loading and error handling components for smooth UX
- Modular and reusable React components
- TypeScript for type safety
- Vite for fast development and optimized builds

## Project Structure

```
AstroPic/
├── app/
│   ├── app.css                # Global styles
│   ├── root.tsx               # Main app entry
│   ├── routes.ts              # App routes
│   ├── components/            # UI components
│   │   ├── APODCards.tsx      # APOD card list
│   │   ├── ErrorMessage.tsx   # Error display
│   │   ├── LoadingSpinner.tsx # Loading indicator
│   │   └── ui/
│   │       └── button.tsx     # Button component
│   ├── lib/
│   │   ├── apod.types.ts      # TypeScript types for APOD
│   │   └── utils.ts           # Utility functions
│   └── routes/
│       └── home.tsx           # Home page route
├── desenferrujando/           # (Custom or additional routes)
│   └── home.tsx
├── public/
│   └── favicon.ico            # App icon
├── package.json               # Project metadata and scripts
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
├── vercel.json                # Vercel deployment config
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone <repo-url>
   cd AstroPic
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

### Development

Start the development server:

```sh
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Build

To build the app for production:

```sh
npm run build
# or
yarn build
```

The output will be in the `dist/` directory.

### Deployment

This project is ready for deployment on [Vercel](https://vercel.com/). The `vercel.json` is configured for static builds using Vite.

## Configuration

- **API Keys:** If the app requires a NASA API key, set it in your environment variables or configuration as needed.
- **Routes:** App routes are defined in `app/routes.ts` and `app/routes/`.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build locally

## License

MIT

## Credits

- [NASA APOD API](https://api.nasa.gov/)
- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), and [TypeScript](https://www.typescriptlang.org/)
