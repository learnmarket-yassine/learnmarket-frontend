import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNowStrict } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { IconButton } from '@/components/ui/IconButton'
import BellIcon from '@/assets/BellIcon'
import { cn } from '@/lib/utils'
import useGetNotifications from '../../hooks/useGetNotifications'
import useGetUnreadCount from '../../hooks/useGetUnreadCount'
import useMarkNotificationRead from '../../hooks/useMarkNotificationRead'
import useMarkAllNotificationsRead from '../../hooks/useMarkAllNotificationsRead'
import useNotificationSocketListener from '../../hooks/useNotificationSocketListener'
import { Notification } from '../../store/types'

function resolveNotificationPath(_notification: Notification): string | null {
  return null
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useNotificationSocketListener()

  const { data: unreadCount = 0 } = useGetUnreadCount()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useGetNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const notifications = data?.pages.flatMap((page) => page.data) ?? []

  const handleNotificationClick = (notification: Notification) => {
    if (!notification?.isRead) markRead.mutate(notification.id)

    const path = resolveNotificationPath(notification)
    if (path) {
      setOpen(false)
      navigate(path)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconButton icon={<BellIcon />} label="Notifications" badge={unreadCount} />
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={7} className="w-80 border bg-white p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold text-[#102A63]">Notifications</p>
          {unreadCount > 0 && (
            <button
              type="button"
              className="text-xs font-medium text-blue-600 hover:underline"
              onClick={() => markAllRead.mutate()}
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading && <p className="px-4 py-6 text-center text-sm text-neutral-500">Loading…</p>}

          {isError && (
            <p className="px-4 py-6 text-center text-sm text-red-500">
              Couldn&apos;t load notifications.
            </p>
          )}

          {!isLoading && !isError && notifications.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-neutral-500">No notifications</p>
          )}

          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleNotificationClick(notification)}
              className={cn(
                'flex w-full flex-col gap-0.5 border-b px-4 py-3 text-left last:border-b-0 hover:bg-neutral-50',
                !notification?.isRead && 'bg-blue-50'
              )}
            >
              <div className="flex items-center gap-2">
                {!notification?.isRead && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                )}
                <p className="truncate text-sm font-medium text-[#102A63]">{notification?.title}</p>
              </div>
              <p className="line-clamp-2 text-xs text-neutral-600">{notification?.message}</p>
              <p className="text-[11px] text-neutral-400">
                {formatDistanceToNowStrict(new Date(notification?.createdAt), { addSuffix: true })}
              </p>
            </button>
          ))}

          {hasNextPage && (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-3 text-center text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading…' : 'Load more'}
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
