import { useState, useEffect } from "react";
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
  console.log(reading, "mk")

  const selectedGateway = gateways?.find((g) => g.gatewayId === gatewayId);
  const gatewayName = selectedGateway?.gatewayName || "Unknown";
  const gatewayLocation = selectedGateway?.location || "";
  const inferUnit = (category: string, label: string) => {
    const lowerCat = category.toLowerCase();
    const lowerLabel = label.toLowerCase();

    // First check by label
    if (lowerLabel.includes("v")) return "volt";
    if (lowerLabel.includes("i") || lowerLabel.includes("amp")) return "amp";
    if (lowerLabel.includes("pf") || lowerLabel.includes("cos")) return "cos";
    if (lowerLabel.includes("hz") || lowerLabel.includes("f")) return "Hz";
    if (lowerLabel.includes("w")) return "Watt";
    if (lowerLabel.includes("va")) return "VA";

    // Then fallback by category
    if (lowerCat.includes("voltage")) return "volt";
    if (lowerCat.includes("active power")) return "Watt";
    if (lowerCat.includes("power factor")) return "cos";
    if (lowerCat.includes("temperature")) return "°C";
    if (lowerCat.includes("humidity")) return "%";

    return "";
  };

  const sections: Section[] = reading?.data
    ? Object.entries(reading.data).map(([category, subObj]) => ({
      title: category,
      values: Object.entries(subObj).map(([label, value]) => ({
        label,
        value,
        unit: inferUnit(category, label),
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
    <div className="p-4 bg-[#001a33] h-100vh">
      <div className="">
        <div>
          <div className="flex items-baseline gap-2 ">
            <span className="text-gray-200">Device Name: </span>
            <h1 className=" text-xl text-gray-300 sm:text-gray-300 t-2xl font-semibold">
              {gatewayName}
              {/* <span className="text-sm text-gray-500 ml-2">({gatewayId})</span> */}
            </h1>
          </div>
          {gatewayLocation && (
            
            <div className="flex items-baseline gap-2">
              <span className="text-gray-200">Device Location:</span> 
              <h1 className="text-gray-300">{gatewayLocation}</h1>
            </div>
          )}
        </div>
      </div>

      {/* Data Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5  my-5">
        {sections.length > 0 ? (
          sections.map((sec, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTitle(sec.title)}
              className={`rounded-md   bg-gradient-to-r from-[#001a33] to-[#02396c]  shadow-md p-4 cursor-pointer hover:shadow-md transition ${selectedTitle === sec.title ? "border-2 border-blue-600" : ""
                }`}
            >
              <h2 className="font-semibold text-gray-400 mb-2">{sec.title}</h2>
              {sec.values.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-300">{item.label}</span>
                  <span className="font-mono text-gray-300">
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
