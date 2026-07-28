import { SearchImage } from '@/assets/SearchImage'
import React from 'react'

type NoResultsProps = {
  title?: string
  description?: string
}

const NoResults: React.FC<NoResultsProps> = ({
  title = "We couldn't find any results.",
  description = "We couldn't find any matching results. We've expanded your search to help you discover what you're looking for.",
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <span className="text-[24px] font-bold text-[#4C4C4C]">{title}</span>
      <div className="mt-4">
        <p
          className="max-w-[400px] text-[16px] text-[#2C2C2C]"
          style={{
            lineHeight: 'normal',
          }}
        >
          {description}
        </p>
      </div>
      <SearchImage />
    </div>
  )
}

export default NoResults
