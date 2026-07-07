import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const ConnectsPurchaseSuccessPage = () => {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Payment successful</h1>
      {sessionId && (
        <p className="text-sm text-gray-500">
          Stripe session: <code>{sessionId}</code>
        </p>
      )}
      <p className="text-sm text-gray-500">
        Your connects credit once the webhook is processed — instant if you're forwarding events
        with the Stripe CLI.
      </p>
      <Button asChild>
        <Link to="/connects">View my connects</Link>
      </Button>
    </div>
  )
}

export default ConnectsPurchaseSuccessPage
