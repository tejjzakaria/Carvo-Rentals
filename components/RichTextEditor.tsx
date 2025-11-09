/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder = 'Start typing...' }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4'
      }
    }
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className='border-2 border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all'>
      {/* Toolbar */}
      <div className='bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1'>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
            editor.isActive('bold')
              ? 'bg-primary text-white'
              : 'bg-white text-gray-300 hover:bg-gray-100'
          }`}
          title='Bold'
        >
          B
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded text-sm italic transition-colors ${
            editor.isActive('italic')
              ? 'bg-primary text-white'
              : 'bg-white text-gray-300 hover:bg-gray-100'
          }`}
          title='Italic'
        >
          I
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1.5 rounded text-sm line-through transition-colors ${
            editor.isActive('strike')
              ? 'bg-primary text-white'
              : 'bg-white text-gray-300 hover:bg-gray-100'
          }`}
          title='Strikethrough'
        >
          S
        </button>

        <div className='w-px bg-gray-300 mx-1'></div>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-primary text-white'
              : 'bg-white text-gray-300 hover:bg-gray-100'
          }`}
          title='Heading 1'
        >
          H1
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-primary text-white'
              : 'bg-white text-gray-300 hover:bg-gray-100'
          }`}
          title='Heading 2'
        >
          H2
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-primary text-white'
              : 'bg-white text-gray-300 hover:bg-gray-100'
          }`}
          title='Heading 3'
        >
          H3
        </button>

        <div className='w-px bg-gray-300 mx-1'></div>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-primary text-white'
              : 'bg-white text-gray-300 hover:bg-gray-100'
          }`}
          title='Bullet List'
        >
          • List
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-primary text-white'
              : 'bg-white text-gray-300 hover:bg-gray-100'
          }`}
          title='Numbered List'
        >
          1. List
        </button>

        <div className='w-px bg-gray-300 mx-1'></div>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-primary text-white'
              : 'bg-white text-gray-300 hover:bg-gray-100'
          }`}
          title='Quote'
        >
          " Quote
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1.5 rounded text-sm font-mono transition-colors ${
            editor.isActive('codeBlock')
              ? 'bg-primary text-white'
              : 'bg-white text-gray-300 hover:bg-gray-100'
          }`}
          title='Code Block'
        >
          {'</>'}
        </button>

        <div className='w-px bg-gray-300 mx-1'></div>

        <button
          type='button'
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className='px-3 py-1.5 rounded text-sm bg-white text-gray-300 hover:bg-gray-100 transition-colors'
          title='Horizontal Line'
        >
          ―
        </button>

        <div className='w-px bg-gray-300 mx-1'></div>

        <button
          type='button'
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className='px-3 py-1.5 rounded text-sm bg-white text-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          title='Undo'
        >
          ↶
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className='px-3 py-1.5 rounded text-sm bg-white text-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          title='Redo'
        >
          ↷
        </button>
      </div>

      {/* Editor Content */}
      <div className='bg-white'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
