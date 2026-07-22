import { SearchImage } from '@/assets/SearchImage'
import React from 'react'

const NoResults: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <span className="text-[24px] font-bold text-[#4C4C4C]">We couldn't find any results.</span>
      <div className="mt-4">
        <p
          className="max-w-[400px] text-[16px] text-[#2C2C2C]"
          style={{
            lineHeight: 'normal',
          }}
        >
          We couldn't find any matching results. We've expanded your search to help you discover
          what you're looking for.
        </p>
      </div>
      <SearchImage />
    </div>
  )
}

export default NoResults
