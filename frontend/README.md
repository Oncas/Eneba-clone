# Eneba Frontend

React + TypeScript frontend for the Eneba game key marketplace.

## Features

- **Gallery Page**: Search and browse game listings in a responsive grid
- **Create Game Page**: Add new game listings to the marketplace
- **Real-time Search**: Debounced search that queries the backend API as you type
- **Dark Purple Theme**: Matches the Eneba aesthetic

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure the backend server is running on `http://localhost:3000`

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── GameCard.tsx      # Game card component
│   ├── pages/
│   │   ├── Gallery.tsx       # Main gallery/search page
│   │   └── CreateGame.tsx    # Create game form page
│   ├── services/
│   │   └── api.ts            # API service layer
│   ├── App.tsx               # Main app with routing
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles with Tailwind
├── public/                   # Static assets
└── package.json
```

## API Integration

The frontend communicates with the backend API at `http://localhost:3000`:
- `GET /list?search=query` - Get games (with optional search)
- `POST /publish` - Create a new game listing
