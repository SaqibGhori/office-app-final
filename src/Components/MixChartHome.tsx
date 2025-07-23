import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import type { ApexOptions } from "apexcharts";

const MixChartHome: React.FC = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [firstMetric, setFirstMetric] = useState<string>(""); // to label yAxis

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [readingsRes, alarmsRes] = await Promise.all([
          axios.get("http://localhost:3000/api/latest-readings"),
          axios.get("http://localhost:3000/api/alarm-counts")
        ]);

        const readingsData = readingsRes.data || [];
        const alarmData = alarmsRes.data || [];

        const firstData = readingsData[0]?.data || {};
        const categories = Object.keys(firstData);

        const firstCategory = categories?.[0] || "Unknown Category";
        const subKeys = firstData[firstCategory]
          ? Object.keys(firstData[firstCategory])
          : [];

        const sub1 = subKeys?.[0] || "Metric";
        setFirstMetric(sub1); // set for axis label

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

        const gatewayNames: string[] = Object.keys(gatewayMap);
        const readingSeries: number[] = [];
        const alarmSeries: number[] = [];

        gatewayNames.forEach((gw) => {
          const obj = gatewayMap[gw];
          readingSeries.push(obj[sub1] ?? 0);
          alarmSeries.push(obj["alarms"] ?? 0);
        });

        setCategories(gatewayNames);
        setSeries([ 
          { name: sub1, data: readingSeries, type: "column", yAxisIndex: 0 },
          { name: "Alarm Count", data: alarmSeries, type: "column", yAxisIndex: 1 }
        ]);
      } catch (error) {
        console.error("❌ Error fetching graph data:", error);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 430
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: "top"
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["#fff"]
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"]
    },
    tooltip: {
      shared: true,
      intersect: false
    },
    xaxis: {
      categories: categories
    },
    yaxis: [
      {
        title: {
          text: firstMetric || "Metric"
        }
      },
      {
        opposite: true,
        title: {
          text: "Alarm Count"
        }
      }
    ]
  };

  return (
    <div>
      <ReactApexChart options={options} series={series} type="bar" height={430} />
    </div>
  );
};

export default MixChartHome;
