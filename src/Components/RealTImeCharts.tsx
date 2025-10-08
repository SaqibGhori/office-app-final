import React, { useEffect, useState, useCallback } from "react";
import Chart from "react-apexcharts";
import { useSocket } from "../hooks/useSocket";

type RealTimeChartProps = {
  selectedTitle: string | null;
  gatewayId: string | undefined;
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

const RealTimeCharts: React.FC<RealTimeChartProps> = ({ selectedTitle, gatewayId }) => {
  const [seriesMap, setSeriesMap] = useState<Record<string, number[]>>({});
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const userId = localStorage.getItem("token") ?? undefined;

  // Reset graph when title changes
  useEffect(() => {
    setSeriesMap({});
    setTimestamps([]);
  }, [selectedTitle]);

  // Realtime reading handler
  const handleReading = useCallback((data: Reading) => {
    if (!selectedTitle || !data?.data?.[selectedTitle]) return;

    const categoryData = data.data[selectedTitle];
    const currentTime = new Date().toLocaleTimeString();

    setTimestamps((prev) => [...prev, currentTime].slice(-15));

    setSeriesMap((prevMap) => {
      const updatedMap = { ...prevMap };
      Object.entries(categoryData).forEach(([label, value]) => {
        const prevData = updatedMap[label] || [];
        updatedMap[label] = [...prevData, value].slice(-15);
      });
      return updatedMap;
    });
  }, [selectedTitle]);

  // Setup socket connection
  useSocket(handleReading, gatewayId, userId);

  // Convert seriesMap to ApexChart format
  const series = Object.entries(seriesMap).map(([label, data]) => ({
    name: label,
    data,
  }));

 const options: ApexCharts.ApexOptions = {
  chart: {
    type: "line",
    height: 350,
    animations: {
      enabled: true,
      dynamicAnimation: { speed: 500 },
    },
    toolbar: { show: false },
    zoom: { enabled: false },
    foreColor: "#fff",  // 👈 ye line add karo
  },
  xaxis: {
    categories: timestamps,
    labels: { style: { colors: "#fff" } },  // 👈 axis labels white
  },
  yaxis: {
    labels: { style: { colors: "#fff" } },  // 👈 y-axis labels white
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  legend: {
    position: "bottom",
    labels: { colors: "#fff" }, // 👈 legend text white
  },
  title: {
    text: selectedTitle || "Real-Time Chart",
    align: "left",
    style: { color: "#fff" }, // 👈 title white
  },
};


  return (
    <div className="p-4 bg-[#02396c] shadow-lg rounded text-white ">
      {series.some((s) => s.data.length > 0) ? (
        <Chart options={options} series={series} type="line" height={400} />
      ) : (
        <p className="text-white text-sm">
          Waiting for {selectedTitle || "data"}...
        </p>
      )}
    </div>
  );
};

export default RealTimeCharts;
