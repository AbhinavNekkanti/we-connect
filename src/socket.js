
import { io } from "socket.io-client";

export const socket = io("https://we-connect-r3kg.onrender.com", {
  autoConnect: false,
});

