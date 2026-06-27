import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  getFoodCatalogue,
  getPlaceDetails,
  getRestaurantCatalogue,
  searchFoodImages,
  searchPlaces,
  updateFoodTypePhoto,
  updateRestaurantPhoto,
} from '../api/client'
import { useAuth } from '../context/AuthContext'
import FoodImage from '../components/FoodImage'
import FoodPhotoPicker from '../components/FoodPhotoPicker'
import NavBar from '../components/NavBar'
import RestaurantPhotoPicker from '../components/RestaurantPhotoPicker'

function FoodPhotoEditor({ food, onSaved }) {
  const [searchPhotos, setSearchPhotos] = useState([])
  const [selectedAiImageId, setSelectedAiImageId] = useState('')
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadPreview, setUploadPreview] = useState(null)
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
      if (result.photos?.[0]) {
        setSelectedAiImageId(result.photos[0].id)
      } else {
        setSelectedAiImageId('')
        setPhotosError(result.search_help || 'No photos generated. Upload your own below.')
      }
    } catch (err) {
      setPhotosError(err.message)
    } finally {
      setLoadingPhotos(false)
    }
  }

  function handleUploadChange(e) {
    const file = e.target.files?.[0] || null
    setUploadFile(file)
    setUploadPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
    if (file) setSelectedAiImageId('')
  }

  async function handleSavePhoto(e) {
    e.preventDefault()
    if (!selectedAiImageId && !uploadFile) {
      setSaveError('Choose an AI photo or upload a file.')
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      const updated = await updateFoodTypePhoto(food.id, {
        ai_image_id: selectedAiImageId || null,
        image: uploadFile,
      })
      setCurrentImageUrl(updated.image_url)
      setUploadFile(null)
      setUploadPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      onSaved(updated)
    } catch (err) {
      setSaveError(err.message)
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

function RestaurantPhotoEditor({ restaurant, onSaved }) {
  const [placePhotos, setPlacePhotos] = useState([])
  const [selectedGooglePhotoName, setSelectedGooglePhotoName] = useState('')
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadPreview, setUploadPreview] = useState(null)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [photosError, setPhotosError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [currentImageUrl, setCurrentImageUrl] = useState(restaurant.image_url)

  useEffect(() => {
    loadGooglePhotos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant.id])

  async function loadGooglePhotos() {
    setLoadingPhotos(true)
    setPhotosError('')
    try {
      if (restaurant.google_place_id) {
        const place = await getPlaceDetails(restaurant.google_place_id)
        setPlacePhotos(place.photos || [])
        if (place.photos?.[0]) {
          setSelectedGooglePhotoName(place.photos[0].name)
        } else {
          setPhotosError(place.photos_help || 'No Google photos found. Upload your own below.')
        }
        return
      }

      const results = await searchPlaces(restaurant.name, restaurant.area || '')
      if (results.length === 1 && results[0].photos?.length) {
        setPlacePhotos(results[0].photos)
        setSelectedGooglePhotoName(results[0].photos[0].name)
      } else if (results.length > 0) {
        setPhotosError('Link this restaurant to Google in Edit first, or upload a photo below.')
      } else {
        setPhotosError('No Google listing found. Upload your own photo below.')
      }
    } catch (err) {
      setPhotosError(err.message)
    } finally {
      setLoadingPhotos(false)
    }
  }

  function handleUploadChange(e) {
    const file = e.target.files?.[0] || null
    setUploadFile(file)
    setUploadPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
    if (file) setSelectedGooglePhotoName('')
  }

  async function handleSavePhoto(e) {
    e.preventDefault()
    if (!selectedGooglePhotoName && !uploadFile) {
      setSaveError('Choose a Google photo or upload a file.')
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      const updated = await updateRestaurantPhoto(restaurant.id, {
        google_photo_name: selectedGooglePhotoName || null,
        image: uploadFile,
      })
      setCurrentImageUrl(updated.image_url)
      setUploadFile(null)
      setUploadPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      onSaved(updated)
    } catch (err) {
      setSaveError(err.message)
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
  const [foods, setFoods] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [foodPhotoEditorId, setFoodPhotoEditorId] = useState(null)
  const [restaurantPhotoEditorId, setRestaurantPhotoEditorId] = useState(null)

  useEffect(() => {
    Promise.all([getFoodCatalogue(), getRestaurantCatalogue()])
      .then(([foodList, restaurantList]) => {
        setFoods(foodList)
        setRestaurants(restaurantList)
      })
      .catch((err) => setError(err.message))
      .finally(() => setPageLoading(false))
  }, [])

  function handleFoodPhotoSaved(updated) {
    setFoods((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
    )
  }

  function handleRestaurantPhotoSaved(updated) {
    setRestaurants((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
    )
  }

  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="page">
      <header className="page-header page-header--stacked">
        <NavBar compact />
      </header>

      <main className="page-content">
        <div className="catalogue-header">
          <div>
            <h1>Manage listings</h1>
            <p className="muted">Edit details or choose photos for foods and restaurants.</p>
          </div>
          <Link to="/contribute" className="back-link">+ Add new</Link>
        </div>

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
    </div>
  )
}
