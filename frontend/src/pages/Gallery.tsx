import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Game } from '../services/api';
import { GameCard } from '../components/GameCard';

export const Gallery = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Debounced search function
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

  // Load games on mount
  useEffect(() => {
    searchGames('');
  }, [searchGames]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchGames(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, searchGames]);

  return (
    <div className="min-h-screen bg-[#0F0F1E]">
      {/* Header */}
      <header className="bg-[#1A1A2E] border-b border-[#2D2D44] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Eneba</h1>
            <button
              onClick={() => navigate('/create')}
              className="bg-[#6B46C1] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              + Create Game
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F0F1E] border border-[#2D2D44] rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-gray-400">
            Results found: {games.length}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B46C1]"></div>
          </div>
        )}

        {/* Games Grid */}
        {!loading && games.length === 0 && !error && (
          <div className="text-center py-20 text-gray-400">
            No games found. Try a different search or create a new game listing.
          </div>
        )}

        {!loading && games.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
