import axios from "axios";
import type { KeyType } from "../types/keyType";

const API_BASE_URL = "http://localhost:3000";

export interface Game {
  id: number;
  name: string;
  photoUrl: string | null; // Legacy field
  photoUrls: string[] | null; // Array of image URLs
  price: number;
  discount: number;
  keyType: KeyType;
  creatorEmail: string;
  createdAt?: string;
  finalPrice: number;
}

export interface CreateGameRequest {
  name: string;
  price: number;
  discount?: number;
  keyType: KeyType;
  creatorEmail: string;
  photoUrls?: string[]; // Array of base64 image strings
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
    const response = await axios.post<Game>(
      `${API_BASE_URL}/publish`,
      gameData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },
};
