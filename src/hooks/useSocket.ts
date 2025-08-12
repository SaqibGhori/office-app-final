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
 * Custom React Hook to manage socket
 * @param onReading  Callback jab naya reading aaye
 * @param gatewayId  Aapka IoT device / gateway ID
 * @param token      JWT Token for authentication & global-alarms
 */
export function useSocket(
  onReading?: (data: any) => void,
  gatewayId?: string,
  token?: string
): Socket {
  const socket = useRef<Socket>(getSocket()).current;

  useEffect(() => {
    // console.log("🧠 useSocket subscribing:", { gatewayId, token });

    if (!token) {
      // console.warn("⚠️ useSocket: token missing. Will wait...");
      return;
    }

    // Subscribe with token for user-based room and gatewayId if provided
    socket.emit("subscribe", { gatewayId, token });

    const readingHandler = (data: any) => {
      if (onReading && gatewayId && data.gatewayId === gatewayId) {
        onReading(data);
      }
    };

    socket.on("new-reading", readingHandler);

    return () => {
      socket.off("new-reading", readingHandler);
    };
  }, [onReading, gatewayId, token]);  // Dependencies are OK

  return socket;
}
