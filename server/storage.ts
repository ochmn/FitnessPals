import { 
  users, 
  locations, 
  reminders, 
  preferences, 
  activities,
  type User, 
  type InsertUser, 
  type Location, 
  type InsertLocation, 
  type Reminder, 
  type InsertReminder, 
  type Preference, 
  type InsertPreference,
  type Activity,
  type InsertActivity
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Location operations
  getLocation(id: number): Promise<Location | undefined>;
  getLocations(category?: string): Promise<Location[]>;
  getNearbyLocations(lat: number, lng: number, radius: number, category?: string): Promise<Location[]>;
  searchLocations(query: string): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  
  // Reminder operations
  getReminder(id: number): Promise<Reminder | undefined>;
  getRemindersByUser(userId: number): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, data: Partial<Reminder>): Promise<Reminder | undefined>;
  deleteReminder(id: number): Promise<boolean>;
  
  // Preference operations
  getUserPreferences(userId: number): Promise<Preference | undefined>;
  saveUserPreferences(preference: InsertPreference): Promise<Preference>;
  updateUserPreferences(userId: number, data: Partial<Preference>): Promise<Preference | undefined>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  getActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private locations: Map<number, Location>;
  private reminders: Map<number, Reminder>;
  private preferences: Map<number, Preference>;
  private activities: Map<number, Activity>;
  
  private userCurrentId: number;
  private locationCurrentId: number;
  private reminderCurrentId: number;
  private preferenceCurrentId: number;
  private activityCurrentId: number;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.reminders = new Map();
    this.preferences = new Map();
    this.activities = new Map();
    
    this.userCurrentId = 1;
    this.locationCurrentId = 1;
    this.reminderCurrentId = 1;
    this.preferenceCurrentId = 1;
    this.activityCurrentId = 1;
    
    // Populate with sample locations
    this.initSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Location operations
  async getLocation(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async getLocations(category?: string): Promise<Location[]> {
    const allLocations = Array.from(this.locations.values());
    if (category && category !== 'all') {
      return allLocations.filter(location => location.category === category);
    }
    return allLocations;
  }

  async getNearbyLocations(lat: number, lng: number, radius: number, category?: string): Promise<Location[]> {
    // In a real implementation, this would use a geospatial algorithm
    // For now, we'll simulate distance calculations
    const allLocations = Array.from(this.locations.values());
    
    // Calculate rough distance for each location
    const locationsWithDistance = allLocations.map(location => {
      const distance = this.calculateDistance(
        lat, lng,
        location.latitude, location.longitude
      );
      return { ...location, distance };
    });
    
    // Filter by distance and optionally by category
    const nearbyLocations = locationsWithDistance
      .filter(location => location.distance <= radius)
      .filter(location => !category || category === 'all' || location.category === category)
      .sort((a, b) => a.distance - b.distance);
    
    return nearbyLocations;
  }

  async searchLocations(query: string): Promise<Location[]> {
    const allLocations = Array.from(this.locations.values());
    if (!query) return allLocations;
    
    const lowerQuery = query.toLowerCase();
    return allLocations.filter(
      location => 
        location.name.toLowerCase().includes(lowerQuery) ||
        (location.description && location.description.toLowerCase().includes(lowerQuery)) ||
        location.address.toLowerCase().includes(lowerQuery)
    );
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = this.locationCurrentId++;
    const location: Location = { ...insertLocation, id };
    this.locations.set(id, location);
    return location;
  }

  // Reminder operations
  async getReminder(id: number): Promise<Reminder | undefined> {
    return this.reminders.get(id);
  }

  async getRemindersByUser(userId: number): Promise<Reminder[]> {
    return Array.from(this.reminders.values())
      .filter(reminder => reminder.userId === userId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const id = this.reminderCurrentId++;
    const reminder: Reminder = { ...insertReminder, id };
    this.reminders.set(id, reminder);
    return reminder;
  }

  async updateReminder(id: number, data: Partial<Reminder>): Promise<Reminder | undefined> {
    const reminder = this.reminders.get(id);
    if (!reminder) return undefined;
    
    const updatedReminder = { ...reminder, ...data };
    this.reminders.set(id, updatedReminder);
    return updatedReminder;
  }

  async deleteReminder(id: number): Promise<boolean> {
    return this.reminders.delete(id);
  }

  // Preference operations
  async getUserPreferences(userId: number): Promise<Preference | undefined> {
    return Array.from(this.preferences.values()).find(
      preference => preference.userId === userId
    );
  }

  async saveUserPreferences(insertPreference: InsertPreference): Promise<Preference> {
    // Check if preferences already exist for this user
    const existingPrefs = await this.getUserPreferences(insertPreference.userId);
    
    if (existingPrefs) {
      // Update existing preferences
      const updatedPrefs = { ...existingPrefs, ...insertPreference };
      this.preferences.set(existingPrefs.id, updatedPrefs);
      return updatedPrefs;
    } else {
      // Create new preferences
      const id = this.preferenceCurrentId++;
      const preference: Preference = { ...insertPreference, id };
      this.preferences.set(id, preference);
      return preference;
    }
  }

  async updateUserPreferences(userId: number, data: Partial<Preference>): Promise<Preference | undefined> {
    const preference = Array.from(this.preferences.values()).find(
      preference => preference.userId === userId
    );
    
    if (!preference) return undefined;
    
    const updatedPreference = { ...preference, ...data };
    this.preferences.set(preference.id, updatedPreference);
    return updatedPreference;
  }

  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityCurrentId++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }

  // Helper methods
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Simple Haversine formula to calculate distance between two points on Earth
    const R = 3958.8; // Earth's radius in miles
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return Math.round(d * 10) / 10; // round to 1 decimal place
  }

  private toRad(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  // Initialize with sample data
  private initSampleData() {
    // Sample locations
    const sampleLocations: InsertLocation[] = [
      {
        name: "Riverside Park",
        description: "Beautiful park with dedicated dog areas and running trails.",
        address: "123 Riverside Dr, New York, NY",
        category: "park",
        latitude: 40.801111,
        longitude: -73.972222,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
        amenities: ["Running Trail", "Off-leash Area", "Water Fountain"]
      },
      {
        name: "Bark & Brew Cafe",
        description: "Pet-friendly cafe with outdoor seating and protein smoothies.",
        address: "456 Main St, New York, NY",
        category: "cafe",
        latitude: 40.7589,
        longitude: -73.9851,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
        amenities: ["Protein Smoothies", "Pet Water Station", "Outdoor Seating"]
      },
      {
        name: "Paws & Fitness Park",
        description: "Outdoor fitness area with equipment and dog agility course.",
        address: "789 Park Ave, New York, NY",
        category: "park",
        latitude: 40.7812,
        longitude: -73.9665,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
        amenities: ["Outdoor Equipment", "Dog Agility Course", "Shaded Areas"]
      },
      {
        name: "Healthy Paws Store",
        description: "Premium pet food and fitness accessories for active pets.",
        address: "101 Fifth Ave, New York, NY",
        category: "shop",
        latitude: 40.7350,
        longitude: -73.9905,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
        amenities: ["Organic Pet Food", "Fitness Gear", "Expert Staff"]
      },
      {
        name: "Central Bark Dog Park",
        description: "Large off-leash dog park with separate areas for small and large dogs.",
        address: "202 Central Park West, New York, NY",
        category: "park",
        latitude: 40.7829,
        longitude: -73.9654,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
        amenities: ["Off-leash Area", "Water Station", "Agility Equipment"]
      },
      {
        name: "Pawsome Cafe",
        description: "Pet-friendly cafe with special menu for dogs and healthy options for owners.",
        address: "303 Broadway, New York, NY",
        category: "cafe",
        latitude: 40.7143,
        longitude: -74.0060,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
        amenities: ["Dog Menu", "Outdoor Seating", "Healthy Options"]
      }
    ];

    // Add sample locations
    sampleLocations.forEach(location => {
      const id = this.locationCurrentId++;
      this.locations.set(id, { ...location, id });
    });

    // Sample activity (Featured event)
    const hikeActivity: InsertActivity = {
      title: "Weekend Group Hike",
      description: "Join a fun hiking event with your furry friend",
      locationName: "Mountain Trail Park",
      date: new Date("2024-07-15T10:00:00"),
      locationId: 3,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
    };

    const activityId = this.activityCurrentId++;
    this.activities.set(activityId, { ...hikeActivity, id: activityId });

    // Sample user for testing
    const demoUser: InsertUser = {
      username: "demouser",
      password: "password123", // In a real app, this would be hashed
      email: "demo@example.com",
      name: "Demo User",
      profilePicture: "https://pixabay.com/get/gf37c8313415a9442cc21c61979ba67554513af11c38070e058e4bb7db83f375e77a4418a48777514c23570323403173126fdaa96cb984ed97e7e1609033c7412_1280.jpg"
    };

    const userId = this.userCurrentId++;
    this.users.set(userId, { ...demoUser, id: userId });

    // Sample reminders
    const sampleReminders: InsertReminder[] = [
      {
        userId: userId,
        title: "Morning Run with Max",
        locationId: 1,
        locationName: "Riverside Park",
        date: new Date("2024-06-25T07:00:00"),
        notificationTime: new Date("2024-06-25T06:45:00"),
        isCompleted: false
      },
      {
        userId: userId,
        title: "Pick up Pet Food",
        locationId: 4,
        locationName: "Healthy Paws Store",
        date: new Date("2024-06-26T14:00:00"),
        notificationTime: new Date("2024-06-26T13:45:00"),
        isCompleted: false
      }
    ];

    // Add sample reminders
    sampleReminders.forEach(reminder => {
      const id = this.reminderCurrentId++;
      this.reminders.set(id, { ...reminder, id });
    });

    // Sample user preferences
    const samplePreference: InsertPreference = {
      userId: userId,
      maxDistance: 5,
      preferredCategories: ["park", "cafe"],
      darkMode: false,
      notificationsEnabled: true
    };

    const preferenceId = this.preferenceCurrentId++;
    this.preferences.set(preferenceId, { ...samplePreference, id: preferenceId });
  }
}

export const storage = new MemStorage();
