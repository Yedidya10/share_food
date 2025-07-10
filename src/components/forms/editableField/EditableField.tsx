'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface EditableFieldProps {
  value: string
  onSave: (newValue: string) => Promise<void> | void
  placeholder?: string
  className?: string
  inputClassName?: string
  disabled?: boolean
}

export default function EditableField({
  value,
  onSave,
  placeholder,
  inputClassName = '',
  className = '',
  disabled = false,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  const commit = async () => {
    if (draft !== value) await onSave(draft)
    setEditing(false)
  }

  return (
    <div
      onClick={() => !editing && setEditing(true)}
      className={`
        h-8 flex items-center
        ${className}`}
    >
      {editing ? (
        <Input
          ref={inputRef}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && commit()}
          className={`${inputClassName}`}
          disabled={disabled}
        />
      ) : (
        <span
          className={`
            w-[max-content] p-2 truncate
            hover:border border-gray-300 rounded-md
            ${value ? 'dark:text-gray-200' : 'dark:text-gray-400 text-opacity-70'}
          `}
        >
          {value || placeholder || '—'}
        </span>
      )}
    </div>
  )
}
