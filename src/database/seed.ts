import { getDatabase, initializeDatabase, closeDatabase } from './init';

interface Game {
  name: string;
  photoUrl: string;
  price: number;
  discount: number;
  keyType: string;
  creatorEmail: string;
}

const games: Game[] = [
  {
    name: 'FIFA 23',
    photoUrl: 'https://example.com/fifa23.jpg',
    price: 59.99,
    discount: 10,
    keyType: 'Steam',
    creatorEmail: 'seller1@example.com'
  },
  {
    name: 'Red Dead Redemption 2',
    photoUrl: 'https://example.com/rdr2.jpg',
    price: 39.99,
    discount: 20,
    keyType: 'Epic Games',
    creatorEmail: 'seller2@example.com'
  },
  {
    name: 'Split Fiction',
    photoUrl: 'https://example.com/split-fiction.jpg',
    price: 29.99,
    discount: 0,
    keyType: 'Steam',
    creatorEmail: 'seller3@example.com'
  }
];

export async function seedDatabase(): Promise<void> {
  await initializeDatabase();
  const db = await getDatabase();

  // Clear existing data (optional - remove if you want to keep existing data)
  await db.run('DELETE FROM games');

  // Insert games
  for (const game of games) {
    await db.run(
      `INSERT INTO games (name, photoUrl, price, discount, keyType, creatorEmail)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        game.name,
        game.photoUrl,
        game.price,
        game.discount,
        game.keyType,
        game.creatorEmail
      ]
    );
  }

  console.log(`Seeded ${games.length} games into the database`);

  await closeDatabase();
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}
