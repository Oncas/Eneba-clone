import { imageUrl } from '../services/api';
import type { Game } from '../services/api';

/**
 * Returns browser-loadable URLs for a game's images
 */
export const getGameImages = (game: Game): string[] => game.photoUrls.map(imageUrl);
