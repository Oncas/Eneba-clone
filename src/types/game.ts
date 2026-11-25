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

