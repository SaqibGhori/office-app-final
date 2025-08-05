import React, { useEffect, useState } from "react";
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
console.log(gatewayId , "testing")
  // Reset series when selectedTitle changes
  useEffect(() => {
    setSeriesMap({});
    setTimestamps([]);
  }, [selectedTitle]);

  useSocket((data: Reading) => {
    if (data && selectedTitle && data.data[selectedTitle]) {
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
    }
  }, gatewayId);

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
        dynamicAnimation: { speed: 500 }
      },
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories: timestamps,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    legend: {
      position: 'top',
    },
    title: {
      text: selectedTitle || "Real-Time Chart",
      align: 'left',
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
