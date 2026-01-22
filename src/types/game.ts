import { KeyType } from './keyType';

export interface Game {
  id: number;
  name: string;
  photoUrl: string | null; // Legacy field, kept for backward compatibility
  photoUrls: string[] | null; // Array of base64 image strings (data URIs)
  price: number;
  discount: number;
  keyType: KeyType;
  creatorEmail: string;
  createdAt?: string;
}

export interface CreateGameRequest {
  name: string;
  photoUrl?: string; // Legacy field
  photoUrls?: string[]; // Array of base64 image strings (data URIs)
  price: number;
  discount?: number;
  keyType: KeyType;
  creatorEmail: string;
}

export interface GameResponse extends Game {
  finalPrice: number;
}
