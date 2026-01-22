import { useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { Button } from '../ui/Button';

interface GalleryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const GalleryHeader = ({ searchQuery, onSearchChange }: GalleryHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#1A1A2E] border-b border-[#2D2D44] sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Eneba</h1>
          <Button onClick={() => navigate('/create')} className="text-sm sm:text-base px-3 sm:px-4 py-2">
            + Create Game
          </Button>
        </div>
        <SearchBar value={searchQuery} onChange={onSearchChange} placeholder="Search games..." />
      </div>
    </header>
  );
};
