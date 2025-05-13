import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import LocationCard from "@/components/LocationCard";
import { BookmarkCheck } from "lucide-react";

const SavedLocations = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // In a real app, we would fetch saved locations from the server
  // For this demo, we'll just show all locations and filter by category
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['/api/locations'],
  });

  // Filter locations by category if needed
  const filteredLocations = selectedCategory === 'all' 
    ? locations 
    : locations.filter(location => location.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Saved Places</h2>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button 
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === 'park' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setSelectedCategory('park')}
            >
              Parks
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === 'cafe' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setSelectedCategory('cafe')}
            >
              Cafes
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === 'shop' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setSelectedCategory('shop')}
            >
              Shops
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookmarkCheck className="h-16 w-16 text-neutral-300 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No saved locations</h3>
            <p className="text-neutral-500 max-w-md">
              You haven't saved any locations yet. Browse the map and save your favorite pet-friendly places.
            </p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default SavedLocations;
