import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, getDatabase } from './database/init';
import { CreateGameRequest, Game, GameResponse } from './types/game';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database on startup
initializeDatabase().catch(console.error);

// Helper function to calculate final price
function calculateFinalPrice(price: number, discount: number): number {
  const discountAmount = (price * discount) / 100;
  return Math.round((price - discountAmount) * 100) / 100; // Round to 2 decimal places
}

// Helper function to convert Game to GameResponse
function toGameResponse(game: Game): GameResponse {
  return {
    ...game,
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

    const photoUrl = gameData.photoUrl || null;

    // Insert into database
    const db = await getDatabase();
    const result = await db.run(
      `INSERT INTO games (name, photoUrl, price, discount, keyType, creatorEmail)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        gameData.name.trim(),
        photoUrl,
        gameData.price,
        discount,
        gameData.keyType.trim(),
        gameData.creatorEmail.trim()
      ]
    );

    // Fetch the created game
    const createdGame = await db.get<Game>(
      'SELECT * FROM games WHERE id = ?',
      [result.lastID]
    );

    if (!createdGame) {
      return res.status(500).json({ error: 'Failed to retrieve created game' });
    }

    const response: GameResponse = toGameResponse(createdGame);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal server error while creating game' });
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

    // Convert to GameResponse with finalPrice
    const response: GameResponse[] = games.map(toGameResponse);

    res.json(response);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Internal server error while fetching games' });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
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
