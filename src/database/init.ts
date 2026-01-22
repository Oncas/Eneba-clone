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
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      keyType TEXT NOT NULL,
      creatorEmail TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
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
