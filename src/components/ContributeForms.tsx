import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  createFoodType,
  createRestaurant,
  getPlaceDetails,
  searchFoodImages,
  searchPlaces,
} from '@/api/client'
import type { FoodImageSearchResult, FoodTypeOut, PlaceSearchResult, RestaurantOut } from '@/types/api'
import FoodPhotoPicker from '@/components/FoodPhotoPicker'
import RestaurantPhotoPicker from '@/components/RestaurantPhotoPicker'

interface ContributeFormsProps {
  foodTypes: FoodTypeOut[]
  onFoodCreated?: (food: FoodTypeOut) => void
  onRestaurantCreated?: (restaurant: RestaurantOut) => void
}

export default function ContributeForms({
  foodTypes,
  onFoodCreated,
  onRestaurantCreated,
}: ContributeFormsProps) {
  const [foodName, setFoodName] = useState('')
  const [foodDescription, setFoodDescription] = useState('')
  const [foodImage, setFoodImage] = useState<File | null>(null)
  const [foodImagePreview, setFoodImagePreview] = useState<string | null>(null)
  const [foodSearchPhotos, setFoodSearchPhotos] = useState<FoodImageSearchResult[]>([])
  const [selectedAiImageId, setSelectedAiImageId] = useState('')
  const [loadingFoodPhotos, setLoadingFoodPhotos] = useState(false)
  const [foodPhotosError, setFoodPhotosError] = useState('')
  const [foodMessage, setFoodMessage] = useState('')
  const [foodError, setFoodError] = useState('')
  const [foodSubmitting, setFoodSubmitting] = useState(false)

  const [restName, setRestName] = useState('')
  const [restArea, setRestArea] = useState('')
  const [restAddress, setRestAddress] = useState('')
  const [restPhone, setRestPhone] = useState('')
  const [restMapsUrl, setRestMapsUrl] = useState('')
  const [restWebsite, setRestWebsite] = useState('')
  const [googlePlaceId, setGooglePlaceId] = useState('')
  const [placePhotos, setPlacePhotos] = useState<PlaceSearchResult['photos']>([])
  const [selectedGooglePhotoName, setSelectedGooglePhotoName] = useState('')
  const [restImage, setRestImage] = useState<File | null>(null)
  const [restImagePreview, setRestImagePreview] = useState<string | null>(null)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [photosError, setPhotosError] = useState('')
  const [placeResults, setPlaceResults] = useState<PlaceSearchResult[]>([])
  const [placesSearching, setPlacesSearching] = useState(false)
  const [placesError, setPlacesError] = useState('')
  const [selectedFoodIds, setSelectedFoodIds] = useState<number[]>([])
  const [restMessage, setRestMessage] = useState('')
  const [restError, setRestError] = useState('')
  const [restSubmitting, setRestSubmitting] = useState(false)

  function toggleFoodType(id: number) {
    setSelectedFoodIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function handleFoodImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setFoodImage(file)
    setFoodImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
    if (file) setSelectedAiImageId('')
  }

  async function handleFoodPhotoSearch() {
    if (!foodName.trim()) {
      setFoodPhotosError('Enter a food name first.')
      return
    }

    setLoadingFoodPhotos(true)
    setFoodPhotosError('')
    try {
      const result = await searchFoodImages(foodName.trim())
      setFoodSearchPhotos(result.photos || [])
      const firstPhoto = result.photos?.[0]
      if (firstPhoto) {
        setSelectedAiImageId(firstPhoto.id)
      } else {
        setSelectedAiImageId('')
        setFoodPhotosError(result.search_help || 'No photos generated. Upload your own below.')
      }
    } catch (err) {
      setFoodPhotosError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoadingFoodPhotos(false)
    }
  }

  async function handleFoodSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFoodSubmitting(true)
    setFoodError('')
    setFoodMessage('')
    try {
      const created = await createFoodType({
        name: foodName.trim(),
        description: foodDescription.trim() || undefined,
        image: foodImage ?? undefined,
        ai_image_id: selectedAiImageId.trim() || undefined,
      })
      onFoodCreated?.(created)
      setFoodName('')
      setFoodDescription('')
      setFoodImage(null)
      setFoodSearchPhotos([])
      setSelectedAiImageId('')
      setFoodPhotosError('')
      setFoodImagePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      setFoodMessage(`Added "${created.name}" successfully.`)
    } catch (err) {
      setFoodError(err instanceof Error ? err.message : String(err))
    } finally {
      setFoodSubmitting(false)
    }
  }

  async function handlePlacesSearch() {
    if (!restName.trim()) {
      setPlacesError('Enter a restaurant name first.')
      return
    }

    setPlacesSearching(true)
    setPlacesError('')
    setPlaceResults([])
    try {
      const results = await searchPlaces(restName, restArea)
      setPlaceResults(results)
      if (results.length === 0) {
        setPlacesError('No Google Places matches found. Try a different name or area.')
      }
    } catch (err) {
      setPlacesError(err instanceof Error ? err.message : String(err))
    } finally {
      setPlacesSearching(false)
    }
  }

  function applyPlace(place: PlaceSearchResult) {
    setRestName(place.name || restName)
    setRestArea(place.area || restArea)
    setRestAddress(place.address || '')
    setRestPhone(place.phone || '')
    setRestMapsUrl(place.google_maps_url || '')
    setRestWebsite(place.website_url || '')
    setGooglePlaceId(place.place_id || '')
    setPlacePhotos(place.photos || [])
    setSelectedGooglePhotoName(place.photos?.[0]?.name || '')
    setPlaceResults([])
    setPlacesError('')
    if (place.place_id && (!place.photos || place.photos.length === 0)) {
      void loadGooglePhotos(place.place_id)
    }
  }

  async function loadGooglePhotos(placeId = googlePlaceId) {
    if (!placeId) {
      setPhotosError('Pick a Google listing first, then load photos.')
      return
    }
    setLoadingPhotos(true)
    setPhotosError('')
    try {
      const place = await getPlaceDetails(placeId)
      setPlacePhotos(place.photos || [])
      const firstPhoto = place.photos?.[0]
      if (firstPhoto) {
        setSelectedGooglePhotoName(firstPhoto.name)
      } else {
        setPhotosError(place.photos_help || 'No Google photos found. Upload your own below.')
      }
    } catch (err) {
      setPhotosError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoadingPhotos(false)
    }
  }

  function handleRestImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setRestImage(file)
    setRestImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
    if (file) setSelectedGooglePhotoName('')
  }

  async function handleRestaurantSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setRestSubmitting(true)
    setRestError('')
    setRestMessage('')
    try {
      const created = await createRestaurant({
        name: restName.trim(),
        area: restArea.trim() || undefined,
        address: restAddress.trim() || undefined,
        phone: restPhone.trim() || undefined,
        google_maps_url: restMapsUrl.trim() || undefined,
        website_url: restWebsite.trim() || undefined,
        google_place_id: googlePlaceId.trim() || undefined,
        google_photo_name: selectedGooglePhotoName.trim() || undefined,
        image: restImage ?? undefined,
        food_type_ids: selectedFoodIds,
      })
      onRestaurantCreated?.(created)
      setRestName('')
      setRestArea('')
      setRestAddress('')
      setRestPhone('')
      setRestMapsUrl('')
      setRestWebsite('')
      setGooglePlaceId('')
      setPlacePhotos([])
      setSelectedGooglePhotoName('')
      setRestImage(null)
      setRestImagePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      setPlaceResults([])
      setPlacesError('')
      setSelectedFoodIds([])
      setRestMessage(`Added "${created.name}" successfully.`)
    } catch (err) {
      setRestError(err instanceof Error ? err.message : String(err))
    } finally {
      setRestSubmitting(false)
    }
  }

  return (
    <>
      <section className="contribute-section">
        <h2>Add a food type</h2>
        <form className="auth-form" onSubmit={handleFoodSubmit}>
          <label>
            Name
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g. Kacchi Biriyani"
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={foodDescription}
              onChange={(e) => setFoodDescription(e.target.value)}
              rows={2}
              placeholder="Optional short description"
            />
          </label>
          <FoodPhotoPicker
            name={foodName}
            uploadPreview={foodImagePreview}
            generatedPhotos={foodSearchPhotos}
            selectedAiImageId={selectedAiImageId}
            onSelectAiPhoto={(imageId) => {
              setSelectedAiImageId(imageId)
              setFoodImage(null)
              setFoodImagePreview((prev) => {
                if (prev) URL.revokeObjectURL(prev)
                return null
              })
            }}
            onUploadChange={handleFoodImageChange}
            onGeneratePhotos={handleFoodPhotoSearch}
            loadingPhotos={loadingFoodPhotos}
            photosError={foodPhotosError}
          />
          {foodError && <p className="error">{foodError}</p>}
          {foodMessage && <p className="success">{foodMessage}</p>}
          <button type="submit" disabled={foodSubmitting}>
            {foodSubmitting ? 'Adding...' : 'Add food type'}
          </button>
        </form>
      </section>

      <section className="contribute-section">
        <h2>Add a restaurant</h2>
        <form className="auth-form" onSubmit={handleRestaurantSubmit}>
          <label>
            Restaurant name
            <input
              type="text"
              value={restName}
              onChange={(e) => setRestName(e.target.value)}
              required
            />
          </label>
          <label>
            Area
            <input
              type="text"
              value={restArea}
              onChange={(e) => setRestArea(e.target.value)}
              placeholder="e.g. Dhanmondi"
            />
          </label>

          <div className="places-lookup">
            <p className="muted places-lookup__hint">
              Look up on Google Maps to auto-fill address, phone, Maps link, and website.
            </p>
            <button
              type="button"
              className="places-lookup__btn"
              onClick={handlePlacesSearch}
              disabled={placesSearching || !restName.trim()}
            >
              {placesSearching ? 'Searching Google...' : 'Find on Google Maps'}
            </button>
            {placesError && <p className="error">{placesError}</p>}
            {placeResults.length > 0 && (
              <ul className="places-results">
                {placeResults.map((place) => (
                  <li key={place.place_id}>
                    <button
                      type="button"
                      className="places-result"
                      onClick={() => applyPlace(place)}
                    >
                      <strong>{place.name}</strong>
                      {place.address && <span>{place.address}</span>}
                      <span className="places-result__meta">
                        {place.area && `${place.area} · `}
                        {place.phone || 'No phone listed'}
                        {place.website_url ? ' · Has website' : ''}
                        {place.photos?.length ? ` · ${place.photos.length} photos` : ''}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <RestaurantPhotoPicker
            name={restName || 'Restaurant'}
            uploadPreview={restImagePreview}
            placePhotos={placePhotos}
            selectedGooglePhotoName={selectedGooglePhotoName}
            onSelectGooglePhoto={(photoName) => {
              setSelectedGooglePhotoName(photoName)
              setRestImage(null)
              setRestImagePreview((prev) => {
                if (prev) URL.revokeObjectURL(prev)
                return null
              })
            }}
            onUploadChange={handleRestImageChange}
            onLoadGooglePhotos={() => { void loadGooglePhotos() }}
            loadingPhotos={loadingPhotos}
            photosError={photosError}
          />

          <label>
            Address
            <input
              type="text"
              value={restAddress}
              onChange={(e) => setRestAddress(e.target.value)}
            />
          </label>
          <label>
            Phone
            <input
              type="text"
              value={restPhone}
              onChange={(e) => setRestPhone(e.target.value)}
            />
          </label>
          <label>
            Google Maps URL
            <input
              type="url"
              value={restMapsUrl}
              onChange={(e) => setRestMapsUrl(e.target.value)}
              placeholder="Auto-filled from Google lookup"
            />
          </label>
          <label>
            Website
            <input
              type="url"
              value={restWebsite}
              onChange={(e) => setRestWebsite(e.target.value)}
              placeholder="Auto-filled from Google lookup"
            />
          </label>

          <fieldset className="checkbox-group">
            <legend>Food types served</legend>
            {foodTypes.length === 0 ? (
              <p className="muted">No food types yet. Add one above first.</p>
            ) : (
              foodTypes.map((ft) => (
                <label key={ft.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedFoodIds.includes(ft.id)}
                    onChange={() => toggleFoodType(ft.id)}
                  />
                  {ft.name}
                </label>
              ))
            )}
          </fieldset>

          {restError && <p className="error">{restError}</p>}
          {restMessage && <p className="success">{restMessage}</p>}
          <button type="submit" disabled={restSubmitting}>
            {restSubmitting ? 'Adding...' : 'Add restaurant'}
          </button>
        </form>
      </section>
    </>
  )
}
