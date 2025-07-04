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
    // 1) Room join
    if (gatewayId) {
      socket.emit("join-gateway", gatewayId);
    }

    // 2) Event subscribe
    if (onReading) {
      socket.on("new-reading", onReading);
    }

    return () => {
      // 3) Cleanup subscribe
      if (onReading) {
        socket.off("new-reading", onReading);
      }
      // 4) Room leave
      if (gatewayId) {
        socket.emit("leave-gateway", gatewayId);
      }
    };
  }, [onReading, socket, gatewayId]);

  return socket;
}
