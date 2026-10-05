import { io } from "socket.io-client";

export const socket = io("https://we-connect-r3kg.onrender.com", {
  autoConnect: false,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});