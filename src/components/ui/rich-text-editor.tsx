import { useEffect } from 'react'
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  onBlur?: () => void
  placeholder?: string
  error?: string
  className?: string
  contentClassName?: string
}

function ToolbarButton({
  onClick,
  isActive,
  label,
  children,
}: {
  onClick: () => void
  isActive: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isActive}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        'flex size-7 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]',
        isActive && 'bg-[#E8EEFC] text-[#2563EB] hover:bg-[#E8EEFC] hover:text-[#2563EB]'
      )}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex items-center gap-1 border-b border-[#E5E7EB] px-2 py-1.5">
      <ToolbarButton
        label="Bold"
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>
      <div className="mx-1 h-4 w-px bg-[#E5E7EB]" />
      <ToolbarButton
        label="Bullet list"
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
    </div>
  )
}

export function RichTextEditor({
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  className,
  contentClassName,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, blockquote: false, codeBlock: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onBlur: () => onBlur?.(),
    editorProps: {
      attributes: {
        class: cn(
          'prose-editor min-h-[100px] max-w-none px-3 py-2 text-sm text-[#374151] focus:outline-none',
          contentClassName
        ),
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  return (
    <div className="relative w-full">
      <div
        className={cn(
          'border-inputBorder bg-inputBackground overflow-hidden rounded-md border ring-offset-white focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
          error && 'border-red-600 focus-within:ring-transparent',
          className
        )}
      >
        {editor && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
      {error && (
        <p className="absolute left-2 block overflow-hidden text-ellipsis whitespace-nowrap px-1 text-xs font-normal text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default RichTextEditor
