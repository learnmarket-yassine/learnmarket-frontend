import { Socket } from 'socket.io-client'

type SessionsSocketState = {
  socket: Socket | null
  setSocket: (socket: Socket | null) => void
}
export type SessionsSlice = {
  sessionsSocket: SessionsSocketState
}
