type Props = {
  children: React.ReactNode
}

const MyLearningRequestsLayout = ({ children }: Props) => {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#1E293B]">Your Learning Requests</h1>
          <p className="text-sm text-[#4B5563]">
            Manage your active learning goals and connect with mentors who specialize in your areas
            of interest.
          </p>
        </div>
      </div>
      <div className="flex flex-1">{children}</div>
    </div>
  )
}

export default MyLearningRequestsLayout
