import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, getDatabase } from './database/init';
import { CreateGameRequest, Game, GameResponse } from './types/game';
import { isValidKeyType, KEY_TYPE_OPTIONS } from './types/keyType';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
// Increased limit for base64 images (50MB in bytes)
const MAX_PAYLOAD_SIZE = 50 * 1024 * 1024; // 50MB
app.use(express.json({ limit: MAX_PAYLOAD_SIZE }));
app.use(express.urlencoded({ extended: true, limit: MAX_PAYLOAD_SIZE }));

// Initialize database on startup
initializeDatabase().catch(console.error);

// Helper function to calculate final price
function calculateFinalPrice(price: number, discount: number): number {
  const discountAmount = (price * discount) / 100;
  return Math.round((price - discountAmount) * 100) / 100; // Round to 2 decimal places
}

// Helper function to convert Game to GameResponse
function toGameResponse(game: any): GameResponse {
  // Parse photoUrls from JSON string if it's a string
  let photoUrls: string[] | null = null;
  if (game.photoUrls) {
    if (typeof game.photoUrls === 'string') {
      try {
        photoUrls = JSON.parse(game.photoUrls);
      } catch {
        photoUrls = [];
      }
    } else if (Array.isArray(game.photoUrls)) {
      photoUrls = game.photoUrls;
    }
  }
  
  // Fallback to photoUrl if photoUrls is empty/null
  if ((!photoUrls || photoUrls.length === 0) && game.photoUrl) {
    photoUrls = [game.photoUrl];
  }

  return {
    ...game,
    photoUrls,
    finalPrice: calculateFinalPrice(game.price, game.discount || 0)
  };
}

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Eneba API is running!' });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// POST /publish - Create a new game listing
app.post('/publish', async (req: Request, res: Response) => {
  try {
    const gameData: CreateGameRequest = req.body;

    // Validation
    if (!gameData.name || typeof gameData.name !== 'string' || gameData.name.trim() === '') {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
    }

    if (gameData.price === undefined || typeof gameData.price !== 'number' || gameData.price < 0) {
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
    const discount = gameData.discount !== undefined ? gameData.discount : 0;
    if (discount < 0 || discount > 100) {
      return res.status(400).json({ error: 'Discount must be between 0 and 100' });
    }

    // Process base64 images
    const photoUrls: string[] = [];
    if (gameData.photoUrls && Array.isArray(gameData.photoUrls) && gameData.photoUrls.length > 0) {
      // Validate base64 strings
      for (const base64String of gameData.photoUrls) {
        if (typeof base64String === 'string' && base64String.startsWith('data:image/')) {
          photoUrls.push(base64String);
        }
      }
    }

    // Insert into database
    const db = await getDatabase();
    const photoUrlsJson = JSON.stringify(photoUrls);
    const photoUrl = photoUrls.length > 0 ? photoUrls[0] : null; // Keep first image for backward compatibility

    const result = await db.run(
      `INSERT INTO games (name, photoUrl, photoUrls, price, discount, keyType, creatorEmail)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        gameData.name.trim(),
        photoUrl,
        photoUrlsJson,
        gameData.price,
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
  
  // Handle payload too large errors
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ 
      error: `Payload too large. Maximum size is ${MAX_PAYLOAD_SIZE / (1024 * 1024)}MB. Your request was ${(err.length / (1024 * 1024)).toFixed(2)}MB.` 
    });
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
