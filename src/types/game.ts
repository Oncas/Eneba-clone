import { KeyType } from './keyType';

export interface Game {
  id: number;
  name: string;
  photoUrls: string[]; // Public image paths, e.g. /uploads/<name>.jpg
  price: number;
  discount: number;
  keyType: KeyType;
  creatorEmail: string;
  createdAt?: string;
}

export interface GameResponse extends Game {
  finalPrice: number;
}

// A row in the games table. Money is stored as whole cents so it never picks
// up floating point rounding errors; the API converts to and from euros.
export interface GameRow {
  id: number;
  name: string;
  photoUrls: string | null; // JSON array of image paths
  priceCents: number;
  discount: number; // whole percent, 0-100
  keyType: KeyType;
  creatorEmail: string;
  createdAt: string;
}
