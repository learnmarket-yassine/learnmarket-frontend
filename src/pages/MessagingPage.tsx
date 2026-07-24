import MessagingLayout from '@/features/messaging/components/layout/MessagingLayout'

const MessagingPage = () => {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-3xl font-bold text-[#1E293B]">Messages</h1>
      <MessagingLayout />
    </div>
  )
}

export default MessagingPage
