import { RefObject, useEffect, useRef } from 'react'

function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  handler: (event: MouseEvent) => void
): void {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handlerRef.current(event)
      }
    }

    document.addEventListener('mousedown', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
    }
  }, [ref])
}

export default useOutsideClick
