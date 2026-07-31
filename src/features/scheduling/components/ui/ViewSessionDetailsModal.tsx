import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ArrowRight, BookOpen, Calendar, CalendarIcon, Clock, Eye } from 'lucide-react'
import { Session } from '../../types/dto'
import useGetSessionContext from '@/features/sessions/hooks/useGetSessionContext'
import { getBrowserTimezone } from '../../utils/timezones'
import { formatDateLabel, formatSlotTime } from '../../utils/time'

interface ViewSessionDetailsModalProps {
  session: Session
}

const ViewSessionDetailsModal = ({ session }: ViewSessionDetailsModalProps) => {
  const [open, setOpen] = useState(false)
  const { data: context } = useGetSessionContext(session.id, open)
  const timezone = getBrowserTimezone()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="View session details"
          className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-[#1D50BB] hover:text-white"
        >
          <Eye className="size-5" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="space-y-6 sm:max-w-[425px]"
        style={{
          boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.80)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-text text-2xl font-[600]">
            <div className="flex w-full items-center justify-between">
              <span>{session.title}</span>
              {context?.booking && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <CalendarIcon className="size-4 shrink-0 text-[#2563EB]" />
                    <span>
                      {formatDateLabel(context.booking.startTime, timezone)} •{' '}
                      {formatSlotTime(context.booking.startTime, timezone)} –{' '}
                      {formatSlotTime(context.booking.endTime, timezone)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between"></DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="size-3.5 text-[#1D50BB]" />
              What is the goal of this session?
            </label>

            <div className="max-h-[250px] overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-sm leading-relaxed text-slate-700">
              {session.objective}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-slate-100 hover:text-blue-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
              }}
              className="flex items-center gap-2 rounded-xl bg-[#1D50BB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Full Details
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewSessionDetailsModal
