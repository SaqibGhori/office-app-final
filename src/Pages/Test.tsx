// pages/test.tsx
import { useState } from 'react'
import { useSocket } from '../hooks/useSocket'  // ensure the path is correct

type Reading = {
  voltageLN: {
    v1: number;
    v2: number;
    v3: number;
  };
  voltageLL: {
    v12: number;
    v23: number;
    v31: number;
  };
  current: {
    i1: number;
    i2: number;
    i3: number;
  };
  voltage: {
    il3: number;
  };
  frequency: {
    f1: number;
    f2: number;
    f3: number;
  };
  activePower: {
    pl1: number;
    pl2: number;
    pl3: number;
  };
  reactivePower: {
    ql1: number;    
    ql2: number;
    ql3: number;
  };
  apparentPower: {
    sl1: number;
    sl2: number;
    sl3: number;
  };
  cos: {
    cosl1: number;
    cosl2: number;
    cosl3: number;
  };
};

export default function TestPage() {
  const [reading, setReading] = useState<Reading | null>(null)

  // useSocket takes your callback and returns the socket instance (unused here)
  useSocket((data: Reading) => {
    console.log('🚀 new-reading', data)
     if (
    data?.voltageLN?.v1 !== undefined &&
    data?.voltageLL?.v12 !== undefined &&
    data?.current?.i1 !== undefined &&
    data?.voltage?.il3 !== undefined &&
    data?.frequency?.f1 !== undefined &&
    data?.activePower?.pl1 !== undefined &&
    data?.reactivePower?.ql1 !== undefined &&
    data?.apparentPower?.sl1 !== undefined &&
    data?.cos?.cosl1 !== undefined
  ) {
    setReading(data as Reading)
  } else {
    console.warn('⚠️ Invalid or incomplete data:', data)
  }
    setReading(data)
  })
  // const socket = useSocket((data) => {
  //   console.log('New reading:', data);
  // });

  const sections = reading ? [
    {
      title: 'Voltage(L-N)',
      valuse: [
        { label: 'VL1', value: reading?.voltageLN?.v1, unit: 'volt' },
        { label: 'VL2', value: reading?.voltageLN?.v2, unit: 'volt' },
        { label: 'VL3', value: reading?.voltageLN?.v3, unit: 'volt' }
      ]

    },
    {
      title: 'Voltage(L-L)',
      valuse: [
        { label: 'VL12', value: reading?.voltageLL?.v12?? '-', unit: 'volt' },
        { label: 'VL23', value: reading?.voltageLL?.v23?? '-', unit: 'volt' },
        { label: 'VL31', value: reading?.voltageLL?.v31?? '-', unit: 'volt' }
      ]

    },
    {
      title: 'Current',
      valuse: [
        { label: 'IL1', value: reading?.current?.i1?? '-', unit: 'amp' },
        { label: 'IL2', value: reading?.current?.i2?? '-', unit: 'amp' },
        { label: 'IL3', value: reading?.current?.i3?? '-', unit: 'amp' }
      ]
    },
    {
      title: 'Frequency',
      valuse: [
        { label: 'FL1', value: reading?.frequency?.f1?? '-', unit: 'Hz' },
        { label: 'FL2', value: reading?.frequency?.f2?? '-', unit: 'Hz' },
        { label: 'FL3', value: reading?.frequency?.f3?? '-', unit: 'Hz' }
      ]
    },
    {
      title: 'Active Power',
      valuse: [
        { label: 'PL1', value: reading?.activePower?.pl1?? '-', unit: 'Watt' },
        { label: 'PL2', value: reading?.activePower?.pl2?? '-', unit: 'Watt' },
        { label: 'PL3', value: reading?.activePower?.pl3?? '-', unit: 'Watt' }
      ]
    },
    {
      title: 'Reactive Power',
      valuse: [
        { label: 'IL1', value: reading?.reactivePower?.ql1?? '-', unit: 'Watt' },
        { label: 'IL2', value: reading?.reactivePower?.ql2?? '-', unit: 'Watt' },
        { label: 'IL3', value: reading?.reactivePower?.ql3?? '-', unit: 'Watt' }
      ]
    },
    {
      title: 'Apparent Power',
      valuse: [
        { label: 'SL1', value: reading?.apparentPower?.sl1?? '-', unit: 'VA' },
        { label: 'SL2', value: reading?.apparentPower?.sl2?? '-', unit: 'VA' },
        { label: 'SL3', value: reading?.apparentPower?.sl3?? '-', unit: 'VA' }
      ]
    },
    {
      title: 'Cos',
      valuse: [
        { label: 'CosL1', value: reading?.cos?.cosl1?? '-', unit: 'Deg' },
        { label: 'CosL2', value: reading?.cos?.cosl2?? '-', unit: 'Deg' },
        { label: 'CosL3', value: reading?.cos?.cosl3?? '-', unit: 'Deg' }
      ]
    }
  ]
    : [];


  return (
    <>
    <h1>Testing Data</h1>
    {/* {reading ?   */}
    {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
            {section.title}
          </h2>
          <div className="space-y-2">
            {section.valuse.map((item, itemIndex) => (
              <div key={itemIndex} className="flex justify-between items-center">
                <span className="text-gray-600 w-16">{item.label}</span>
                <div className="flex-1 flex items-center justify-end">
                  <span className="text-gray-800 font-mono mr-1">{item.value}</span>
                  <span className="text-gray-500 text-sm">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div> */}
    {/* // : "loading..."} */}
    </>

  )
}