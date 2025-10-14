"use client";
import React from "react";
import Chart from "react-apexcharts";

const BarChart: React.FC = () => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: "#fff",
    },
    colors: ["#4aa8ff"], // light blue bars
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "50%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "5:00","6:00","7:00","8:00","9:00",
        "10:00","11:00","12:00","13:00","14:00","15:00","16:00"
      ],
      labels: { style: { colors: "#fff" } },
    },
    yaxis: {
      min: 0,
      max: 320,
      tickAmount: 8,
      labels: { style: { colors: "#fff" } },
      title: { text: "", style: { color: "#fff" } }
    },
    grid: { borderColor: "rgba(255,255,255,0.1)" },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `${val} kW`,
      },
    },
    legend: { show: false },
  };

  const series = [
    {
      name: "Power (kW)",
      data: [120, 150, 180, 210, 240, 280, 300, 310, 305, 290, 260, 220],
    },
  ];

  return (
    <div className=" p-4 ">
      <h2 className="text-white text-lg mb-2">Power Forecasting</h2>
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default BarChart;
