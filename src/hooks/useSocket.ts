import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let sharedSocket: Socket;

export function getSocket(): Socket {
  if (!sharedSocket) {
    sharedSocket = io("http://localhost:3000", {
      transports: ["websocket"],
      path: "/socket.io",
    });
  }
  return sharedSocket;
}

/**
 * @param onReading  Callback jab naya reading aaye
 * @param gatewayId  Aapka IoT device / gateway ID
 */
export function useSocket(
  onReading?: (data: any) => void,
  gatewayId?: string
): Socket {
  const socket = useRef<Socket>(getSocket()).current;

useEffect(() => {
    if (!onReading || !gatewayId) return;   // only bind if gatewayId present

    const handler = (data: any) => {
      if (data.gatewayId === gatewayId) {
        onReading(data);
      }
    };

    socket.on('new-reading', handler);
    return () => {
      socket.off('new-reading', handler);
    };
  }, [onReading, socket, gatewayId]);


  return socket;
}
