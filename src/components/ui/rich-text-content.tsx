import DOMPurify from 'dompurify'
import { cn } from '@/lib/utils'

interface RichTextContentProps {
  html: string
  className?: string
}

export function RichTextContent({ html, className }: RichTextContentProps) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 's', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  })

  return (
    <div
      className={cn('prose-editor max-w-none break-words text-sm text-[#374151]', className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}

export default RichTextContent
