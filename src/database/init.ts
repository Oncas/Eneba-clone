import path from 'path';
import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbPath = path.join(__dirname, '../../database.sqlite');

let db: Database | null = null;

export async function initializeDatabase(): Promise<void> {
  if (!db) {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
  }

  // Create games table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      photoUrl TEXT,
      photoUrls TEXT,
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      keyType TEXT NOT NULL,
      creatorEmail TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add photoUrls column if it doesn't exist (migration for existing databases)
  try {
    await db.exec(`
      ALTER TABLE games ADD COLUMN photoUrls TEXT
    `);
  } catch (error: any) {
    // Column already exists, ignore the error
    if (!error.message?.includes('duplicate column')) {
      console.warn('Migration warning:', error.message);
    }
  }

  // Migrate existing photoUrl to photoUrls array if photoUrls is null
  await db.exec(`
    UPDATE games 
    SET photoUrls = CASE 
      WHEN photoUrl IS NOT NULL AND photoUrl != '' THEN json_array(photoUrl)
      ELSE json_array()
    END
    WHERE photoUrls IS NULL
  `);

  console.log('Database initialized successfully');
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}

export async function getDatabase(): Promise<Database> {
  if (!db) {
    await initializeDatabase();
  }
  return db!;
}
