import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYoutubeThumbnailUrl(url: string): string | undefined {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  )
  const videoId = match?.[1]
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined
}
