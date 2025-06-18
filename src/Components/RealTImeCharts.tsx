import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useSocket } from "../hooks/useSocket"; // adjust path

type RealTimeChartProps = {
  selectedTitle: string | null;
};

type Reading = {
  voltageLN: { v1: number; v2: number; v3: number };
  voltageLL: { v12: number; v23: number; v31: number };
  current: { i1: number; i2: number; i3: number };
  frequency: { f1: number; f2: number; f3: number };
  activePower: { pl1: number; pl2: number; pl3: number };
  reactivePower: { ql1: number; ql2: number; ql3: number };
  apparentPower: { sl1: number; sl2: number; sl3: number };
  cos: { cosl1: number; cosl2: number; cosl3: number };
};

const keyMap: Record<string, keyof Reading> = {
  "Voltage(L-N)": "voltageLN",
  "Voltage(L-L)": "voltageLL",
  "Current": "current",
  "Frequency": "frequency",
  "Active Power": "activePower",
  "Reactive Power": "reactivePower",
  "Apparent Power": "apparentPower",
  "Cos": "cos",
};

const RealTImeCharts: React.FC<RealTimeChartProps> = ({ selectedTitle }) => {
  const [reading, setReading] = useState<Reading | null>(null);
  const [series, setSeries] = useState<any[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);

  useSocket((data: Reading) => {
    setReading(data);
  });

 useEffect(() => {
  if (reading && selectedTitle && keyMap[selectedTitle]) {
    const sectionKey = keyMap[selectedTitle];
    const sectionData = reading[sectionKey];

    const currentTime = new Date().toLocaleTimeString();

    setTimestamps(prev => [...prev, currentTime].slice(-10));

    setSeries(prevSeries => {
      return Object.entries(sectionData).map(([label, value]) => {
        const upperLabel = label.toUpperCase();
        const existing = prevSeries.find(s => s.name === upperLabel);
        const updatedData = existing ? [...existing.data, value] : [value];

        return {
          name: upperLabel,
          data: updatedData.slice(-10),
        };
      });
    });
  }
}, [reading, selectedTitle]);



  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      height: 350,
       toolbar: {
      show: false, // 👈 this hides the entire toolbar
    },
    },
    xaxis: {
      categories:timestamps, // static since it's real-time (or use timestamps)
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
        <Chart options={options} series={series} type="line" height={500} />
      ) : (
        <p>Waiting for {selectedTitle || "data"}...</p>
      )}
    </div>
  );
};

export default RealTImeCharts;
