// Import necessary modules and utilities
import axios from "axios";
import { LocalStorage } from "../utils";
import { ProfileInterface } from "@interfaces/user";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  timeout: 120000,
});

// Add an interceptor to set authorization header with user token before requests
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("token");
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// API functions for different actions
const loginUser = (data: { username: string; password: string }) => {
  return apiClient.post("/users/login", data);
};

const registerUser = (data: {
  email: string;
  password: string;
  username: string;
}) => {
  return apiClient.post("/users/register", data);
};

const logoutUser = () => {
  return apiClient.post("/users/logout");
};

const updateAvatar = (data: any) => {
  return apiClient.patch(`/users/update-avatar`, data);
};

const getAvailableUsers = () => {
  return apiClient.get("/chat/users");
};

const getUserChats = () => {
  return apiClient.get(`/chat`);
};

const createUserChat = (receiverId: string) => {
  return apiClient.post(`/chat/c/${receiverId}`);
};

const createGroupChat = (data: { name: string; participants: string[] }) => {
  return apiClient.post(`/chat/group`, data);
};

const getGroupInfo = (chatId: string) => {
  return apiClient.get(`/chat/group/${chatId}`);
};

const updateGroupName = (chatId: string, name: string) => {
  return apiClient.patch(`/chat/group/${chatId}`, { name });
};

const deleteGroup = (chatId: string) => {
  return apiClient.delete(`/chat/group/${chatId}`);
};

const deleteOneOnOneChat = (chatId: string) => {
  return apiClient.delete(`/chat/remove/${chatId}`);
};

const addParticipantToGroup = (chatId: string, participantId: string) => {
  return apiClient.post(`/chat/group/${chatId}/${participantId}`);
};

const removeParticipantFromGroup = (chatId: string, participantId: string) => {
  return apiClient.delete(`/chat/group/${chatId}/${participantId}`);
};

const getChatMessages = (chatId: string) => {
  return apiClient.get(`message/${chatId}`);
};

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

const deleteMessage = (chatId: string, messageId: string) => {
  return apiClient.delete(`message/${chatId}/${messageId}`);
};

const getProfile = () => {
  return apiClient.get(`/profile`);
};

const updateProfile = (data: ProfileInterface) => {
  return apiClient.patch(`/profile`, data);
};

const createRoom = () => {
  return apiClient.post("/rooms");
};

const joinRoom = (data: {
  link?: string;
  password?: string;
  roomId?: string;
}) => {
  return apiClient.post("/rooms/join", data);
};

const getRoomById = (roomId: string) => {
  return apiClient.get(`/rooms/${roomId}`);
};
// Export all the API functions
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
};
