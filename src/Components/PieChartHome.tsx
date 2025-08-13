// src/components/PieChartHome.tsx
import React from "react";
import ReactApexChart from "react-apexcharts";

// 1️⃣ Define ek interface for your chart state
interface ChartState {
  series: number[];
  options: {
    chart: {
      width: number;
      type: "pie";
    };
    labels: string[];
    responsive: Array<{
      breakpoint: number;
      options: {
        chart: { width: number };
        legend: { position: string };
      };
    }>;
  };
}

const PieChartHome: React.FC = () => {
  // 2️⃣ useState ko ChartState type do
  const [state] = React.useState<ChartState>({
    series: [44, 55, 13, 43, 22],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="pie"
          width={380}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default PieChartHome;
