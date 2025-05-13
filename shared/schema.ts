import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  profilePicture: text("profile_picture"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Location schema
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  category: text("category").notNull(), // park, cafe, gym, store, etc.
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  rating: doublePrecision("rating"),
  distance: doublePrecision("distance"),
  image: text("image"),
  amenities: text("amenities").array(),
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

// Reminder schema
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  locationId: integer("location_id"),
  locationName: text("location_name"),
  date: timestamp("date").notNull(),
  notificationTime: timestamp("notification_time").notNull(),
  isCompleted: boolean("is_completed").default(false),
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
});

// User preferences schema
export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  maxDistance: doublePrecision("max_distance"),
  preferredCategories: text("preferred_categories").array(),
  darkMode: boolean("dark_mode").default(false),
  notificationsEnabled: boolean("notifications_enabled").default(true),
});

export const insertPreferenceSchema = createInsertSchema(preferences).omit({
  id: true,
});

// Activity schema (for group activities and events)
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  locationId: integer("location_id"),
  locationName: text("location_name").notNull(),
  date: timestamp("date").notNull(),
  image: text("image"),
  capacity: integer("capacity"),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;

export type Preference = typeof preferences.$inferSelect;
export type InsertPreference = z.infer<typeof insertPreferenceSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
