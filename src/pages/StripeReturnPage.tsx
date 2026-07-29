import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

// Landed on after the tutor finishes (or bails out of) Stripe's hosted
// Connect onboarding flow. stripeChargesEnabled/stripePayoutsEnabled are
// synced via the account.updated webhook, which may lag slightly behind
// this redirect -- refetching /users/me here just picks up whatever the
// backend currently has; StripeConnectSection shows the "finishing setup"
// transitional state itself if onboarding is still incomplete.
const StripeReturnPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: ['UserInfo'] }).then(() => {
      navigate('/profile', { replace: true })
    })
  }, [navigate, queryClient])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <Loader2 className="size-8 animate-spin text-[#2563EB]" aria-hidden="true" />
      <p className="text-lg font-medium text-[#143681]">Finishing setup...</p>
    </div>
  )
}

export default StripeReturnPage
