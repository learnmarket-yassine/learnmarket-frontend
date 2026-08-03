import BackButton from '@/components/ui/BackButton'

type MyProposalsLayoutProps = {
  children: React.ReactNode
}

const MyProposalsLayout: React.FC<MyProposalsLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <BackButton text="" />
      </div>
      <div className="w-full space-y-3">
        <h1 className="text-3xl font-bold text-blue-600">My Proposals</h1>
        <p className="text-text text-justify">
          Here you can manage your submitted proposals and view their status.
        </p>
      </div>
      <div className="flex-1 space-y-8">{children}</div>
    </div>
  )
}

export default MyProposalsLayout
