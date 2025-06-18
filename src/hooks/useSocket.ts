// src/hooks/useSocket.ts

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

type ReadingHandler = (data: any) => void;

export function useSocket(onReading?: ReadingHandler): Socket | null {
  const socketRef = useRef<Socket | null>(null);

  const onMessage = useCallback((data: any) => {
    onReading?.(data);
  }, [onReading]);

  useEffect(() => {
    const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

    // transports: ['websocket'] ensures no polling, only WS
    socketRef.current = io(url, {
      transports: ['websocket'],
      path: '/socket.io',
    });

    socketRef.current.on('connect', () => {
      console.log('🔗 Socket connected:', socketRef.current!.id);
    });
    socketRef.current.on('new-reading', onMessage);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [onMessage]);

  return socketRef.current;
}
