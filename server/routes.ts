import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertReminderSchema, 
  insertPreferenceSchema,
  insertLocationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API router
  const apiRouter = express.Router();
  
  // Location routes
  apiRouter.get("/locations", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const locations = await storage.getLocations(category);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  apiRouter.get("/locations/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string | undefined;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const locations = await storage.searchLocations(query);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to search locations" });
    }
  });

  apiRouter.get("/locations/nearby", async (req: Request, res: Response) => {
    try {
      const latSchema = z.coerce.number().min(-90).max(90);
      const lngSchema = z.coerce.number().min(-180).max(180);
      const radiusSchema = z.coerce.number().min(0).max(100);
      
      const lat = latSchema.parse(req.query.lat);
      const lng = lngSchema.parse(req.query.lng);
      const radius = radiusSchema.parse(req.query.radius || 5);
      const category = req.query.category as string | undefined;
      
      const locations = await storage.getNearbyLocations(lat, lng, radius, category);
      res.json(locations);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location parameters", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to fetch nearby locations" });
    }
  });

  apiRouter.get("/locations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid location ID" });
      }
      
      const location = await storage.getLocation(id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch location" });
    }
  });

  apiRouter.post("/locations", async (req: Request, res: Response) => {
    try {
      const validatedData = insertLocationSchema.parse(req.body);
      const newLocation = await storage.createLocation(validatedData);
      res.status(201).json(newLocation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create location" });
    }
  });

  // Reminder routes
  apiRouter.get("/reminders", async (req: Request, res: Response) => {
    try {
      // In a real app, this would use authenticated user ID
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const reminders = await storage.getRemindersByUser(userId);
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  apiRouter.post("/reminders", async (req: Request, res: Response) => {
    try {
      const validatedData = insertReminderSchema.parse(req.body);
      const newReminder = await storage.createReminder(validatedData);
      res.status(201).json(newReminder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reminder data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create reminder" });
    }
  });

  apiRouter.put("/reminders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reminder ID" });
      }
      
      const reminder = await storage.getReminder(id);
      if (!reminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      
      const updatedReminder = await storage.updateReminder(id, req.body);
      res.json(updatedReminder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update reminder" });
    }
  });

  apiRouter.delete("/reminders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reminder ID" });
      }
      
      const success = await storage.deleteReminder(id);
      if (!success) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete reminder" });
    }
  });

  // User preferences routes
  apiRouter.get("/preferences", async (req: Request, res: Response) => {
    try {
      // In a real app, this would use authenticated user ID
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const preferences = await storage.getUserPreferences(userId);
      if (!preferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  apiRouter.post("/preferences", async (req: Request, res: Response) => {
    try {
      const validatedData = insertPreferenceSchema.parse(req.body);
      const preferences = await storage.saveUserPreferences(validatedData);
      res.status(201).json(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid preference data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save preferences" });
    }
  });

  apiRouter.put("/preferences/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const updatedPreferences = await storage.updateUserPreferences(userId, req.body);
      if (!updatedPreferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      
      res.json(updatedPreferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Activities routes
  apiRouter.get("/activities", async (_req: Request, res: Response) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  apiRouter.get("/activities/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid activity ID" });
      }
      
      const activity = await storage.getActivity(id);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });

  // Authentication route (simplified for demo purposes)
  apiRouter.post("/login", async (req: Request, res: Response) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // In a real app, we would validate password here
      // For demo, we'll just return the user
      res.json({ id: user.id, username: user.username, name: user.name });
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // User route (to get the current user for demonstration)
  apiRouter.get("/user", async (_req: Request, res: Response) => {
    try {
      // In a real app, this would use authentication
      // For demo, we'll just return the first user
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        name: user.name,
        profilePicture: user.profilePicture
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Register the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
