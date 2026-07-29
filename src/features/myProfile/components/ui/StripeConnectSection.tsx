import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import useConnectPayoutAccount from '@/features/payments/hooks/useConnectPayoutAccount'
import { TutorProfile } from '../../store/types'

interface StripeConnectSectionProps {
  tutorProfile?: TutorProfile | null
}

function StripeConnectSection({ tutorProfile }: StripeConnectSectionProps) {
  const connect = useConnectPayoutAccount()

  const isConnected = !!tutorProfile?.stripeAccountId
  const isFullyEnabled =
    !!tutorProfile?.stripeChargesEnabled && !!tutorProfile?.stripePayoutsEnabled

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold text-[#143681]">Payouts</p>
        {isFullyEnabled ? (
          <Badge
            variant="secondary"
            className="h-8 rounded-lg border-none bg-[#F5F6F7] px-3 py-1 text-xs text-[#102A63]"
          >
            Payouts enabled
          </Badge>
        ) : (
          <Button
            type="button"
            size="sm"
            disabled={connect.isPending}
            onClick={() => connect.mutate()}
          >
            {connect.isPending
              ? 'Redirecting...'
              : isConnected
                ? 'Resume setup'
                : 'Connect payout account'}
          </Button>
        )}
      </div>
      {isConnected && !isFullyEnabled && (
        <p className="mt-1 text-sm text-muted-foreground">
          Finishing setup with Stripe -- complete onboarding to start receiving payouts.
        </p>
      )}
      {!isConnected && (
        <p className="mt-1 text-sm text-muted-foreground">
          Connect a Stripe account to get paid for completed sessions.
        </p>
      )}
    </div>
  )
}

export default StripeConnectSection
