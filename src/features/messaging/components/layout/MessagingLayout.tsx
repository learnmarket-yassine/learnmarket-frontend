import BackButton from '@/components/ui/BackButton'

type MessagingLayoutProps = {
  children: React.ReactNode
}

const MessagingLayout: React.FC<MessagingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <BackButton text="" />
      </div>
      <div className="w-full space-y-3">
        <h1 className="text-3xl font-bold text-blue-600">Messages</h1>
        <p className="text-text text-justify">
          Communicate with others, discuss lesson details, ask questions, and keep track of your
          conversations in one place.
        </p>
      </div>
      <div className="flex-1 space-y-8">{children}</div>
    </div>
  )
}

export default MessagingLayout
