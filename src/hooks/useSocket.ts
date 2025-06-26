// hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const useSocket = <T>(
  onData: (data: T) => void,
  gatewayId: string | null
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!gatewayId) return;

    const socket = io(SOCKET_URL, {
      query: { gatewayId },
    });

    socketRef.current = socket;

    socket.on('new-reading', (data) => {
      if (data.gatewayId === gatewayId) {
        onData(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [gatewayId]);
};
