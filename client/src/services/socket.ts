import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(token?: string): Socket {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || '', {
      auth: { token: token || localStorage.getItem('sv_access_token') || '' },
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function reconnectSocket(token: string) {
  disconnectSocket();
  return getSocket(token);
}
