import type { Game } from '../services/api';

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const discountPercentage = game.discount > 0 ? `-${Math.round(game.discount)}%` : '';
  const originalPrice = game.price.toFixed(2);
  const finalPrice = game.finalPrice.toFixed(2);

  return (
    <div className="bg-[#1A1A2E] rounded-lg overflow-hidden border border-[#2D2D44] hover:border-[#6B46C1] transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20">
      {/* Game Image */}
      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-purple-900/20 to-blue-900/20 overflow-hidden">
        {game.photoUrl ? (
          <img
            src={game.photoUrl}
            alt={game.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x400/6B46C1/FFFFFF?text=' + encodeURIComponent(game.name);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-blue-900/30">
            <span className="text-4xl font-bold text-purple-400">{game.name.charAt(0)}</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {game.discount > 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
            {discountPercentage}
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="p-4">
        {/* Game Name */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem]">
          {game.name}
        </h3>

        {/* Key Type */}
        <div className="mb-3">
          <span className="text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
            {game.keyType}
          </span>
        </div>

        {/* Pricing */}
        <div className="space-y-1">
          {game.discount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 line-through">
                €{originalPrice}
              </span>
              <span className="text-xs text-green-400 font-semibold">
                {discountPercentage}
              </span>
            </div>
          )}
          <div className="text-2xl font-bold text-white">
            €{finalPrice}
          </div>
        </div>
      </div>
    </div>
  );
};
