import { getDatabase, initializeDatabase, closeDatabase } from './init';
import * as fs from 'fs';
import * as path from 'path';
import { UPLOAD_DIR, UPLOAD_URL_PATH } from '../uploads';

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

export async function seedDatabase(): Promise<void> {
  await initializeDatabase();
  const db = await getDatabase();

  const initialImagesPath = path.join(__dirname, '../initial-images');

  // Start from an empty catalogue: remove all games and their uploaded images
  await db.run('DELETE FROM games');
  fs.rmSync(UPLOAD_DIR, { recursive: true, force: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  for (const game of games) {
    const imagePath = path.join(initialImagesPath, game.imageFileName);
    const photoUrls: string[] = [];

    if (fs.existsSync(imagePath)) {
      fs.copyFileSync(imagePath, path.join(UPLOAD_DIR, game.imageFileName));
      photoUrls.push(`${UPLOAD_URL_PATH}/${game.imageFileName}`);
    } else {
      console.warn(`Warning: Image file not found: ${imagePath}. Skipping image for ${game.name}`);
    }

    await db.run(
      `INSERT INTO games (name, photoUrls, price, discount, keyType, creatorEmail)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        game.name,
        JSON.stringify(photoUrls),
        game.price,
        game.discount,
        game.keyType,
        game.creatorEmail
      ]
    );

    console.log(`Seeded game: ${game.name}`);
  }

  console.log(`Seeded ${games.length} games into the database`);

  await closeDatabase();
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}
