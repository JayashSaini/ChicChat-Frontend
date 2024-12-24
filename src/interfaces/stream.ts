import { UserInterface } from "./user";

export interface ParticipantInterface {
  user: UserInterface;
  isAudioOn: boolean;
  isVideoOn: boolean;
  stream: MediaStream | null;
  isPin: boolean;
}
export interface Room {
  _id: string; // MongoDB Object ID
  roomId: string; // Unique identifier for the room
  admin: string; // ID of the admin user
  participants: string[]; // List of participant user IDs
  invites: string[]; // List of invite user IDs (if any)
  chatId: string | null; // Chat ID (nullable)
  isActive: boolean; // Status of the room
  createdAt: string; // ISO string for creation date
  updatedAt: string; // ISO string for last updated date
  __v: number; // Version key for Mongoose documents
}
