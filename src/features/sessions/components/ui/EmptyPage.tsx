import { useStore } from '@/store/store'

type EmptyPageProps = {
  description: string
  actionButton?: React.ReactNode
}

export const EmptyPage = ({ description, actionButton }: EmptyPageProps) => {
  const user = useStore((state) => state.auth.user)

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4 text-blue-800">
        <div className="text-center text-4xl font-normal md:text-5xl">
          Welcome{' '}
          <span className="font-semibold">
            {user?.firstname} {user?.lastname},
          </span>
        </div>
        <p className="text-1xl text-text text-center md:text-2xl">{description}</p>
      </div>
      {actionButton && (
        <div className="flex w-full items-center justify-center gap-7">{actionButton}</div>
      )}
    </div>
  )
}
