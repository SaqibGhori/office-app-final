"use client";
import React from "react";
import Chart from "react-apexcharts";

const AreaChart: React.FC = () => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: "#fff",
    },
    colors: ["#cc9900", "#00c0ff"], // yellow & blue
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: [
        "17:00","19:00","21:00","23:00","1:00","3:00","5:00","7:00",
        "9:00","11:00","13:00","15:00"
      ],
      labels: { style: { colors: "#fff" } },
    },
    yaxis: [
      {
        title: { text: "Load (kW)", style: { color: "#cc9900" } },
        labels: { style: { colors: "#cc9900" } },
      },
      {
        opposite: true,
        title: { text: "Voltage (V)", style: { color: "#00c0ff" } },
        labels: { style: { colors: "#00c0ff" } },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      theme: "dark",
      y: {
        formatter: (val: number, opts: any) => {
          return opts.seriesIndex === 0
            ? `${val} kW`
            : `${val} V`;
        },
      },
    },
    legend: {
      labels: { colors: "#fff" },
    },
    grid: { borderColor: "rgba(255,255,255,0.1)" },
  };

  const series = [
    {
      name: "Load (kW)",
      type: "area",
      data: [260, 280, 206, 190, 250,  310, 290, 270, 240],
    },
    {
      name: "Voltage (V)",
      type: "line",
      data: [215, 216, 214, 215, 216, 217, 218, 219, 218, 217, 216, 215],
    },
  ];

  return (
    <div className=" p-4 pb-6 ">
      <h2 className="text-white text-lg mb-2">System Overview</h2>
      <Chart options={options} series={series} type="area" height={300}  />
    </div>
  );
};

export default AreaChart;
