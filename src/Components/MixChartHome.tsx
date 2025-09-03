import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { api } from "../api";

const MixChartHome: React.FC = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [firstMetric, setFirstMetric] = useState<string>("Metric"); // defaulted for safety

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fixed Promise.all syntax: both requests inside the array
        const [readingsRes, alarmsRes] = await Promise.all([
          api.get("/api/latest-readings", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }),
          api.get("/api/alarm-counts", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }),
        ]);

        const readingsData = readingsRes.data || [];
        const alarmData = alarmsRes.data || [];

        if (!readingsData.length) {
          console.warn("No readings data found");
          return;
        }

        const firstData = readingsData[0]?.data || {};
        const categoryNames = Object.keys(firstData);
        const firstCategory = categoryNames[0] || "Unknown";

        const subKeys = firstData[firstCategory]
          ? Object.keys(firstData[firstCategory])
          : [];

        const sub1 = subKeys[0] || "Metric";
        setFirstMetric(sub1);

        const gatewayMap: Record<string, any> = {};

        readingsData.forEach((item: any) => {
          const gw = item.gatewayId;
          if (!gatewayMap[gw]) gatewayMap[gw] = {};
          gatewayMap[gw][sub1] = item.data?.[firstCategory]?.[sub1] ?? 0;
        });

        alarmData.forEach((item: any) => {
          const gw = item.gatewayId;
          if (!gatewayMap[gw]) gatewayMap[gw] = {};
          gatewayMap[gw]["alarms"] = item.count ?? 0;
        });

        const gatewayNames = Object.keys(gatewayMap);
        const readingSeries: number[] = [];
        const alarmSeries: number[] = [];

        gatewayNames.forEach((gw) => {
          const obj = gatewayMap[gw];
          readingSeries.push(obj[sub1] ?? 0);
          alarmSeries.push(obj["alarms"] ?? 0);
        });

        setCategories(gatewayNames);
        setSeries([
          {
            name: sub1,
            data: readingSeries,
            type: "column",
            yAxisIndex: 0,
          },
          {
            name: "Alarm Count",
            data: alarmSeries,
            type: "column",
            yAxisIndex: 1,
          },
        ]);
      } catch (error) {
        console.error("❌ Error fetching graph data:", error);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    
     chart: { type: "bar",  },
      colors: ["#000066", "#eb1414",], 
    
    plotOptions: {  
      bar: {
        horizontal: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    xaxis: {
      categories: categories,
    },
    yaxis: [
      {
        title: {
          text: firstMetric,
        },
      },
      {
        opposite: true,
        title: {
          text: "Alarm Count",
        },
      },
    ],
  };

  return (
    <div>
      <ReactApexChart options={options} series={series} type="bar" height={430} />
    </div>
  );
};

export default MixChartHome;
