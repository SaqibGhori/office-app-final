import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface ReadingData {
  [category: string]: {
    [subcategory: string]: number;
  };
}

interface Reading {
  gatewayId: string;
  timestamp: string;
  data: ReadingData;
}

interface Pair {
  cat: string;
  sub: string;
}

interface Props {
  data: Reading[];
  pairs: Pair[];
}

const FileViewChart: React.FC<Props> = ({ data, pairs }) => {
  const series = pairs.map(({ cat, sub }) => ({
    name: `${sub} (${cat})`,  // ✅ label me category bhi show hoga
    data: data.map(d => ({
      x: new Date(d.timestamp).getTime(), // ✅ numeric timestamp for proper spacing
      y: d.data?.[cat]?.[sub] ?? null,
    })),
  }));

  const options: ApexOptions = {
    chart: {
      type: 'line',
      zoom: { enabled: true },
      toolbar: { show: false },
    },
    stroke: { curve: 'smooth' },
    xaxis: {
      type: 'datetime',
      title: { text: 'Timestamp' },
    },
    yaxis: {
      title: { text: 'Values' },
    },
    tooltip: {
      x: { format: 'dd MMM yyyy HH:mm' },
    },
    legend: {
      show: true,
      position: 'top',
    },
  };

  return <Chart options={options} series={series} type="line" height={400} />;
};

export default FileViewChart;
