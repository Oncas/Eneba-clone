import type { Game } from '../services/api';

/**
 * Extracts image array from game object
 * Prefers photoUrls array, falls back to photoUrl
 */
export const getGameImages = (game: Game): string[] => {
  if (game.photoUrls && game.photoUrls.length > 0) {
    return game.photoUrls;
  }
  if (game.photoUrl) {
    return [game.photoUrl];
  }
  return [];
};
