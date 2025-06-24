// components/LineChart.tsx
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

interface Props {
    data: Reading[];
    category: string;
    subcategories: string[];
}

const FileViewChart: React.FC<Props> = ({ data, category, subcategories }) => {
    const series = subcategories.map(sub => ({
        name: sub,
        data: data.map(d => ({
            x: new Date(d.timestamp).toLocaleString(),
            y: d.data?.[category]?.[sub] ?? null
        }))
    }));

    const options: ApexOptions = {
        chart: {
            type: 'line' as const, // ✅ fix: assert literal type
            zoom: { enabled: true },
            toolbar: { show: false },
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            type: 'datetime', // ✅ this enables proper spacing
            title: { text: 'Timestamp' }
        },          
        yaxis: {
            title: { text: category },
        },
        tooltip: {
            x: { format: 'dd MMM yyyy HH:mm' },
        },
    };


    return <Chart options={options} series={series} type="line" height={400} />;
};

export default FileViewChart;
