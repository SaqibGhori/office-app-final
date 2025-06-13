// pages/test.tsx
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

type Reading = {
  voltage: number
  current: number
  frequency: number
  createdAt: string
}

export default function Test() {
  const [reading, setReading] = useState<Reading | null>(null)

  useEffect(() => {
    // 1️⃣ Connect to your backend
    const socket = io('http://localhost:3000')

    // 2️⃣ Listen for “new-reading” events
    socket.on('new-reading', (data: Reading) => {
      console.log('🚀 new-reading', data)
      setReading(data)
    })

    // 3️⃣ Clean up on unmount
    return () => {
      socket.disconnect()
    }
  }, [])

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
