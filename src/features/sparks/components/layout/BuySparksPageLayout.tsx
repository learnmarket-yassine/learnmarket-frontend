import BackButton from '@/components/ui/BackButton'

type BuySparksPageLayoutProps = {
  children: React.ReactNode
}

const BuySparksPageLayout = ({ children }: BuySparksPageLayoutProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <BackButton text="" />
      </div>
      <div className="w-full space-y-3">
        <h2 className="text-2xl font-semibold text-blue-600">Buy Sparks</h2>
        <p className="text-text text-justify">
          Here you can purchase sparks to use for various services.
        </p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export default BuySparksPageLayout
