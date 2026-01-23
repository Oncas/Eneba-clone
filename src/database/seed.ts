import { getDatabase, initializeDatabase, closeDatabase } from './init';
import * as fs from 'fs';
import * as path from 'path';

interface Game {
  name: string;
  imageFileName: string;
  price: number;
  discount: number;
  keyType: string;
  creatorEmail: string;
}

const games: Game[] = [
  {
    name: 'FIFA 23',
    imageFileName: 'game-000002.jpg',
    price: 59.99,
    discount: 10,
    keyType: 'Steam',
    creatorEmail: 'seller1@example.com'
  },
  {
    name: 'Red Dead Redemption 2',
    imageFileName: 'game-000003.jpg',
    price: 39.99,
    discount: 20,
    keyType: 'Epic Games',
    creatorEmail: 'seller2@example.com'
  },
  {
    name: 'Split Fiction',
    imageFileName: 'game-000001.jpg',
    price: 29.99,
    discount: 0,
    keyType: 'Steam',
    creatorEmail: 'seller3@example.com'
  }
];

/**
 * Converts an image file to base64 data URI
 */
function imageToBase64(imagePath: string): string {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64String = imageBuffer.toString('base64');
    // Determine MIME type from file extension
    const mimeType = imagePath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error(`Error reading image file ${imagePath}:`, error);
    throw error;
  }
}

export async function seedDatabase(): Promise<void> {
  await initializeDatabase();
  const db = await getDatabase();

  // Get the temp folder path (relative to project root)
  const tempFolderPath = path.join(__dirname, '../initial-images');

  // Clear existing data (optional - remove if you want to keep existing data)
  await db.run('DELETE FROM games');

  // Insert games with base64 images
  for (const game of games) {
    const imagePath = path.join(tempFolderPath, game.imageFileName);
    
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      console.warn(`Warning: Image file not found: ${imagePath}. Skipping image for ${game.name}`);
      // Insert game without image
      await db.run(
        `INSERT INTO games (name, photoUrl, photoUrls, price, discount, keyType, creatorEmail)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          game.name,
          null,
          JSON.stringify([]),
          game.price,
          game.discount,
          game.keyType,
          game.creatorEmail
        ]
      );
      continue;
    }

    // Convert image to base64
    const base64Image = imageToBase64(imagePath);
    const photoUrls = [base64Image];
    const photoUrlsJson = JSON.stringify(photoUrls);
    const photoUrl = base64Image; // First image for backward compatibility

    await db.run(
      `INSERT INTO games (name, photoUrl, photoUrls, price, discount, keyType, creatorEmail)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        game.name,
        photoUrl,
        photoUrlsJson,
        game.price,
        game.discount,
        game.keyType,
        game.creatorEmail
      ]
    );

    console.log(`Seeded game: ${game.name} with image from ${game.imageFileName}`);
  }

  console.log(`Seeded ${games.length} games into the database`);

  await closeDatabase();
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}
