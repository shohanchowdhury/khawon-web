import { useRef, useState } from 'react'

const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/webp,image/*'

function isImageFile(file) {
  return file && (file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif)$/i.test(file.name))
}

export default function PhotoDropZone({
  onChange,
  accept = DEFAULT_ACCEPT,
  label = 'Or upload your own photo',
  hint = 'Drag and drop an image here, or click to browse',
}) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function emitFile(file) {
    if (!isImageFile(file)) return
    onChange({ target: { files: [file] } })
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0]
    if (file) emitFile(file)
    e.target.value = ''
  }

  function handleDragEnter(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget.contains(e.relatedTarget)) return
    setDragging(false)
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    emitFile(e.dataTransfer.files?.[0])
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
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
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
