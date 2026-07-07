import { useStore } from '@/store/store'
import useConnectsBalance from '@/features/connects/hooks/useConnectsBalance'
import useConnectsTransactions from '@/features/connects/hooks/useConnectsTransactions'
import useConnectsPackages from '@/features/connects/hooks/useConnectsPackages'
import usePurchaseConnects from '@/features/connects/hooks/usePurchaseConnects'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DemoNav from '@/components/layout/DemoNav'

const ConnectsPage = () => {
  const user = useStore((state) => state.auth.user)
  const balanceQuery = useConnectsBalance()
  const transactionsQuery = useConnectsTransactions()
  const packagesQuery = useConnectsPackages()
  const purchaseMutation = usePurchaseConnects()

  if (user?.role !== 'TUTOR') {
    return (
      <div className="flex flex-col gap-4">
        <DemoNav />
        <p>Connects are only for tutors. Log in as a tutor to see this page.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <DemoNav />

      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Connects</h1>
        <p className="text-lg">
          Balance: <span className="font-bold">{balanceQuery.data?.connects ?? '…'}</span> connects
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Buy more connects</h2>
        <div className="flex flex-wrap gap-4">
          {packagesQuery.data?.map((pkg) => (
            <div key={pkg.id} className="flex w-56 flex-col gap-2 rounded-lg border p-4">
              <p className="font-semibold">{pkg.name}</p>
              <p className="text-sm text-gray-500">{pkg.amount} connects</p>
              <p className="text-lg font-bold">
                ${(pkg.priceCents / 100).toFixed(2)} {pkg.currency.toUpperCase()}
              </p>
              <Button
                disabled={purchaseMutation.isPending}
                onClick={() => purchaseMutation.mutate(pkg.id)}
              >
                Buy
              </Button>
            </div>
          ))}
          {packagesQuery.data?.length === 0 && <p>No packages available yet.</p>}
        </div>
        {purchaseMutation.isError && (
          <p className="text-sm text-red-600">Could not start checkout. Try again.</p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Transaction history</h2>
        <div className="flex flex-col gap-2">
          {transactionsQuery.data?.items.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded border p-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <Badge variant={tx.amount >= 0 ? 'default' : 'destructive'}>{tx.type}</Badge>
                <span>{new Date(tx.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {tx.amount >= 0 ? '+' : ''}
                  {tx.amount}
                </span>
                <span className="text-gray-500">balance: {tx.balanceAfter}</span>
              </div>
            </div>
          ))}
          {transactionsQuery.data?.items.length === 0 && <p>No transactions yet.</p>}
        </div>
      </section>
    </div>
  )
}

export default ConnectsPage
