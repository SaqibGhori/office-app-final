// pages/test.tsx
import { useState } from 'react'
import { useSocket } from '../hooks/useSocket'  // ensure the path is correct

type Reading = {
  voltageln: {
    v1: number;
    v2: number;
    v3: number;
  };
  voltagell: {
    v12: number;
    v23: number;
    v31: number;
  };
  current: {
    il1: number;
    il2: number;
  };
  voltage: {
    il3: number;
  };
  frequency: {
    fl1: number;
    fl2: number;
    fl3: number;
  };
  activePower: {
    PL1: number;
    PL2: number;
    PL3: number;
  };
  reactivePower: {
    PL1: number;
    PL2: number;
    PL3: number;
  };
  apparentPower: {
    SL1: number;
    SL2: number;
    SL3: number;
  };
  cos: {
    l1: number;
    l2: number;
    l3: number;
  };
};

export default function TestPage() {
  const [reading, setReading] = useState<Reading | null>(null)

  // useSocket takes your callback and returns the socket instance (unused here)
  useSocket((data: Reading) => {
    console.log('🚀 new-reading', data)
    setReading(data)
  })
  // const socket = useSocket((data) => {
  //   console.log('New reading:', data);
  // });

  const sections = reading ? [
    {
      title: 'Voltage(L-N)',
      valuse: [
        { label: 'VL1', value: reading.voltageln.v1, unit: 'volt' },
        { label: 'VL2', value: reading.voltageln.v2, unit: 'volt' },
        { label: 'VL3', value: reading.voltageln.v3, unit: 'volt' }
      ]

    },
    {
      title: 'Voltage(L-L)',
      valuse: [
        { label: 'VL12', value: reading.voltagell.v12, unit: 'volt' },
        { label: 'VL23', value: reading.voltagell.v23, unit: 'volt' },
        { label: 'VL31', value: reading.voltagell.v31, unit: 'volt' }
      ]

    },
    {
      title: 'Current',
      valuse: [
        { label: 'IL1', value: reading.current.il1, unit: 'amp' },
        { label: 'IL2', value: reading.current.il2, unit: 'amp' },
        { label: 'IL3', value: reading.voltage.il3, unit: 'amp' }
      ]
    },
    {
      title: 'Frequency',
      valuse: [
        { label: 'FL1', value: reading.frequency.fl1, unit: 'Hz' },
        { label: 'FL2', value: reading.frequency.fl2, unit: 'Hz' },
        { label: 'FL3', value: reading.frequency.fl3, unit: 'Hz' }
      ]
    },
    {
      title: 'Active Power',
      valuse: [
        { label: 'PL1', value: reading.activePower.PL1, unit: 'Watt' },
        { label: 'PL2', value: reading.activePower.PL1, unit: 'Watt' },
        { label: 'PL3', value: reading.activePower.PL1, unit: 'Watt' }
      ]
    },
    {
      title: 'Reactive Power',
      valuse: [
        { label: 'IL1', value: reading.reactivePower.PL1, unit: 'Watt' },
        { label: 'IL2', value: reading.reactivePower.PL1, unit: 'Watt' },
        { label: 'IL3', value: reading.reactivePower.PL1, unit: 'Watt' }
      ]
    },
    {
      title: 'Apparent Power',
      valuse: [
        { label: 'SL1', value: reading.apparentPower.SL1, unit: 'VA' },
        { label: 'SL2', value: reading.apparentPower.SL2, unit: 'VA' },
        { label: 'SL3', value: reading.apparentPower.SL3, unit: 'VA' }
      ]
    },
    {
      title: 'Cos',
      valuse: [
        { label: 'CosL1', value: reading.cos.l1, unit: 'Deg' },
        { label: 'CosL2', value: reading.cos.l2, unit: 'Deg' },
        { label: 'CosL3', value: reading.cos.l3, unit: 'Deg' }
      ]
    }
  ]
    : [];


  return (
    <>
    {/* {reading ?   */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
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
    </div>
    {/* // : "loading..."} */}
    </>

  )
}