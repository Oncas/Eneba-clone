import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Game } from '../services/api';
import { GameCard } from '../components/game/GameCard';
import { GalleryHeader } from '../components/layout/GalleryHeader';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/layout/EmptyState';
import { GamesGrid } from '../components/layout/GamesGrid';

export const Gallery = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchGames = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await api.getGames(query || undefined);
      setGames(results);
    } catch (err) {
      setError('Failed to load games. Please try again.');
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchGames('');
  }, [searchGames]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchGames(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchGames]);

  return (
    <div className="min-h-screen bg-[#0F0F1E]">
      <GalleryHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!loading && (
          <div className="mb-6 text-gray-400">
            Results found: {games.length}
          </div>
        )}

        {error && <ErrorMessage message={error} className="mb-6" />}

        {loading && <LoadingSpinner className="py-20" />}

        {!loading && games.length === 0 && !error && (
          <EmptyState message="No games found. Try a different search or create a new game listing." />
        )}

        {!loading && games.length > 0 && (
          <GamesGrid>
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </GamesGrid>
        )}
      </main>
    </div>
  );
};
