import { SessionImage } from '@/assets/SessionImage'
import React from 'react'

const EmptySelectedSession: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <span className="text-[24px] font-bold text-[#4C4C4C]">Please select a session first.</span>
      <div className="mt-4">
        <p
          className="max-w-[400px] text-[16px] text-[#2C2C2C]"
          style={{
            lineHeight: 'normal',
          }}
        >
          Choose a session from the list to view its details and get started.
        </p>
      </div>
      <SessionImage />
    </div>
  )
}

export default EmptySelectedSession
