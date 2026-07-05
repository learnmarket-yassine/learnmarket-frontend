import { CustomInput } from '@/components/ui/CustomInput'
import { Label } from '@/components/ui/label'

const HeadlineStep = () => {
  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h1 className="max-w-[520px] text-4xl font-bold text-[#1E293B]">
          Got it. Now, add a title to tell the world what you do.
        </h1>
        <p className="max-w-[420px] text-sm text-[#4B5563]">
          It's the very first thing clients see, so make it count. Stand out by describing your
          expertise in your own words.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="role" className="text-sm font-semibold text-[#374151]">
          Your professional role
        </Label>
        <CustomInput
          id="role"
          type="text"
          placeholder="UI/UX Design | Frontend Developer"
          width="w-full"
          className="rounded-full border border-[#D1D5DB] bg-white"
        />
      </div>
    </div>
  )
}

export default HeadlineStep
