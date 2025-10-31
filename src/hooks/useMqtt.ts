// // src/hooks/useMqtt.ts
// import { useEffect, useRef, useState } from "react";
// import mqtt from "mqtt";

// type Msg = { topic: string; payload: any; ts: number };

// export default function useMqtt(opts?: { url?: string; topic?: string }) {
//   const url = opts?.url || "ws://localhost:9001"; // change if you used another ws port
//   const topic = opts?.topic || "test/topic";
//   const clientRef = useRef<any>(null);
//   const [connected, setConnected] = useState(false);
//   const [messages, setMessages] = useState<Msg[]>([]);

//   useEffect(() => {
//     const client = mqtt.connect(url, { reconnectPeriod: 3000 });
//     clientRef.current = client;

//     client.on("connect", () => {
//       setConnected(true);
//       client.subscribe(topic, (err) => {
//         if (err) console.error("Subscribe error:", err);
//         else console.log("📡 Subscribed to", topic);
//       });
//       console.log("✅ Frontend connected to MQTT via", url);
//     });

//     client.on("reconnect", () => console.log("🔁 MQTT reconnecting..."));
//     client.on("close", () => setConnected(false));
//     client.on("error", (err) => console.error("MQTT error:", err));

//     client.on("message", (t, payload) => {
//       let parsed: any = null;
//       try {
//         parsed = JSON.parse(payload.toString());
//       } catch {
//         parsed = payload.toString();
//       }
//       const msg: Msg = { topic: t, payload: parsed, ts: Date.now() };
//       setMessages(prev => [msg, ...prev].slice(0, 200)); // keep last 200
//       console.log("📩 MQTT Data Received (FE):", msg);
//     });

//     return () => {
//       try {
//         client.end(true);
//       } catch {}
//     };
//   }, [url, topic]);

//   return { connected, messages, client: clientRef.current };
// }
