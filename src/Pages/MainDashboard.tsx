import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import RealTimeCharts from "../Components/RealTImeCharts";
import { useSocket } from "../hooks/useSocket";

type Section = {
  title: string;
  values: { label: string; value: number; unit: string }[];
};

type Reading = {
  gatewayId: string;
  timestamp: string;
  data: Record<string, Record<string, number>>;
};

export default function MainDashboard() {
  const { gatewayId, gateways } = useData();
  const [reading, setReading] = useState<Reading | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const userId = localStorage.getItem("token") ?? undefined;

  // Realtime listener
  useSocket(
    (data: Reading) => {
      setReading(data);
    },
    gatewayId,
    userId
  );

  const selectedGateway = gateways?.find((g) => g.gatewayId === gatewayId);
  const gatewayName = selectedGateway?.name || "Unknown";
  const gatewayLocation = selectedGateway?.location || "";

  const inferUnitFromLabel = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes("v")) return "volt";
    if (lower.includes("i") || lower.includes("amp")) return "amp";
    if (lower.includes("pf") || lower.includes("cos")) return "cos";
    if (lower.includes("hz") || lower.includes("f")) return "Hz";
    if (lower.includes("w")) return "Watt";
    if (lower.includes("va")) return "VA";
    return "";
  };

  const sections: Section[] = reading?.data
    ? Object.entries(reading.data).map(([category, subObj]) => ({
        title: category,
        values: Object.entries(subObj).map(([label, value]) => ({
          label,
          value,
          unit: inferUnitFromLabel(label),
        })),
      }))
    : [];

  useEffect(() => {
    if (reading && !selectedTitle) {
      const firstCat = Object.keys(reading.data)[0];
      if (firstCat) setSelectedTitle(firstCat);
    }
  }, [reading, selectedTitle]);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <div>
          <h1 className="text-2xl font-bold">
            {gatewayName}
            <span className="text-sm text-gray-500 ml-2">({gatewayId})</span>
          </h1>
          {gatewayLocation && (
            <p className="text-sm text-gray-600">{gatewayLocation}</p>
          )}
        </div>
      </div>

      {/* Data Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sections.length > 0 ? (
          sections.map((sec, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTitle(sec.title)}
              className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition ${
                selectedTitle === sec.title ? "border-2 border-blue-600" : ""
              }`}
            >
              <h2 className="font-semibold mb-2">{sec.title}</h2>
              {sec.values.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.label}</span>
                  <span className="font-mono">
                    {item.value} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            ⚠️ Waiting for real-time readings...
          </div>
        )}
      </div>

      {/* Chart */}
      <RealTimeCharts selectedTitle={selectedTitle} gatewayId={gatewayId} />
    </div>
  );
}

// --- RealTimeCharts Component Changes ---
// In RealTimeCharts.tsx file:
// Add gatewayId as prop and use it directly instead of URL parsing.
// export type RealTimeChartProps = { selectedTitle: string | null; gatewayId: string | undefined };
// Update useSocket call to use gatewayId prop directly.
// Ensure chart title uses selectedTitle prop dynamically. Example: title: { text: selectedTitle || "Chart" }
