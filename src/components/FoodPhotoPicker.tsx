import type { ChangeEvent } from 'react'
import type { FoodImageSearchResult } from '@/types/api'
import { getFoodGeneratedImageUrl } from '@/api/client'
import FoodImage from '@/components/FoodImage'
import PhotoDropZone from '@/components/PhotoDropZone'

interface FoodPhotoPickerProps {
  name: string
  currentImageUrl?: string | null
  uploadPreview?: string | null
  generatedPhotos: FoodImageSearchResult[]
  selectedAiImageId: string
  onSelectAiPhoto: (imageId: string) => void
  onUploadChange: (e: ChangeEvent<HTMLInputElement>) => void
  onGeneratePhotos: () => void
  loadingPhotos: boolean
  photosError: string
  showUpload?: boolean
}

export default function FoodPhotoPicker({
  name,
  currentImageUrl,
  uploadPreview,
  generatedPhotos,
  selectedAiImageId,
  onSelectAiPhoto,
  onUploadChange,
  onGeneratePhotos,
  loadingPhotos,
  photosError,
  showUpload = true,
}: FoodPhotoPickerProps) {
  const previewUrl = uploadPreview
    || (selectedAiImageId ? getFoodGeneratedImageUrl(selectedAiImageId) : null)

  return (
    <div className="photo-section">
      <h3 className="photo-section__title">Food photo</h3>

      {(currentImageUrl || previewUrl) && (
        <div className="edit-current-photo">
          <p className="muted">
            {previewUrl && (uploadPreview || selectedAiImageId)
              ? 'Selected photo preview'
              : 'Current photo'}
          </p>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt=""
              className="contribute-preview"
            />
          ) : (
            <FoodImage name={name} imageUrl={currentImageUrl} className="contribute-preview" />
          )}
        </div>
      )}

      <div className="photo-section__actions">
        <button
          type="button"
          className="places-lookup__btn"
          onClick={onGeneratePhotos}
          disabled={loadingPhotos || !name?.trim()}
        >
          {loadingPhotos ? 'Generating AI photos...' : 'Generate AI photo'}
        </button>
      </div>

      {photosError && <p className="error">{photosError}</p>}

      {generatedPhotos.length > 0 && (
        <div className="photo-picker">
          <p className="photo-picker__label">Choose an AI-generated photo</p>
          <div className="photo-picker__grid">
            {generatedPhotos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                className={
                  selectedAiImageId === photo.id
                    ? 'photo-picker__option photo-picker__option--selected'
                    : 'photo-picker__option'
                }
                onClick={() => onSelectAiPhoto(photo.id)}
              >
                <img
                  src={getFoodGeneratedImageUrl(photo.id)}
                  alt=""
                  loading="lazy"
                />
              </button>
            ))}
          </div>
          <p className="photo-picker__credit muted">
            AI-generated images via{' '}
            <a href="https://huggingface.co" target="_blank" rel="noreferrer">
              Hugging Face
            </a>
          </p>
        </div>
      )}

      {showUpload && (
        <PhotoDropZone onChange={onUploadChange} />
      )}
    </div>
  )
}
