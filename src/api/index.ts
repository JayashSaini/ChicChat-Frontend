// Import necessary modules and utilities
import axios from "axios";
import { LocalStorage } from "../utils";
import { ProfileInterface } from "@interfaces/user";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: "/api/v1", // Set the base URL for API requests
  withCredentials: true, // Include credentials (cookies) with requests
  timeout: 120000, // Set request timeout to 2 minutes
});

// Interceptor to set authorization header with user token before making requests
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("token");
    // Set authorization header with bearer token for authentication
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error); // Reject the request if an error occurs
  }
);

// API function to log in a user
const loginUser = (data: { username: string; password: string }) => {
  return apiClient.post("/users/login", data);
};

// API function to register a new user
const registerUser = (data: {
  email: string;
  password: string;
  username: string;
}) => {
  return apiClient.post("/users/register", data);
};

// API function to log out the user
const logoutUser = () => {
  return apiClient.post("/users/logout");
};

// API function to update user's avatar
const updateAvatar = (data: any) => {
  return apiClient.patch(`/users/update-avatar`, data);
};

// API function to get a list of available users for chat
const getAvailableUsers = () => {
  return apiClient.get("/chat/users");
};

// API function to get the list of chats for the logged-in user
const getUserChats = () => {
  return apiClient.get(`/chat`);
};

// API function to create a one-on-one chat with another user
const createUserChat = (receiverId: string) => {
  return apiClient.post(`/chat/c/${receiverId}`);
};

// API function to create a group chat
const createGroupChat = (data: { name: string; participants: string[] }) => {
  return apiClient.post(`/chat/group`, data);
};

// API function to get information about a group chat
const getGroupInfo = (chatId: string) => {
  return apiClient.get(`/chat/group/${chatId}`);
};

// API function to update the name of a group chat
const updateGroupName = (chatId: string, name: string) => {
  return apiClient.patch(`/chat/group/${chatId}`, { name });
};

// API function to delete a group chat
const deleteGroup = (chatId: string) => {
  return apiClient.delete(`/chat/group/${chatId}`);
};

// API function to delete a one-on-one chat
const deleteOneOnOneChat = (chatId: string) => {
  return apiClient.delete(`/chat/remove/${chatId}`);
};

// API function to add a participant to a group chat
const addParticipantToGroup = (chatId: string, participantId: string) => {
  return apiClient.post(`/chat/group/${chatId}/${participantId}`);
};

// API function to remove a participant from a group chat
const removeParticipantFromGroup = (chatId: string, participantId: string) => {
  return apiClient.delete(`/chat/group/${chatId}/${participantId}`);
};

// API function to get all messages in a chat
const getChatMessages = (chatId: string) => {
  return apiClient.get(`message/${chatId}`);
};

// API function to send a message in a chat (including attachments)
const sendMessage = (chatId: string, content: string, attachments: File[]) => {
  const formData = new FormData();
  if (content) {
    formData.append("content", content);
  }
  attachments?.map((file) => {
    formData.append("attachments", file);
  });
  return apiClient.post(`message/${chatId}`, formData);
};

// API function to delete a message in a chat
const deleteMessage = (chatId: string, messageId: string) => {
  return apiClient.delete(`message/${chatId}/${messageId}`);
};

// API function to get the logged-in user's profile
const getProfile = () => {
  return apiClient.get(`/profile`);
};

// API function to update the logged-in user's profile
const updateProfile = (data: ProfileInterface) => {
  return apiClient.patch(`/profile`, data);
};

// API function to create a new room
const createRoom = () => {
  return apiClient.post("/rooms");
};

// API function to join an existing room
const joinRoom = (data: {
  link?: string;
  password?: string;
  roomId?: string;
}) => {
  return apiClient.post("/rooms/join", data);
};

// API function to get details of a room by its ID
const getRoomById = (roomId: string) => {
  return apiClient.get(`/rooms/${roomId}`);
};

const toggleChatEnable = (roomId: string) => {
  return apiClient.patch(`/rooms/chat/${roomId}`);
};

const setPasswordHandler = (data: {
  password: string;
  confirmPassword: string;
  roomId: string;
}) => {
  return apiClient.patch(`/rooms/set-password`, data);
};
// Export all the API functions for use in other parts of the application
export {
  addParticipantToGroup,
  createGroupChat,
  createUserChat,
  deleteGroup,
  deleteOneOnOneChat,
  getAvailableUsers,
  getChatMessages,
  getGroupInfo,
  getUserChats,
  loginUser,
  logoutUser,
  registerUser,
  removeParticipantFromGroup,
  sendMessage,
  updateGroupName,
  deleteMessage,
  createRoom,
  joinRoom,
  updateProfile,
  getProfile,
  updateAvatar,
  getRoomById,
  setPasswordHandler,
  toggleChatEnable,
};
