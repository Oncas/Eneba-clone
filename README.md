# Eneba Clone

A full-stack game key marketplace application with a Node.js/Express backend and React frontend.

## Project Overview

- **Backend**: Node.js with TypeScript, Express.js, and SQLite
- **Frontend**: React with TypeScript, Tailwind CSS, and React Router

## Project Structure

```
Eneba-clone/
├── src/                      # Backend source code
│   ├── database/
│   │   ├── init.ts          # Database initialization script
│   │   └── seed.ts          # Database seeding script
│   ├── types/
│   │   └── game.ts          # TypeScript interfaces for Game objects
│   └── app.ts               # Express application entry point
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── ...
│   └── ...
├── dist/                    # Compiled backend JavaScript (generated)
├── database.sqlite          # SQLite database file (generated)
├── tsconfig.json            # Backend TypeScript configuration
├── package.json             # Backend dependencies and scripts
└── README.md               # This file
```

## Database Schema

The `games` table has the following columns:
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `name` (TEXT NOT NULL)
- `photoUrl` (TEXT)
- `price` (REAL NOT NULL)
- `discount` (REAL DEFAULT 0)
- `keyType` (TEXT NOT NULL)
- `creatorEmail` (TEXT NOT NULL)
- `createdAt` (DATETIME DEFAULT CURRENT_TIMESTAMP)

## Setup Instructions

### Backend Setup

1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Seed the database with initial games:
   ```bash
   npm run seed
   ```


The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```


The frontend will run on `http://localhost:5173` (or another port if 5173 is taken)

### Running the Full Application

1. Start the backend server (from root directory):
   ```bash
   npm run dev
   ```

2. Start the frontend server (in a new terminal, from frontend directory):
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser to the frontend URL (usually `http://localhost:5173`)

## Available Scripts

### Backend Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled JavaScript
- `npm run dev` - Run the development server with ts-node
- `npm run seed` - Seed the database with initial game data

### Frontend Scripts (from `frontend/` directory)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

### POST /publish
Creates a new game listing.

**Request Body:**
```json
{
  "name": "Game Name",
  "photoUrl": "https://example.com/image.jpg",  // Optional
  "price": 59.99,
  "discount": 10,  // Optional, defaults to 0
  "keyType": "Steam",
  "creatorEmail": "seller@example.com"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Game Name",
  "photoUrl": "https://example.com/image.jpg",
  "price": 59.99,
  "discount": 10,
  "keyType": "Steam",
  "creatorEmail": "seller@example.com",
  "createdAt": "2024-01-01 12:00:00",
  "finalPrice": 53.99
}
```

### GET /list
Retrieves all games or searches games by name.

**Query Parameters:**
- `search` (optional): Search term for fuzzy matching on game names

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "FIFA 23",
    "photoUrl": "https://example.com/fifa23.jpg",
    "price": 59.99,
    "discount": 10,
    "keyType": "Steam",
    "creatorEmail": "seller1@example.com",
    "createdAt": "2024-01-01 12:00:00",
    "finalPrice": 53.99
  }
]
```

**Examples:**
- Get all games: `GET /list`
- Search games: `GET /list?search=split`

## Validation Rules

POST /publish validates:
- `name`: Required, non-empty string
- `price`: Required, non-negative number
- `keyType`: Required, non-empty string
- `creatorEmail`: Required, valid email format
- `discount`: Optional, must be between 0 and 100 (defaults to 0)
- `photoUrl`: Optional string

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `400 Bad Request` - Validation errors
- `404 Not Found` - Route not found
- `500 Internal Server Error` - Server errors

## Frontend Features

- **Gallery Page**: Search and browse game listings in a responsive grid layout
- **Create Game Page**: Form to add new game listings to the marketplace
- **Real-time Search**: Debounced search that queries the backend API as you type
- **Dark Purple Theme**: Matches the Eneba aesthetic with a modern UI

## Initial Games

The database is seeded with 3 games:
1. FIFA 23
2. Red Dead Redemption 2
3. Split Fiction
