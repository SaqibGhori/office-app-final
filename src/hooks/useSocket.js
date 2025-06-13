import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(onReading) {
  const socketRef = useRef(null);

  useEffect(() => {
    // 1️⃣ Connect to your backend
    socketRef.current = io('http://localhost:3000');

    // 2️⃣ Listen for new-reading events
    socketRef.current.on('new-reading', onReading);

    return () => {
      // 3️⃣ Cleanup on unmount
      socketRef.current.disconnect();
    };
  }, [onReading]);
}
