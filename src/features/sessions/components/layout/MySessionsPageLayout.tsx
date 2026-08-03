import BackButton from '@/components/ui/BackButton'

type MySessionsLayoutProps = {
  children: React.ReactNode
}

const MySessionsLayout = ({ children }: MySessionsLayoutProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <BackButton text="" />
      </div>
      <div className="w-full space-y-3">
        <h2 className="text-2xl font-semibold text-blue-600">Sessions</h2>
        <p className="text-text text-justify">
          Here you can manage your scheduled and past sessions.
        </p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export default MySessionsLayout
