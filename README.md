# Eneba clone

A small game key marketplace inspired by Eneba. Sellers list a game key with a
price, discount and platform; buyers browse the gallery and search it by name.

This is a practice project. It is not affiliated with Eneba.

- **Backend:** Node.js, Express and TypeScript, with a SQLite database
- **Frontend:** React, TypeScript, Vite, Tailwind CSS and React Router

## Run it

You need Node.js 20.19 or newer. Start the backend and the frontend in two
terminals.

```sh
# Terminal 1: backend on http://localhost:3000
npm install
npm run seed      # creates database.sqlite with 3 sample games
npm run dev
```

```sh
# Terminal 2: frontend on http://localhost:5173
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

## Pages

- `/` - gallery of listed games, with a search box that queries the API as
  you type
- `/create` - form to list a new game key, with image upload

## API

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/list` | All games, newest first |
| GET | `/list?search=split` | Games whose name contains the search text |
| POST | `/publish` | Create a listing |
| GET | `/health` | Health check |

Every game in a response includes `finalPrice`, the price after the discount.

`POST /publish` takes JSON like this:

```json
{
  "name": "Split Fiction",
  "price": 49.99,
  "discount": 10,
  "keyType": "Steam",
  "creatorEmail": "seller@example.com",
  "photoUrls": ["data:image/jpeg;base64,..."]
}
```

- `name`, `price`, `keyType` and `creatorEmail` are required.
- `price` must be 0 or more and `discount` between 0 and 100 (default 0).
- `keyType` is one of: Steam, Epic Games, Xbox Live, PlayStation, Nintendo,
  GOG, Origin, Uplay, Battle.net, Other.
- Invalid input returns `400` with an `error` message.

## Project layout

```
src/            backend: Express app, database setup and seed data
frontend/src/   React app: pages, components and the API client
```
