import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'xl'
}

const SIZE_CLASSES: Record<NonNullable<StarRatingProps['size']>, string> = {
  sm: 'size-3.5',
  md: 'size-5',
  xl: 'size-8',
}

function StarRating({ rating, size = 'md' }: StarRatingProps) {
  const sizeClass = SIZE_CLASSES[size]

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          aria-hidden="true"
          className={`${sizeClass} ${
            value <= Math.round(rating) ? 'fill-current text-amber-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

export default StarRating
