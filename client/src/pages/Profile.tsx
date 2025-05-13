import { useQuery } from "@tanstack/react-query";
import { Settings, Bell, Moon, MapPin, Bookmark, CalendarDays, LogOut } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { requestNotificationPermission, notificationsSupported } from "@/utils/notificationUtils";

const Profile = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage("dark-mode", false);
  const [maxDistance, setMaxDistance] = useLocalStorage("max-distance", 5);
  
  // Fetch user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/user'],
  });

  // Check notification permission on mount
  useEffect(() => {
    if (notificationsSupported()) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  // Toggle notifications
  const handleNotificationsToggle = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      // In a real app, this would update the user's preference on the server
    } else {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
      // In a real app, this would update the user's preference on the server
    }
  };

  // Toggle dark mode
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    
    // Update document class for dark mode
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Update max distance
  const handleDistanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxDistance(parseInt(e.target.value));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : user ? (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-neutral-500">@{user.username}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Settings
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <h4 className="font-medium">Notifications</h4>
                      <p className="text-sm text-neutral-500">Receive reminders for activities</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notificationsEnabled} 
                    onCheckedChange={handleNotificationsToggle}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Moon className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <h4 className="font-medium">Dark Mode</h4>
                      <p className="text-sm text-neutral-500">Switch to dark theme</p>
                    </div>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={handleDarkModeToggle}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-neutral-500" />
                    <div>
                      <h4 className="font-medium">Maximum Distance</h4>
                      <p className="text-sm text-neutral-500">Show locations within distance</p>
                    </div>
                  </div>
                  <select 
                    className="px-3 py-1 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    value={maxDistance}
                    onChange={handleDistanceChange}
                  >
                    <option value="1">1 mile</option>
                    <option value="5">5 miles</option>
                    <option value="10">10 miles</option>
                    <option value="20">20 miles</option>
                    <option value="50">50 miles</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              
              <div className="space-y-4">
                <button className="w-full flex items-center py-2 px-3 rounded-md hover:bg-neutral-50 transition-colors">
                  <Bookmark className="h-5 w-5 mr-3 text-primary" />
                  <span>Saved Locations</span>
                </button>
                
                <button className="w-full flex items-center py-2 px-3 rounded-md hover:bg-neutral-50 transition-colors">
                  <CalendarDays className="h-5 w-5 mr-3 text-primary" />
                  <span>Upcoming Activities</span>
                </button>
                
                <button className="w-full flex items-center py-2 px-3 rounded-md hover:bg-red-50 transition-colors text-red-500">
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            <div className="text-center text-sm text-neutral-500 mb-6">
              <p>FitPet v1.0.0</p>
              <p>© 2024 FitPet. All rights reserved.</p>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-neutral-600">User data could not be loaded</p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
