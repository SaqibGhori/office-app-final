import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

let sharedSocket: Socket

export function getSocket() {
  if (!sharedSocket) {
    sharedSocket = io('http://localhost:3000', {
      transports: ['websocket'],  // ← disable polling
      path: '/socket.io',
    })
  }
  return sharedSocket
}

export function useSocket(onReading?: (data:any)=>void) {
  const socket = useRef(getSocket()).current

  useEffect(() => {
    if (onReading) socket.on('new-reading', onReading)
    return () => {
      if (onReading) socket.off('new-reading', onReading)
    }
  }, [onReading, socket])

  return socket
}
