export interface Game {
  id: number;
  name: string;
  photoUrl: string | null;
  price: number;
  discount: number;
  keyType: string;
  creatorEmail: string;
  createdAt?: string;
}

export interface CreateGameRequest {
  name: string;
  photoUrl?: string;
  price: number;
  discount?: number;
  keyType: string;
  creatorEmail: string;
}

export interface GameResponse extends Game {
  finalPrice: number;
}
