import React from 'react'
import RealTimeCharts from '../Components/RealTImeCharts';

const MainDashboard = () => {
   const sections = [
    {
      title: 'Voltage(L-N)',
      values: [
        { label: 'VL1', value: '40.60', unit: 'Volt' },
        { label: 'VL2', value: '52.40', unit: 'Volt' },
        { label: 'VL3', value: '62.00', unit: 'Volt' }
      ]
    },
    {
      title: 'Voltage(L-L)',
      values: [
        { label: 'VL12', value: '81.20', unit: 'Volt' },
        { label: 'VL23', value: '54.30', unit: 'Volt' },
        { label: 'VL31', value: '21.80', unit: 'Volt' }
      ]
    },
    {
      title: 'Current',
      values: [
        { label: 'IL1', value: '83.80', unit: 'Amp' },
        { label: 'IL2', value: '81.90', unit: 'Amp' },
        { label: 'IL3', value: '75.40', unit: 'Amp' }
      ]
    },
    {
      title: 'Frequency',
      values: [
        { label: 'FL1', value: '11.40', unit: 'Hz' },
        { label: 'FL2', value: '67.50', unit: 'Hz' },
        { label: 'FL3', value: '58.40', unit: 'Hz' }
      ]
    },
    {
      title: 'Active Power',
      values: [
        { label: 'PL1', value: '62.00', unit: 'Watt' },
        { label: 'PL2', value: '25.20', unit: 'Watt' },
        { label: 'PL3', value: '32.00', unit: 'Watt' }
      ]
    },
    {
      title: 'Reactive Power',
      values: [
        { label: 'QL1', value: '88.30', unit: 'Watt' },
        { label: 'QL2', value: '98.00', unit: 'Watt' },
        { label: 'QL3', value: '60.30', unit: 'Watt' }
      ]
    },
    {
      title: 'Apparent Power',
      values: [
        { label: 'SL1', value: '24.50', unit: 'VA' },
        { label: 'SL2', value: '85.70', unit: 'VA' },
        { label: 'SL3', value: '98.30', unit: 'VA' }
      ]
    },
    {
      title: 'Cos',
      values: [
        { label: 'CosL1', value: '91.70', unit: 'Deg' },
        { label: 'CosL2', value: '21.00', unit: 'Deg' },
        { label: 'CosL3', value: '48.30', unit: 'Deg' }
      ]
    }
  ];

  return (
    <>
    <h1 className='text-2xl font-bold ml-5'>Main Dashboard</h1>
     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
       {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
              {section.title}
            </h2>
            <div className="space-y-2">
              {section.values.map((item, itemIndex) => (
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
    <div className='flex'>
    <div className='w-[50%] h-64 border-1' >
      <RealTimeCharts/>
    </div>
    <div className='w-[50%] h-64 border-1' >
      <RealTimeCharts/>
    </div>
    </div>
    </>
    
  )
}

export default MainDashboard