import { io, Socket } from 'socket.io-client'

const SOCKET_URL = `${new URL(import.meta.env.VITE_API_URL).origin}/messaging`

let instance: Socket | null = null

export function createSocketConnection(token: string, onConnect: (socket: Socket) => void) {
  instance = io(SOCKET_URL, { auth: { token } })
  instance.on('connect', () => onConnect(instance!))
  return instance
}

export function destroySocketConnection() {
  if (!instance) return
  instance.removeAllListeners('connect')
  instance.disconnect()
  instance = null
}
