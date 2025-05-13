import { useState } from "react";
import { Search, Package, MapPin, ShoppingCart, Sparkles, Store } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useGeolocation } from "@/hooks/useGeolocation";

interface SearchAndFiltersProps {
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  selectedCategory: string;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  onCategoryChange,
  onSearch,
  selectedCategory
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { latitude, longitude, getCurrentPosition } = useGeolocation();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const handleLocationClick = () => {
    getCurrentPosition();
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Find Pet-Friendly Places</h2>
        <button 
          className="flex items-center text-sm text-primary font-medium"
          onClick={handleLocationClick}
        >
          <MapPin className="h-5 w-5 mr-1" />
          Current Location
        </button>
      </div>
      
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search for places..." 
            className="pl-10 pr-4 py-3 w-full rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary transition"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </form>

      <div className="flex items-center space-x-4 overflow-x-auto py-2 -mx-4 px-4 scrollbar-hide">
        <button 
          className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[80px] ${
            selectedCategory === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-white border border-neutral-200 text-neutral-600'
          }`}
          onClick={() => onCategoryChange('all')}
        >
          <Package className="h-5 w-5" />
          <span className="text-xs mt-1">All</span>
        </button>
        <button 
          className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[80px] ${
            selectedCategory === 'park' 
              ? 'bg-primary text-white' 
              : 'bg-white border border-neutral-200 text-neutral-600'
          }`}
          onClick={() => onCategoryChange('park')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs mt-1">Parks</span>
        </button>
        <button 
          className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[80px] ${
            selectedCategory === 'cafe' 
              ? 'bg-primary text-white' 
              : 'bg-white border border-neutral-200 text-neutral-600'
          }`}
          onClick={() => onCategoryChange('cafe')}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="text-xs mt-1">Cafes</span>
        </button>
        <button 
          className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[80px] ${
            selectedCategory === 'activity' 
              ? 'bg-primary text-white' 
              : 'bg-white border border-neutral-200 text-neutral-600'
          }`}
          onClick={() => onCategoryChange('activity')}
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-xs mt-1">Activities</span>
        </button>
        <button 
          className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[80px] ${
            selectedCategory === 'shop' 
              ? 'bg-primary text-white' 
              : 'bg-white border border-neutral-200 text-neutral-600'
          }`}
          onClick={() => onCategoryChange('shop')}
        >
          <Store className="h-5 w-5" />
          <span className="text-xs mt-1">Shops</span>
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilters;
