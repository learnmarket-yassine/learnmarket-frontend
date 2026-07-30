import { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { useStore } from '@/store/store'
import {
  createPaymentsSocketConnection,
  destroyPaymentsSocketConnection,
} from '@/lib/payments-socket-manager'

interface ProposalAcceptedEvent {
  proposalId: string
}

/**
 * Connects only while `proposalId` is set (i.e. while the "finalizing your
 * booking" waiting screen is actually open) -- unlike the always-on
 * messaging/sessions sockets, there's no reason to keep this connection
 * alive app-wide, so it's self-contained rather than backed by a global
 * Zustand slice.
 */
export function useProposalAcceptedSocket(proposalId: string | null, onAccepted: () => void) {
  const accessToken = useStore((state) => state.auth.authenticationResult?.token)

  useEffect(() => {
    if (!proposalId || !accessToken) return

    let socket: Socket | null = null
    const handleAccepted = (event: ProposalAcceptedEvent) => {
      if (event.proposalId !== proposalId) return
      onAccepted()
    }

    socket = createPaymentsSocketConnection(accessToken, (connected) => {
      connected.on('proposal:accepted', handleAccepted)
    })

    return () => {
      socket?.off('proposal:accepted', handleAccepted)
      destroyPaymentsSocketConnection()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalId, accessToken])
}
