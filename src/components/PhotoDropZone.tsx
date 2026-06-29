import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react'

const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/webp,image/*'

function isImageFile(file: File | null | undefined): file is File {
  return Boolean(
    file && (file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif)$/i.test(file.name)),
  )
}

interface PhotoDropZoneProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  accept?: string
  label?: string
  hint?: string
}

export default function PhotoDropZone({
  onChange,
  accept = DEFAULT_ACCEPT,
  label = 'Or upload your own photo',
  hint = 'Drag and drop an image here, or click to browse',
}: PhotoDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function emitFile(file: File) {
    if (!isImageFile(file)) return
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    onChange({ target: { files: dataTransfer.files } } as ChangeEvent<HTMLInputElement>)
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) emitFile(file)
    e.target.value = ''
  }

  function handleDragEnter(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return
    setDragging(false)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) emitFile(file)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div className="photo-section__upload">
      <span>{label}</span>
      <div
        className={`photo-dropzone${dragging ? ' photo-dropzone--active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={hint}
      >
        <span className="photo-dropzone__icon" aria-hidden="true">↑</span>
        <span className="photo-dropzone__text">{hint}</span>
        <span className="photo-dropzone__formats muted">JPEG, PNG, or WebP · max 5 MB</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="photo-dropzone__input"
        tabIndex={-1}
      />
    </div>
  )
}
