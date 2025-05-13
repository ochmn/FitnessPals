import { useEffect, useRef, useState } from "react";
import { Map, GlobeIcon, ShoppingCart, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Location } from "@shared/schema";
import { useGeolocation } from "@/hooks/useGeolocation";

interface MapViewProps {
  selectedCategory?: string;
}

const MapView: React.FC<MapViewProps> = ({ selectedCategory = "park" }) => {
  const { latitude, longitude, error: geoError } = useGeolocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>(selectedCategory);

  // Fetch nearby locations
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['/api/locations/nearby', latitude, longitude, activeFilter],
    enabled: !!latitude && !!longitude,
    queryFn: async () => {
      const response = await fetch(`/api/locations/nearby?lat=${latitude}&lng=${longitude}&radius=10&category=${activeFilter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch nearby locations');
      }
      return response.json();
    }
  });

  // Map initialization logic would go here in a real implementation
  // For now, we'll simulate a map with a background image
  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      // In a real implementation, this would initialize and update the map
      console.log(`Map would center at ${latitude}, ${longitude}`);
    }
  }, [latitude, longitude, locations]);

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-64 relative bg-gray-100" ref={mapRef}>
        {/* Map implementation placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-60">
          {geoError ? (
            <span className="text-red-500 font-medium text-center px-4">
              {geoError.message || "Unable to access location. Please enable location services."}
            </span>
          ) : !latitude || !longitude ? (
            <span className="text-neutral-500 font-medium">Loading map...</span>
          ) : (
            <div className="w-full h-full" style={{
              backgroundImage: "url('https://pixabay.com/get/gcca2f5e8ebed2cbebbc9ef6931483275a0f1dbad42c5294c61966031b2260fb2b5f8dda9e9ad8423dfbc0d0db22c6a26a77346be32f0ff27a97f8c07f22c473c_1280.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative"
            }}>
              {/* Location markers would be added here in a real implementation */}
              {locations.map((location, index) => (
                <div 
                  key={index}
                  className="absolute bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${30 + Math.random() * 40}%`,
                    top: `${30 + Math.random() * 40}%`,
                  }}
                  title={location.name}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map controls */}
        <div className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-md">
          <Map className="h-5 w-5 text-primary" />
        </div>
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-1.5 flex space-x-1">
          <button 
            className={`p-1.5 rounded ${activeFilter === 'park' ? 'bg-primary text-white' : 'text-neutral-500'}`}
            onClick={() => handleFilterChange('park')}
          >
            <GlobeIcon className="h-4 w-4" />
          </button>
          <button 
            className={`p-1.5 rounded ${activeFilter === 'cafe' ? 'bg-primary text-white' : 'text-neutral-500'}`}
            onClick={() => handleFilterChange('cafe')}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
          <button 
            className={`p-1.5 rounded ${activeFilter === 'activity' ? 'bg-primary text-white' : 'text-neutral-500'}`}
            onClick={() => handleFilterChange('activity')}
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapView;
