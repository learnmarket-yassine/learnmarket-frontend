import { Button } from '@/components/ui/button'
import useConnectPayoutAccount from '@/features/payments/hooks/useConnectPayoutAccount'
import { CircleAlert } from 'lucide-react'

type PayoutDisabledAlertProps = {
  isPayoutEnabled: boolean
  isConnected: boolean
}

const PayoutDisabledAlert = ({ isPayoutEnabled, isConnected }: PayoutDisabledAlertProps) => {
  const connect = useConnectPayoutAccount()

  if (isPayoutEnabled) return null

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-red-900 px-5 py-3">
      <div className="flex items-center gap-3 text-white">
        <CircleAlert className="size-6" />
        <p>
          {isConnected
            ? 'Finish connecting your payout account to receive your earnings.'
            : 'Payouts are not enabled yet, connect a payout account to receive your earnings.'}
        </p>
      </div>
      <Button
        type="button"
        className="text-white hover:underline"
        disabled={connect.isPending}
        onClick={() => connect.mutate()}
      >
        {connect.isPending
          ? 'Redirecting...'
          : isConnected
            ? 'Resume setup'
            : 'Connect payout account'}
      </Button>
    </div>
  )
}

export default PayoutDisabledAlert
