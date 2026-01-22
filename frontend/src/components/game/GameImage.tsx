import type { ReactNode } from "react";
import { ImageCarousel } from "./ImageCarousel";

interface GameImageProps {
  images: string[];
  gameName: string;
  className?: string;
  children?: ReactNode;
}

export const GameImage = ({
  images,
  gameName,
  className = "",
  children,
}: GameImageProps) => {
  return (
    <div
      className={`relative w-full aspect-[4/3] bg-gradient-to-br from-purple-900/20 to-blue-900/20 overflow-hidden group ${className}`}
    >
      {images.length > 0 ? (
        <ImageCarousel images={images} alt={gameName} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-blue-900/30">
          <span className="text-4xl font-bold text-purple-400">
            {gameName.charAt(0)}
          </span>
        </div>
      )}
      {children}
    </div>
  );
};
