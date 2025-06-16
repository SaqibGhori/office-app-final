// pages/test.tsx
import { useEffect, useState } from 'react'
import {useSocket} from '../hooks/useSocket'  // ensure the path is correct

type Reading = {
  voltage: number
  current: number
  frequency: number
  createdAt: string
}

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

  


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Socket Test</h1>
      {reading ? (
        <div className="space-y-2 p-4 border rounded shadow w-64">
          <div>
            <strong>Time:</strong>{' '}
            {new Date(reading.createdAt).toLocaleTimeString()}
          </div>
          <div className="flex justify-between">
            <span>V:</span>
            <span>{reading.voltage.toFixed(2)} V</span>
          </div>
          <div className="flex justify-between">
            <span>I:</span>
            <span>{reading.current.toFixed(2)} A</span>
          </div>
          <div className="flex justify-between">
            <span>F:</span>
            <span>{reading.frequency.toFixed(2)} Hz</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Waiting for data…</p>
      )}
    </div>
  )
}