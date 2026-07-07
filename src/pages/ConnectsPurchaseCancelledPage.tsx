import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const ConnectsPurchaseCancelledPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Checkout cancelled</h1>
      <Button asChild variant="outline">
        <Link to="/connects">Back to connects</Link>
      </Button>
    </div>
  )
}

export default ConnectsPurchaseCancelledPage
