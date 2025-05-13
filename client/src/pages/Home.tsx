import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import SearchAndFilters from "@/components/SearchAndFilters";
import LocationCard from "@/components/LocationCard";
import ReminderItem from "@/components/ReminderItem";
import MapView from "@/components/MapView";
import FeaturedActivity from "@/components/FeaturedActivity";
import AddReminderDialog from "@/components/AddReminderDialog";
import { useGeolocation } from "@/hooks/useGeolocation";
import { requestNotificationPermission } from "@/utils/notificationUtils";
import { useEffect } from "react";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { latitude, longitude } = useGeolocation();

  // Initial notification permission request
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Fetch nearby locations
  const { data: locations = [] } = useQuery({
    queryKey: ['/api/locations/nearby', latitude, longitude, selectedCategory, searchQuery],
    enabled: !!latitude && !!longitude,
    queryFn: async () => {
      let url = `/api/locations/nearby?lat=${latitude}&lng=${longitude}&radius=10`;
      
      if (selectedCategory && selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      return response.json();
    }
  });

  // Search locations (if search query is provided)
  const { data: searchResults = [] } = useQuery({
    queryKey: ['/api/locations/search', searchQuery],
    enabled: searchQuery !== "",
    queryFn: async () => {
      const response = await fetch(`/api/locations/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      return response.json();
    }
  });

  // Fetch reminders
  const { data: reminders = [] } = useQuery({
    queryKey: ['/api/reminders', 1], // Using user ID 1 for demo
    queryFn: async () => {
      const response = await fetch('/api/reminders?userId=1');
      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }
      return response.json();
    }
  });

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Display locations based on search or nearby
  const displayLocations = searchQuery ? searchResults : locations;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6">
        <SearchAndFilters 
          onCategoryChange={handleCategoryChange} 
          onSearch={handleSearch}
          selectedCategory={selectedCategory}
        />

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Nearby Places</h3>
            <a href="#" className="text-primary text-sm font-medium">View All</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayLocations.slice(0, 3).map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Reminders</h3>
            <AddReminderDialog userId={1} />
          </div>
          
          <div className="space-y-3">
            {reminders.length > 0 ? (
              reminders.map((reminder) => (
                <ReminderItem key={reminder.id} reminder={reminder} />
              ))
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-neutral-600">No reminders yet. Add one to get started!</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Map View</h3>
            <button className="text-primary text-sm font-medium">Expand</button>
          </div>
          
          <MapView selectedCategory={selectedCategory} />
        </div>

        <FeaturedActivity />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Home;
