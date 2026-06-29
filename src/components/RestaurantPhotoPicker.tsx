import type { ChangeEvent } from 'react'
import type { PlacePhotoOut } from '@/types/api'
import { getPlacePhotoUrl } from '@/api/client'
import FoodImage from '@/components/FoodImage'
import PhotoDropZone from '@/components/PhotoDropZone'

interface RestaurantPhotoPickerProps {
  name: string
  currentImageUrl?: string | null
  uploadPreview?: string | null
  placePhotos: PlacePhotoOut[]
  selectedGooglePhotoName: string
  onSelectGooglePhoto: (photoName: string) => void
  onUploadChange: (e: ChangeEvent<HTMLInputElement>) => void
  onLoadGooglePhotos: () => void
  loadingPhotos: boolean
  photosError: string
  showUpload?: boolean
}

export default function RestaurantPhotoPicker({
  name,
  currentImageUrl,
  uploadPreview,
  placePhotos,
  selectedGooglePhotoName,
  onSelectGooglePhoto,
  onUploadChange,
  onLoadGooglePhotos,
  loadingPhotos,
  photosError,
  showUpload = true,
}: RestaurantPhotoPickerProps) {
  const selectedAttribution = placePhotos.find(
    (photo) => photo.name === selectedGooglePhotoName,
  )?.attribution

  const previewUrl = uploadPreview || (selectedGooglePhotoName
    ? getPlacePhotoUrl(selectedGooglePhotoName, 480)
    : null)

  return (
    <div className="photo-section">
      <h3 className="photo-section__title">Restaurant photo</h3>

      {(currentImageUrl || previewUrl) && (
        <div className="edit-current-photo">
          <p className="muted">
            {previewUrl && (uploadPreview || selectedGooglePhotoName)
              ? 'Selected photo preview'
              : 'Current photo'}
          </p>
          {previewUrl ? (
            <img src={previewUrl} alt="" className="contribute-preview" />
          ) : (
            <FoodImage name={name} imageUrl={currentImageUrl} className="contribute-preview" />
          )}
        </div>
      )}

      <div className="photo-section__actions">
        <button
          type="button"
          className="places-lookup__btn"
          onClick={onLoadGooglePhotos}
          disabled={loadingPhotos}
        >
          {loadingPhotos ? 'Loading Google photos...' : 'Load photos from Google Maps'}
        </button>
      </div>

      {photosError && <p className="error">{photosError}</p>}

      {placePhotos.length > 0 && (
        <div className="photo-picker">
          <p className="photo-picker__label">Choose a Google Maps photo</p>
          <div className="photo-picker__grid">
            {placePhotos.map((photo) => (
              <button
                key={photo.name}
                type="button"
                className={
                  selectedGooglePhotoName === photo.name
                    ? 'photo-picker__option photo-picker__option--selected'
                    : 'photo-picker__option'
                }
                onClick={() => onSelectGooglePhoto(photo.name)}
              >
                <img src={getPlacePhotoUrl(photo.name, 320)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
          <p className="photo-picker__credit muted">
            Photos from Google Maps
            {selectedAttribution && ` · © ${selectedAttribution}`}
          </p>
        </div>
      )}

      {showUpload && (
        <PhotoDropZone onChange={onUploadChange} />
      )}
    </div>
  )
}
