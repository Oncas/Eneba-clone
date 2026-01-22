import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface Game {
  id: number;
  name: string;
  photoUrl: string | null;
  price: number;
  discount: number;
  keyType: string;
  creatorEmail: string;
  createdAt?: string;
  finalPrice: number;
}

export interface CreateGameRequest {
  name: string;
  photoUrl?: string;
  price: number;
  discount?: number;
  keyType: string;
  creatorEmail: string;
}

export const api = {
  // Get all games or search games
  getGames: async (search?: string): Promise<Game[]> => {
    const url = search 
      ? `${API_BASE_URL}/list?search=${encodeURIComponent(search)}`
      : `${API_BASE_URL}/list`;
    const response = await axios.get<Game[]>(url);
    return response.data;
  },

  // Create a new game listing
  createGame: async (gameData: CreateGameRequest): Promise<Game> => {
    const response = await axios.post<Game>(`${API_BASE_URL}/publish`, gameData);
    return response.data;
  },
};
