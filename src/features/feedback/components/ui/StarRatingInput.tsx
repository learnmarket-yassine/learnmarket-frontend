import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
  onBlur?: () => void
  error?: string
}

function StarRatingInput({ value, onChange, onBlur, error }: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const display = hovered ?? value

  return (
    <div>
      <div className="flex items-center gap-1" onBlur={onBlur}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} out of 5`}
            aria-pressed={value === star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className="p-0.5"
          >
            <Star
              className={`size-7 transition-colors ${
                star <= display ? 'fill-current text-amber-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs font-normal text-red-600">{error}</p>}
    </div>
  )
}

export default StarRatingInput
