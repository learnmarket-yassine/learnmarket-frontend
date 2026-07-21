import { useCallback, useLayoutEffect, useRef, useState } from 'react'

interface UseLineClampOptions {
  lines?: number
}

interface UseLineClampResult<T extends HTMLElement> {
  ref: React.RefObject<T | null>
  isExpanded: boolean
  isClampable: boolean
  toggle: () => void
  className: string
}

export function useLineClamp<T extends HTMLElement = HTMLParagraphElement>(
  content: string | null | undefined,
  { lines = 3 }: UseLineClampOptions = {}
): UseLineClampResult<T> {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isClampable, setIsClampable] = useState(false)
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !content) return

    const styles = window.getComputedStyle(el)
    const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.2

    el.style.setProperty('--lines', String(lines))
    el.style.setProperty('--line-clamp-line-height', `${lineHeight}px`)
    el.style.setProperty('--line-clamp-expanded-height', `${el.scrollHeight}px`)

    const collapsedHeight = lineHeight * lines
    setIsClampable(el.scrollHeight > collapsedHeight + 1)
  }, [content, lines])

  const toggle = useCallback(() => setIsExpanded((prev) => !prev), [])

  const className = `line-clamp-wrapper ${isExpanded ? 'is-expanded' : 'is-clamped'}`

  return { ref, isExpanded, isClampable, toggle, className }
}

export default useLineClamp
