import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useSocket } from "../hooks/useSocket";
import { useLocation } from "react-router-dom";

type RealTimeChartProps = {
  selectedTitle: string | null;
};

type Reading = {
  gatewayId: string;
  timestamp: string;
  data: {
    [category: string]: {
      [label: string]: number;
    };
  };
};

const RealTimeCharts: React.FC<RealTimeChartProps> = ({ selectedTitle }) => {
  const [reading, setReading] = useState<Reading | null>(null);
  const [series, setSeries] = useState<any[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);

  // Get gateway from query string
  const location = useLocation();
  const query = new URLSearchParams(location.search);
 const gatewayId = query.get("gateway") || undefined;  // <— here

  // Socket hook
  useSocket((data: Reading) => {
    setReading(data);
  }, gatewayId);

  // Chart update
  useEffect(() => {
    if (!reading || !selectedTitle) return;

    const categoryData = reading.data?.[selectedTitle];
    if (!categoryData) return;

    const currentTime = new Date().toLocaleTimeString();
    setTimestamps((prev) => [...prev, currentTime].slice(-15));

    setSeries((prevSeries) => {
      return Object.entries(categoryData).map(([label, value]) => {
        const existing = prevSeries.find((s) => s.name === label);
        const updatedData = existing ? [...existing.data, value] : [value];

        return {
          name: label,
          data: updatedData.slice(-15),
        };
      });
    });
  }, [reading, selectedTitle]);

  // Apex chart options
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: timestamps,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: selectedTitle || "Real-Time Chart",
    },
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      {series.length > 0 ? (
        <Chart options={options} series={series} type="line" height={400} />
      ) : (
        <p className="text-gray-500 text-sm">Waiting for {selectedTitle || "data"}...</p>
      )}
    </div>
  );
};

export default RealTimeCharts;
