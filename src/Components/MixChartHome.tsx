import React from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface Series {
  name: string;
  type: "column" | "area" | "line";
  data: number[];
}

const MixChartHome: React.FC = () => {
  // state ko ApexOptions type do
  const [options] = React.useState<ApexOptions>({
    chart: {
      height: 350,
      type: "line",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [0, 2, 5],
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100],
      },
    },
    labels: [
      "01/01/2003","02/01/2003","03/01/2003","04/01/2003","05/01/2003",
      "06/01/2003","07/01/2003","08/01/2003","09/01/2003","10/01/2003","11/01/2003",
    ],
    markers: { size: 0 },
    xaxis: { type: "datetime" },
    yaxis: { title: { text: "Points" } },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        // formatter must return string only
        formatter: (value: number | undefined): string => {
          // agar value undefined ho to empty string
          if (value == null) return "";
          return `${value.toFixed(0)} points`;
        },
      },
    },
  });

  const series: Series[] = [
    { name: "Gateway 1", type: "column", data: [23,11,22,27,13,22,37,21,44,22,30] },
    { name: "Gateway 2", type: "area",   data: [44,55,41,67,22,43,21,41,56,27,43] },
    { name: "Gateway 3", type: "line",   data: [30,25,36,30,45,35,64,52,59,36,39] },
  ];

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default MixChartHome;
