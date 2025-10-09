// hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let sharedSocket: Socket | null = null;

const BASE = import.meta.env.VITE_API_URL || "https://api.wattmatrix.io";

export function getSocket(): Socket {
  if (!sharedSocket) {
    sharedSocket = io(BASE, {
      transports: ["websocket","polling"],   // low-latency
      path: "/socket.io",
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
      timeout: 10000,
    });
  }
  return sharedSocket!;
}

/**
 * Custom React Hook to manage socket
 * @param onReading  Callback jab naya reading aaye
 * @param gatewayId  Aapka IoT device / gateway ID
 * @param token      JWT Token (optional) -> user room + alarms
 */
export function useSocket(
  onReading?: (data: any) => void,
  gatewayId?: string,
  token?: string
): Socket {
  const socket = useRef<Socket>(getSocket()).current;
  const lastSubsRef = useRef<{ gatewayId?: string; token?: string }>({});
socket.onAny((event, data) => {
  console.log("🔔 Got socket event:", event, data);
});
  useEffect(() => {
    // subscribe function (reusable for connect/reconnect & prop changes)
    const doSubscribe = () => {
      // avoid redundant emits if nothing changed
      if (
        lastSubsRef.current.gatewayId === gatewayId &&
        lastSubsRef.current.token === token
      ) return;

      socket.emit("subscribe", { gatewayId, token }); // token optional
      lastSubsRef.current = { gatewayId, token };
    };

    // attach reading handler (standardized event name = 'reading')
    const handleReading = (data: any) => {
      // if consumer wants only current gateway, filter here:
      if (gatewayId && data?.gatewayId !== gatewayId) return;
      onReading?.(data);
    };

    const handleSubscribedAck = () => {
      // optional: debug/telemetry
      // console.log("subscribed:", info);
    };

    // initial attach
    socket.on("reading", handleReading);
    socket.on("subscribed", handleSubscribedAck);

    // re-subscribe on connect/reconnect
    const onConnect = () => doSubscribe();
    socket.on("connect", onConnect);

    // also (re)subscribe immediately when deps change
    doSubscribe();

    return () => {
      socket.off("reading", handleReading);
      socket.off("subscribed", handleSubscribedAck);
      socket.off("connect", onConnect);
      // NOTE: socket ko close mat karo (shared rehne do)
    };
  }, [socket, onReading, gatewayId, token]);

  return socket;
}
