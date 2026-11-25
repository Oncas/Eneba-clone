import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { mkdirSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import { initializeDatabase, getDatabase } from './database/init';
import { Game, GameResponse } from './types/game';
import { isValidKeyType, KEY_TYPE_OPTIONS } from './types/keyType';
import { UPLOAD_DIR, UPLOAD_URL_PATH } from './uploads';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Accepted image types and the file extension each one is saved with
const IMAGE_EXTENSIONS = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB, same limit as the frontend
const MAX_IMAGES = 10;

// Images stay in memory until the listing passes validation, so a rejected
// request never leaves files behind in the uploads folder.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE, files: MAX_IMAGES },
  fileFilter: (req, file, cb) => {
    if (IMAGE_EXTENSIONS.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(Object.assign(new Error('Images must be JPEG, PNG, WebP or GIF'), { status: 400 }));
    }
  },
});

mkdirSync(UPLOAD_DIR, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(UPLOAD_URL_PATH, express.static(UPLOAD_DIR));

// Initialize database on startup
initializeDatabase().catch(console.error);

// Helper function to calculate final price
function calculateFinalPrice(price: number, discount: number): number {
  const discountAmount = (price * discount) / 100;
  return Math.round((price - discountAmount) * 100) / 100; // Round to 2 decimal places
}

// Helper function to convert a database row to GameResponse
function toGameResponse(game: any): GameResponse {
  return {
    ...game,
    photoUrls: game.photoUrls ? JSON.parse(game.photoUrls) : [],
    finalPrice: calculateFinalPrice(game.price, game.discount || 0)
  };
}

// Form fields arrive as strings, JSON bodies may send numbers. Returns
// undefined when the value is missing and NaN when it is not a number.
function parseNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value);
  return undefined;
}

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Eneba API is running!' });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// POST /publish - Create a new game listing (multipart/form-data, images in "images")
app.post('/publish', upload.array('images', MAX_IMAGES), async (req: Request, res: Response) => {
  try {
    const gameData = req.body ?? {};
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];

    // Validation
    if (!gameData.name || typeof gameData.name !== 'string' || gameData.name.trim() === '') {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
    }

    const price = parseNumber(gameData.price);
    if (price === undefined || !Number.isFinite(price) || price < 0) {
      return res.status(400).json({ error: 'Price is required and must be a non-negative number' });
    }

    if (!gameData.keyType || typeof gameData.keyType !== 'string' || gameData.keyType.trim() === '') {
      return res.status(400).json({ error: 'KeyType is required and must be a non-empty string' });
    }

    // Validate keyType is a valid enum value
    if (!isValidKeyType(gameData.keyType)) {
      return res.status(400).json({ error: `Invalid keyType. Must be one of: ${KEY_TYPE_OPTIONS.join(', ')}` });
    }

    if (!gameData.creatorEmail || typeof gameData.creatorEmail !== 'string' || gameData.creatorEmail.trim() === '') {
      return res.status(400).json({ error: 'CreatorEmail is required and must be a non-empty string' });
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gameData.creatorEmail)) {
      return res.status(400).json({ error: 'CreatorEmail must be a valid email address' });
    }

    // Set defaults
    const discount = parseNumber(gameData.discount) ?? 0;
    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
      return res.status(400).json({ error: 'Discount must be between 0 and 100' });
    }

    // Save the images under random names and keep their public paths
    const photoUrls: string[] = [];
    for (const file of files) {
      const fileName = crypto.randomUUID() + IMAGE_EXTENSIONS.get(file.mimetype);
      await fs.writeFile(path.join(UPLOAD_DIR, fileName), file.buffer);
      photoUrls.push(`${UPLOAD_URL_PATH}/${fileName}`);
    }

    // Insert into database
    const db = await getDatabase();
    const result = await db.run(
      `INSERT INTO games (name, photoUrls, price, discount, keyType, creatorEmail)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        gameData.name.trim(),
        JSON.stringify(photoUrls),
        price,
        discount,
        gameData.keyType,
        gameData.creatorEmail.trim()
      ]
    );

    // Fetch the created game
    const createdGame = await db.get<any>(
      'SELECT * FROM games WHERE id = ?',
      [result.lastID]
    );

    if (!createdGame) {
      return res.status(500).json({ error: 'Failed to retrieve created game' });
    }

    const response: GameResponse = toGameResponse(createdGame);
    res.status(201).json(response);
  } catch (error: any) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: error.message || 'Internal server error while creating game' });
  }
});

// GET /list - Get all games or search games by name
app.get('/list', async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search as string | undefined;
    const db = await getDatabase();

    let games: Game[];

    if (searchQuery && searchQuery.trim() !== '') {
      // Perform fuzzy search using SQL LIKE
      const results = await db.all(
        `SELECT * FROM games 
         WHERE name LIKE ? 
         ORDER BY name ASC`,
        [`%${searchQuery.trim()}%`]
      );
      games = results as Game[];
    } else {
      // Return all games
      const results = await db.all(
        'SELECT * FROM games ORDER BY createdAt DESC, name ASC'
      );
      games = results as Game[];
    }

    // Convert to GameResponse with finalPrice and parse photoUrls
    const response: GameResponse[] = games.map((game: any) => toGameResponse(game));

    res.json(response);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Internal server error while fetching games' });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  // Upload limits, wrong image types and malformed bodies are client errors
  const status = err instanceof multer.MulterError ? 400 : err.status ?? 500;
  if (status < 500) {
    return res.status(status).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
