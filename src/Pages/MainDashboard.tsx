// src/pages/MainDashboard.tsx
import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import RealTimeCharts from "../Components/RealTImeCharts";
import { Link } from "react-router-dom";
import { GatewayLabel } from '../Components/GatewayLabel';

type Section = {
  title: string;
  values: { label: string; value: number; unit: string }[];
};

export default function MainDashboard() {
  const { gatewayId, reading } = useData();
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

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
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold ml-5">
          {/* Gateway: {gatewayId || "Select a gateway"} */}
Gateway:{" "}
{gatewayId
? <GatewayLabel id={gatewayId} showId={false} />
: "Select a gateway"
}

        </h1>
        {/* <div className="flex gap-2 p-4">
          <Link to={`/harmonics?gateway=${gatewayId}`}>Harmonics</Link>
          <Link to={`/fileview?gateway=${gatewayId}`}>File View</Link>
          <Link to={`/alaram?gateway=${gatewayId}`}>Alaram</Link>
          <Link to={`/settings?gateway=${gatewayId}`}>Settings</Link>
        </div> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
        {reading
          ? sections.map((sec, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedTitle(sec.title)}
                className="bg-white rounded-lg shadow p-4"
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
          : Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-32 rounded" />
            ))}
      </div>

      <RealTimeCharts selectedTitle={selectedTitle} />
    </div>
  );
}
