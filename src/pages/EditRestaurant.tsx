import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  getPlaceDetails,
  getRestaurant,
  listFoodTypes,
  searchPlaces,
  updateRestaurant,
} from '@/api/client'
import { useAuth } from '@/context/AuthContext'
import type { FoodTypeOut, PlaceSearchResult } from '@/types/api'
import PageScroll from '@/components/PageScroll'
import RestaurantPhotoPicker from '@/components/RestaurantPhotoPicker'

export default function EditRestaurant() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  const [foodTypes, setFoodTypes] = useState<FoodTypeOut[]>([])
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [area, setArea] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [mapsUrl, setMapsUrl] = useState('')
  const [website, setWebsite] = useState('')
  const [googlePlaceId, setGooglePlaceId] = useState('')
  const [placePhotos, setPlacePhotos] = useState<PlaceSearchResult['photos']>([])
  const [selectedGooglePhotoName, setSelectedGooglePhotoName] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [placeResults, setPlaceResults] = useState<PlaceSearchResult[]>([])
  const [placesSearching, setPlacesSearching] = useState(false)
  const [placesError, setPlacesError] = useState('')
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [photosError, setPhotosError] = useState('')
  const [selectedFoodIds, setSelectedFoodIds] = useState<number[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadGooglePhotos = useCallback(async (placeId?: string) => {
    const resolvedPlaceId = placeId ?? googlePlaceId
    if (!resolvedPlaceId) {
      setPhotosError('Find on Google Maps first to link a place, then load photos.')
      return
    }

    setLoadingPhotos(true)
    setPhotosError('')
    try {
      const place = await getPlaceDetails(resolvedPlaceId)
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
  }, [googlePlaceId])

  useEffect(() => {
    if (!id) return

    Promise.all([getRestaurant(id), listFoodTypes()])
      .then(([restaurant, allFoodTypes]) => {
        setName(restaurant.name)
        setArea(restaurant.area || '')
        setAddress(restaurant.address || '')
        setPhone(restaurant.phone || '')
        setMapsUrl(restaurant.google_maps_url || '')
        setWebsite(restaurant.website_url || '')
        setGooglePlaceId(restaurant.google_place_id || '')
        setCurrentImageUrl(restaurant.image_url)
        setSelectedFoodIds(restaurant.food_types.map((ft) => ft.id))
        setFoodTypes(allFoodTypes)

        if (restaurant.google_place_id) {
          void loadGooglePhotos(restaurant.google_place_id)
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setPageLoading(false))
  }, [id, loadGooglePhotos])

  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />

  function toggleFoodType(foodId: number) {
    setSelectedFoodIds((prev) =>
      prev.includes(foodId) ? prev.filter((x) => x !== foodId) : [...prev, foodId],
    )
  }

  async function handlePlacesSearch() {
    if (!name.trim()) {
      setPlacesError('Enter a restaurant name first.')
      return
    }

    setPlacesSearching(true)
    setPlacesError('')
    setPlaceResults([])
    try {
      const results = await searchPlaces(name, area)
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
    setName(place.name || name)
    setArea(place.area || area)
    setAddress(place.address || '')
    setPhone(place.phone || '')
    setMapsUrl(place.google_maps_url || '')
    setWebsite(place.website_url || '')
    setGooglePlaceId(place.place_id || '')
    setPlacePhotos(place.photos || [])
    setSelectedGooglePhotoName(place.photos?.[0]?.name || '')
    setPlaceResults([])
    setPlacesError('')
    if (place.place_id && (!place.photos || place.photos.length === 0)) {
      void loadGooglePhotos(place.place_id)
    }
  }

  function handleUploadChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setUploadFile(file)
    setUploadPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
    if (file) setSelectedGooglePhotoName('')
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!id) return

    setSubmitting(true)
    setError('')
    setMessage('')
    try {
      const updated = await updateRestaurant(id, {
        name: name.trim(),
        area: area.trim() || undefined,
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
        google_maps_url: mapsUrl.trim() || undefined,
        website_url: website.trim() || undefined,
        google_place_id: googlePlaceId.trim() || undefined,
        google_photo_name: selectedGooglePhotoName.trim() || undefined,
        image: uploadFile ?? undefined,
      })
      setCurrentImageUrl(updated.image_url)
      setUploadFile(null)
      setUploadPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      setMessage(`Updated "${updated.name}" successfully.`)
      setTimeout(() => navigate('/manage'), 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <PageScroll>
        <main className="page-content">
        <Link to="/manage" className="back-link page-back-link">← Back to manage</Link>
        <h1>Edit restaurant</h1>

        {pageLoading && <p className="loading">Loading...</p>}
        {error && !pageLoading && <div className="error-box"><p>{error}</p></div>}

        {!pageLoading && !error && (
          <form className="auth-form contribute-section" onSubmit={handleSubmit}>
            <RestaurantPhotoPicker
              name={name}
              currentImageUrl={currentImageUrl}
              uploadPreview={uploadPreview}
              placePhotos={placePhotos}
              selectedGooglePhotoName={selectedGooglePhotoName}
              onSelectGooglePhoto={(photoName) => {
                setSelectedGooglePhotoName(photoName)
                setUploadFile(null)
                setUploadPreview((prev) => {
                  if (prev) URL.revokeObjectURL(prev)
                  return null
                })
              }}
              onUploadChange={handleUploadChange}
              onLoadGooglePhotos={() => { void loadGooglePhotos() }}
              loadingPhotos={loadingPhotos}
              photosError={photosError}
            />

            <label>
              Restaurant name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Area
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Dhanmondi"
              />
            </label>

            <div className="places-lookup">
              <p className="muted places-lookup__hint">
                Link to Google Maps to refresh address, links, and photos.
              </p>
              <button
                type="button"
                className="places-lookup__btn"
                onClick={handlePlacesSearch}
                disabled={placesSearching || !name.trim()}
              >
                {placesSearching ? 'Searching Google...' : 'Find on Google Maps'}
              </button>
              {placesError && <p className="error">{placesError}</p>}
              {placeResults.length > 0 && (
                <ul className="places-results">
                  {placeResults.map((place) => (
                    <li key={place.place_id}>
                      <button type="button" className="places-result" onClick={() => applyPlace(place)}>
                        <strong>{place.name}</strong>
                        {place.address && <span>{place.address}</span>}
                        <span className="places-result__meta">
                          {place.area && `${place.area} · `}
                          {place.phone || 'No phone listed'}
                          {place.photos?.length ? ` · ${place.photos.length} photos` : ''}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label>
              Address
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </label>
            <label>
              Phone
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label>
              Google Maps URL
              <input type="url" value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} />
            </label>
            <label>
              Website
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </label>

            <fieldset className="checkbox-group">
              <legend>Food types served</legend>
              {foodTypes.map((ft) => (
                <label key={ft.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedFoodIds.includes(ft.id)}
                    onChange={() => toggleFoodType(ft.id)}
                  />
                  {ft.name}
                </label>
              ))}
            </fieldset>

            {message && <p className="success">{message}</p>}
            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        )}
      </main>
      </PageScroll>
    </div>
  )
}
