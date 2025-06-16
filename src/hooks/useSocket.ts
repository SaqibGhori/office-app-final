import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

type ReadingHandler = (data: any) => void;

export function useSocket(onReading?: ReadingHandler): Socket | null {
  const socketRef = useRef<Socket | null>(null);

  const onMessage = useCallback((data: any) => {
    onReading?.(data);
  }, [onReading]);

  useEffect(() => {
    const url = import.meta.env.VITE_SOCKET_URL || '';
    socketRef.current = io(url);
    socketRef.current.on('new-reading', onMessage);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [onMessage]);

  return socketRef.current;
}