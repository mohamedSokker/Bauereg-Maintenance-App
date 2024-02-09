import { io } from "socket.io-client";
import { EXPO_PUBLIC_BASE_URL } from "@env";

export const socket = io(EXPO_PUBLIC_BASE_URL, { autoConnect: false });
