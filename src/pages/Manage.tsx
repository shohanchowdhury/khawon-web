import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import {
  getFoodCatalogue,
  getPlaceDetails,
  listBranches,
  listFoodTypes,
  searchFoodImages,
  searchPlaces,
  updateFoodTypePhoto,
  updateRestaurantPhoto,
} from '@/api/client'
import { useAuth } from '@/context/AuthContext'
import type {
  FoodImageSearchResult,
  FoodTypeOut,
  FoodTypePopularOut,
  PlaceSearchResult,
  RestaurantSummaryOut,
} from '@/types/api'
import ContributeForms from '@/components/ContributeForms'
import FoodImage from '@/components/FoodImage'
import FoodPhotoPicker from '@/components/FoodPhotoPicker'
import PageScroll from '@/components/PageScroll'
import RestaurantPhotoPicker from '@/components/RestaurantPhotoPicker'

interface FoodPhotoEditorProps {
  food: FoodTypePopularOut
  onSaved: (updated: FoodTypeOut) => void
}

function FoodPhotoEditor({ food, onSaved }: FoodPhotoEditorProps) {
  const [searchPhotos, setSearchPhotos] = useState<FoodImageSearchResult[]>([])
  const [selectedAiImageId, setSelectedAiImageId] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [photosError, setPhotosError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [currentImageUrl, setCurrentImageUrl] = useState(food.image_url)

  async function handlePhotoSearch() {
    setLoadingPhotos(true)
    setPhotosError('')
    try {
      const result = await searchFoodImages(food.name)
      setSearchPhotos(result.photos || [])
      const firstPhoto = result.photos?.[0]
      if (firstPhoto) {
        setSelectedAiImageId(firstPhoto.id)
      } else {
        setSelectedAiImageId('')
        setPhotosError(result.search_help || 'No photos generated. Upload your own below.')
      }
    } catch (err) {
      setPhotosError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoadingPhotos(false)
    }
  }

  function handleUploadChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setUploadFile(file)
    setUploadPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
    if (file) setSelectedAiImageId('')
  }

  async function handleSavePhoto(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedAiImageId && !uploadFile) {
      setSaveError('Choose an AI photo or upload a file.')
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      const updated = await updateFoodTypePhoto(food.id, {
        ai_image_id: selectedAiImageId || undefined,
        image: uploadFile ?? undefined,
      })
      setCurrentImageUrl(updated.image_url)
      setUploadFile(null)
      setUploadPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      onSaved(updated)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="manage-photo-editor" onSubmit={handleSavePhoto}>
      <FoodPhotoPicker
        name={food.name}
        currentImageUrl={currentImageUrl}
        uploadPreview={uploadPreview}
        generatedPhotos={searchPhotos}
        selectedAiImageId={selectedAiImageId}
        onSelectAiPhoto={(imageId) => {
          setSelectedAiImageId(imageId)
          setUploadFile(null)
          setUploadPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            return null
          })
        }}
        onUploadChange={handleUploadChange}
        onGeneratePhotos={handlePhotoSearch}
        loadingPhotos={loadingPhotos}
        photosError={photosError}
      />
      {saveError && <p className="error">{saveError}</p>}
      <button type="submit" disabled={saving}>
        {saving ? 'Saving photo...' : 'Save photo'}
      </button>
    </form>
  )
}

interface RestaurantPhotoEditorProps {
  restaurant: RestaurantSummaryOut
  onSaved: (updated: RestaurantSummaryOut) => void
}

function RestaurantPhotoEditor({ restaurant, onSaved }: RestaurantPhotoEditorProps) {
  const [placePhotos, setPlacePhotos] = useState<PlaceSearchResult['photos']>([])
  const [selectedGooglePhotoName, setSelectedGooglePhotoName] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [photosError, setPhotosError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [currentImageUrl, setCurrentImageUrl] = useState(restaurant.image_url)

  const loadGooglePhotos = useCallback(async () => {
    setLoadingPhotos(true)
    setPhotosError('')
    try {
      if (restaurant.google_place_id) {
        const place = await getPlaceDetails(restaurant.google_place_id)
        setPlacePhotos(place.photos || [])
        const firstPhoto = place.photos?.[0]
        if (firstPhoto) {
          setSelectedGooglePhotoName(firstPhoto.name)
        } else {
          setPhotosError(place.photos_help || 'No Google photos found. Upload your own below.')
        }
        return
      }

      const results = await searchPlaces(restaurant.name, restaurant.area || '')
      const firstResult = results[0]
      if (results.length === 1 && firstResult?.photos?.length) {
        setPlacePhotos(firstResult.photos)
        const firstPhoto = firstResult.photos[0]
        if (firstPhoto) setSelectedGooglePhotoName(firstPhoto.name)
      } else if (results.length > 0) {
        setPhotosError('Link this restaurant to Google in Edit first, or upload a photo below.')
      } else {
        setPhotosError('No Google listing found. Upload your own photo below.')
      }
    } catch (err) {
      setPhotosError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoadingPhotos(false)
    }
  }, [restaurant.area, restaurant.google_place_id, restaurant.name])

  useEffect(() => {
    void loadGooglePhotos()
  }, [loadGooglePhotos])

  function handleUploadChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setUploadFile(file)
    setUploadPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
    if (file) setSelectedGooglePhotoName('')
  }

  async function handleSavePhoto(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedGooglePhotoName && !uploadFile) {
      setSaveError('Choose a Google photo or upload a file.')
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      const updated = await updateRestaurantPhoto(restaurant.id, {
        google_photo_name: selectedGooglePhotoName || undefined,
        image: uploadFile ?? undefined,
      })
      setCurrentImageUrl(updated.image_url)
      setUploadFile(null)
      setUploadPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      onSaved(updated)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="manage-photo-editor" onSubmit={handleSavePhoto}>
      <RestaurantPhotoPicker
        name={restaurant.name}
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
        onLoadGooglePhotos={loadGooglePhotos}
        loadingPhotos={loadingPhotos}
        photosError={photosError}
      />
      {saveError && <p className="error">{saveError}</p>}
      <button type="submit" disabled={saving}>
        {saving ? 'Saving photo...' : 'Save photo'}
      </button>
    </form>
  )
}

export default function Manage() {
  const { isAuthenticated, loading } = useAuth()
  const [foods, setFoods] = useState<FoodTypePopularOut[]>([])
  const [restaurants, setRestaurants] = useState<RestaurantSummaryOut[]>([])
  const [foodTypes, setFoodTypes] = useState<FoodTypeOut[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [foodPhotoEditorId, setFoodPhotoEditorId] = useState<number | null>(null)
  const [restaurantPhotoEditorId, setRestaurantPhotoEditorId] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([getFoodCatalogue(), listBranches(), listFoodTypes()])
      .then(([foodList, restaurantList, typeList]) => {
        setFoods(foodList)
        setRestaurants(restaurantList)
        setFoodTypes(typeList)
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setPageLoading(false))
  }, [])

  function handleFoodPhotoSaved(updated: FoodTypeOut) {
    setFoods((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
    )
  }

  function handleRestaurantPhotoSaved(updated: RestaurantSummaryOut) {
    setRestaurants((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
    )
  }

  function handleFoodCreated(created: FoodTypeOut) {
    const popular: FoodTypePopularOut = {
      ...created,
      restaurant_count: 0,
      review_count: 0,
      average_rating: null,
    }
    setFoods((prev) => [...prev, popular].sort((a, b) => a.name.localeCompare(b.name)))
    setFoodTypes((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
  }

  function handleRestaurantCreated(created: RestaurantSummaryOut) {
    setRestaurants((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
  }

  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="page">
      <PageScroll>
        <main className="page-content">
        <div className="catalogue-header">
          <div>
            <h1>Manage</h1>
            <p className="muted">Add new listings or edit photos and details for existing ones.</p>
          </div>
        </div>

        <section className="manage-section">
          <h2>Add new</h2>
          <ContributeForms
            onFoodCreated={handleFoodCreated}
            onRestaurantCreated={handleRestaurantCreated}
          />
        </section>

        {pageLoading && <p className="loading">Loading listings...</p>}
        {error && <div className="error-box"><p>{error}</p></div>}

        {!pageLoading && !error && (
          <>
            <section className="manage-section">
              <h2>Food types</h2>
              {foods.length === 0 ? (
                <p className="empty">No food types yet.</p>
              ) : (
                <ul className="manage-list manage-list--stacked">
                  {foods.map((food) => (
                    <li key={food.id} className="manage-list__block">
                      <div className="manage-list__item">
                        <FoodImage
                          name={food.name}
                          imageUrl={food.image_url}
                          className="manage-list__thumb"
                        />
                        <div className="manage-list__info">
                          <strong>{food.name}</strong>
                          {food.description && (
                            <span className="muted">{food.description}</span>
                          )}
                          {!food.image_url && (
                            <span className="manage-list__badge">No photo yet</span>
                          )}
                        </div>
                        <div className="manage-list__actions">
                          <button
                            type="button"
                            className="manage-list__edit"
                            onClick={() => setFoodPhotoEditorId(
                              foodPhotoEditorId === food.id ? null : food.id,
                            )}
                          >
                            {foodPhotoEditorId === food.id ? 'Close photo' : 'Choose photo'}
                          </button>
                          <Link to={`/manage/food/${food.id}`} className="manage-list__edit">
                            Edit
                          </Link>
                        </div>
                      </div>

                      {foodPhotoEditorId === food.id && (
                        <FoodPhotoEditor
                          food={food}
                          onSaved={handleFoodPhotoSaved}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="manage-section">
              <h2>Restaurants</h2>
              {restaurants.length === 0 ? (
                <p className="empty">No restaurants yet.</p>
              ) : (
                <ul className="manage-list manage-list--stacked">
                  {restaurants.map((restaurant) => (
                    <li key={restaurant.id} className="manage-list__block">
                      <div className="manage-list__item">
                        <FoodImage
                          name={restaurant.name}
                          imageUrl={restaurant.image_url}
                          className="manage-list__thumb"
                        />
                        <div className="manage-list__info">
                          <strong>{restaurant.name}</strong>
                          <span className="muted">
                            {[restaurant.area, restaurant.address].filter(Boolean).join(' · ') || 'No address'}
                          </span>
                          {!restaurant.image_url && (
                            <span className="manage-list__badge">No photo yet</span>
                          )}
                        </div>
                        <div className="manage-list__actions">
                          <button
                            type="button"
                            className="manage-list__edit"
                            onClick={() => setRestaurantPhotoEditorId(
                              restaurantPhotoEditorId === restaurant.id ? null : restaurant.id,
                            )}
                          >
                            {restaurantPhotoEditorId === restaurant.id ? 'Close photo' : 'Choose photo'}
                          </button>
                          <Link to={`/manage/restaurant/${restaurant.id}`} className="manage-list__edit">
                            Edit
                          </Link>
                        </div>
                      </div>

                      {restaurantPhotoEditorId === restaurant.id && (
                        <RestaurantPhotoEditor
                          restaurant={restaurant}
                          onSaved={handleRestaurantPhotoSaved}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
      </PageScroll>
    </div>
  )
}
