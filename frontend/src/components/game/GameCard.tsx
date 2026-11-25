import type { Game } from "../../services/api";
import { getGameImages } from "../../utils/gameUtils";
import { GameImage } from "./GameImage";
import { DiscountBadge } from "./DiscountBadge";
import { Pricing } from "./Pricing";

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const images = getGameImages(game);

  return (
    <div className="bg-surface rounded-lg overflow-hidden border border-raised hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20">
      <GameImage images={images} gameName={game.name}>
        <DiscountBadge discount={game.discount} />
      </GameImage>

      <div className="p-2 sm:p-3">
        <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 line-clamp-2 min-h-[2rem]">
          {game.name}
        </h3>

        <div className="mb-1.5">
          <span className="text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
            {game.keyType}
          </span>
        </div>

        <Pricing
          price={game.price}
          discount={game.discount}
          finalPrice={game.finalPrice}
        />
      </div>
    </div>
  );
};
