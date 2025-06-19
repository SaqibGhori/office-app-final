import { useState } from 'react'
import { useSocket } from '../hooks/useSocket'; // adjust path if needed
import RealTimeCharts from '../Components/RealTImeCharts';
import { Link } from 'react-router-dom';

// Reading type based on socket data
type Reading = {
  voltageLN: { v1: number; v2: number; v3: number };
  voltageLL: { v12: number; v23: number; v31: number };
  current: { i1: number; i2: number; i3: number };
  frequency: { f1: number; f2: number; f3: number };
  activePower: { pl1: number; pl2: number; pl3: number };
  reactivePower: { ql1: number; ql2: number; ql3: number };
  apparentPower: { sl1: number; sl2: number; sl3: number };
  cos: { cosl1: number; cosl2: number; cosl3: number };
  _id?: string;
  createdAt?: string;
  __v?: number;
};

const MainDashboard = () => {
  const [selectedTitle, setSelectedTitle] = useState<string | null>("Voltage(L-N)");
  const [reading, setReading] = useState<Reading | null>(null);

  // 🧠 Use the reusable socket hook
  useSocket((data: Reading) => {
    setReading(data);
  });
  const sections = reading
    ? [
      {
        title: 'Voltage(L-N)',
        values: [
          { label: 'VL1', value: reading.voltageLN.v1, unit: 'volt' },
          { label: 'VL2', value: reading.voltageLN.v2, unit: 'volt' },
          { label: 'VL3', value: reading.voltageLN.v3, unit: 'volt' },
        ],
      },
      {
        title: 'Voltage(L-L)',
        values: [
          { label: 'VL12', value: reading.voltageLL.v12, unit: 'volt' },
          { label: 'VL23', value: reading.voltageLL.v23, unit: 'volt' },
          { label: 'VL31', value: reading.voltageLL.v31, unit: 'volt' },
        ],
      },
      {
        title: 'Current',
        values: [
          { label: 'IL1', value: reading.current.i1, unit: 'amp' },
          { label: 'IL2', value: reading.current.i2, unit: 'amp' },
          { label: 'IL3', value: reading.current.i3, unit: 'amp' },
        ],
      },
      {
        title: 'Frequency',
        values: [
          { label: 'FL1', value: reading.frequency.f1, unit: 'Hz' },
          { label: 'FL2', value: reading.frequency.f2, unit: 'Hz' },
          { label: 'FL3', value: reading.frequency.f3, unit: 'Hz' },
        ],
      },
      {
        title: 'Active Power',
        values: [
          { label: 'PL1', value: reading.activePower.pl1, unit: 'Watt' },
          { label: 'PL2', value: reading.activePower.pl2, unit: 'Watt' },
          { label: 'PL3', value: reading.activePower.pl3, unit: 'Watt' },
        ],
      },
      {
        title: 'Reactive Power',
        values: [
          { label: 'QL1', value: reading.reactivePower.ql1, unit: 'Watt' },
          { label: 'QL2', value: reading.reactivePower.ql2, unit: 'Watt' },
          { label: 'QL3', value: reading.reactivePower.ql3, unit: 'Watt' },
        ],
      },
      {
        title: 'Apparent Power',
        values: [
          { label: 'SL1', value: reading.apparentPower.sl1, unit: 'VA' },
          { label: 'SL2', value: reading.apparentPower.sl2, unit: 'VA' },
          { label: 'SL3', value: reading.apparentPower.sl3, unit: 'VA' },
        ],
      },
      {
        title: 'Cos',
        values: [
          { label: 'CosL1', value: reading.cos.cosl1, unit: 'Deg' },
          { label: 'CosL2', value: reading.cos.cosl2, unit: 'Deg' },
          { label: 'CosL3', value: reading.cos.cosl3, unit: 'Deg' },
        ],
      },
    ]
    : [];

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className="text-2xl font-bold ml-5">Main Dashboard</h1>
        </div>

        <div className="flex gap-2 p-4">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Energy
          </button>
          <Link to='/harmonics' className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Harmonics
          </Link>
          <Link to='/fileview' className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            File View
          </Link>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Alarm
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
        {reading
          ? sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              onClick={() => {
                setSelectedTitle(section.title);
                console.log("Clicked card title:", section.title);
              }}
              className="bg-white rounded-lg shadow p-4"
            >
              <h2 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.values.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-600 w-16">{item.label}</span>
                    <div className="flex-1 flex items-center justify-end">
                      <span className="text-gray-800 font-mono mr-1">
                        {item.value}
                      </span>
                      <span className="text-gray-500 text-sm">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
          : // 👇 Skeleton Loader
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 animate-pulse space-y-4"
            >
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
      </div>


      <div className="flex">
        <div className='w-[100%] h-96'>
          <RealTimeCharts selectedTitle={selectedTitle} />
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
