import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/features/myProfile/components/ui/EmptyState'
import useGetSparksBalance from '@/features/sparks/hooks/useGetSparksBalance'
import useGetSparksOffers from '@/features/sparks/hooks/useGetSparksOffers'
import useCreateSparksPurchaseIntent from '@/features/sparks/hooks/useCreateSparksPurchaseIntent'
import BuySparksModal from '@/features/sparks/components/BuySparksModal'
import { formatCentsToCurrency } from '@/features/sparks/utils/format'

const SETTINGS_SPARKS_SECTION = 5

const BuySparksPage = () => {
  const navigate = useNavigate()
  const { data: balance, isLoading: isBalanceLoading } = useGetSparksBalance()
  const { data: offers, isLoading: isOffersLoading, isError: isOffersError } = useGetSparksOffers()
  const createPurchaseIntent = useCreateSparksPurchaseIntent()

  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const selectedOffer = useMemo(
    () => offers?.find((offer) => offer.id === selectedOfferId) ?? offers?.[0] ?? null,
    [offers, selectedOfferId]
  )

  const currentBalance = balance?.sparksBalance ?? 0
  const newBalance = currentBalance + (selectedOffer?.sparksAmount ?? 0)

  const handleBuy = async () => {
    if (!selectedOffer) return
    const result = await createPurchaseIntent.mutateAsync(selectedOffer.id)
    if (result.clientSecret) {
      setClientSecret(result.clientSecret)
    }
  }

  const handleClose = () => setClientSecret(null)

  const handleConfirmed = () => {
    setClientSecret(null)
    navigate('/settings', { state: { section: SETTINGS_SPARKS_SECTION } })
  }

  const handleCancel = () => navigate(-1)

  return (
    <div className="rounded-3xl border border-[#E0E2E6] p-8">
      <h1 className="mb-8 text-3xl font-semibold text-[#1E293B]">Buy Sparks</h1>

      <div className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-[#1E293B]">Your available Sparks</h2>
          {isBalanceLoading ? (
            <Skeleton className="h-6 w-12" />
          ) : (
            <p className="text-base font-medium">{currentBalance}</p>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-semibold text-[#1E293B]">Select the amount to buy</h2>
          {isOffersLoading ? (
            <Skeleton className="h-10 w-full max-w-xs rounded-md" />
          ) : isOffersError ? (
            <EmptyState message="Something went wrong while loading Sparks offers." />
          ) : !offers || offers.length === 0 ? (
            <EmptyState message="No offers currently available." />
          ) : (
            <Select value={selectedOffer?.id} onValueChange={setSelectedOfferId}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select an amount" />
              </SelectTrigger>
              <SelectContent>
                {offers.map((offer) => (
                  <SelectItem key={offer.id} value={offer.id}>
                    {offer.sparksAmount} Sparks for{' '}
                    {formatCentsToCurrency(offer.priceCents, offer.currency)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {selectedOffer && (
          <>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-[#1E293B]">
                Your account will be charged
              </h2>
              <p className="text-base font-medium">
                {formatCentsToCurrency(selectedOffer.priceCents, selectedOffer.currency)}
              </p>
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-semibold text-[#1E293B]">
                Your new Sparks balance will be
              </h2>
              <p className="text-base font-medium">{newBalance}</p>
            </div>
          </>
        )}

        <p className="text-sm text-muted-foreground">
          You're authorizing Yora to charge your card for this purchase, processed securely by
          Stripe. Your Sparks balance updates automatically once the payment is confirmed.
        </p>

        {createPurchaseIntent.isError && (
          <p className="text-sm text-red-600">
            Something went wrong preparing your purchase. Please try again.
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-[#E0E2E6] pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            className="h-full whitespace-nowrap rounded-full px-6 py-3 font-medium text-[#1A46A7]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleBuy}
            disabled={!selectedOffer || createPurchaseIntent.isPending}
            className="h-full whitespace-nowrap rounded-full bg-[#2563EB] px-8 py-3 font-semibold text-white hover:bg-[#2563EB]/90"
          >
            {createPurchaseIntent.isPending ? 'Preparing...' : 'Buy'}
          </Button>
        </div>
      </div>

      {selectedOffer && clientSecret && (
        <BuySparksModal
          open={!!clientSecret}
          clientSecret={clientSecret}
          offerName={selectedOffer.name}
          onClose={handleClose}
          onConfirmed={handleConfirmed}
        />
      )}
    </div>
  )
}

export default BuySparksPage
