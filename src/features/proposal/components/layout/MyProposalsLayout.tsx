type MyProposalsLayoutProps = {
  children: React.ReactNode
}

const MyProposalsLayout: React.FC<MyProposalsLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-3xl font-bold text-[#1E293B]">My Proposals</h1>
      <div className="flex-1 space-y-8">{children}</div>
    </div>
  )
}

export default MyProposalsLayout
