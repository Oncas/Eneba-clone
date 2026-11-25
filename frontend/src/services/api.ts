import axios from "axios";
import type { KeyType } from "../types/keyType";

const API_BASE_URL = "http://localhost:3000";

export interface Game {
  id: number;
  name: string;
  photoUrls: string[]; // Image paths on the API server, e.g. /uploads/<name>.jpg
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
  images: File[];
}

// Turns an image path from the API into a URL the browser can load
export const imageUrl = (path: string): string => `${API_BASE_URL}${path}`;

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
  // Sent as multipart/form-data so the images travel as real files. The
  // browser sets the Content-Type header, including the multipart boundary.
  createGame: async (gameData: CreateGameRequest): Promise<Game> => {
    const form = new FormData();
    form.append("name", gameData.name);
    form.append("price", String(gameData.price));
    form.append("discount", String(gameData.discount ?? 0));
    form.append("keyType", gameData.keyType);
    form.append("creatorEmail", gameData.creatorEmail);
    gameData.images.forEach((file) => form.append("images", file));

    const response = await axios.post<Game>(`${API_BASE_URL}/publish`, form);
    return response.data;
  },
};
