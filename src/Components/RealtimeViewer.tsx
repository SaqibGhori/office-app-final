// // src/components/RealtimeViewer.tsx
// import React from "react";
// import useMqtt from "../hooks/useMqtt";

// export default function RealtimeViewer() {
//   // if you used a different port/topic: useMqtt({ url: "ws://localhost:8083", topic: "my/topic" })
//   const { connected, messages } = useMqtt({ url: "ws://localhost:9001", topic: "test/topic" });

//   return (
//     <div style={{ padding: 12, fontFamily: "Inter, Arial", maxWidth: 900 }}>
//       <h3>Realtime MQTT Viewer (unsecured)</h3>
//       <div style={{ marginBottom: 8 }}>
//         <strong>Status:</strong> {connected ? <span style={{color:"green"}}>connected</span> : <span style={{color:"red"}}>disconnected</span>}
//       </div>

//       <div style={{ marginBottom: 12 }}>
//         <small>Showing last {messages.length} messages (most recent first)</small>
//       </div>

//       <div style={{ maxHeight: 420, overflow: "auto", background: "#fafafa", border: "1px solid #eee", padding: 8 }}>
//         {messages.length === 0 && <div style={{ color: "#666" }}>No messages yet — publish to <code>test/topic</code></div>}
//         {messages.map((m, i) => (
//           <div key={m.ts + "-" + i} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
//             <div style={{ fontSize: 12, color: "#888" }}>{new Date(m.ts).toLocaleTimeString()} • {m.topic}</div>
//             <pre style={{ margin: "6px 0 0", fontSize: 13, whiteSpace: "pre-wrap" }}>
//               {typeof m.payload === "string" ? m.payload : JSON.stringify(m.payload, null, 2)}
//             </pre>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
