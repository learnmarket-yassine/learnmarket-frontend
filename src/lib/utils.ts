import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAssetUrl(path?: string | null): string | undefined {
  if (!path) return undefined
  if (/^https?:\/\//.test(path)) return path
  const baseUrl = import.meta.env.VITE_ASSETS_BASE_URL.replace(/\/$/, '')
  return `${baseUrl}/${path.replace(/^\//, '')}`
}

export function getYoutubeThumbnailUrl(url: string): string | undefined {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  )
  const videoId = match?.[1]
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined
}

export const getDomain = (url: string) => {
  try {
    const parsed = new URL(
      url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
    )

    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
