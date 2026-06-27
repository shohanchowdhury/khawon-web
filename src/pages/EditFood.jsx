import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { getFoodType, searchFoodImages, updateFoodType } from '../api/client'
import { useAuth } from '../context/AuthContext'
import FoodPhotoPicker from '../components/FoodPhotoPicker'
import NavBar from '../components/NavBar'

export default function EditFood() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [currentImageUrl, setCurrentImageUrl] = useState(null)
  const [newImage, setNewImage] = useState(null)
  const [newImagePreview, setNewImagePreview] = useState(null)
  const [searchPhotos, setSearchPhotos] = useState([])
  const [selectedAiImageId, setSelectedAiImageId] = useState('')
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [photosError, setPhotosError] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    getFoodType(id)
      .then((food) => {
        setName(food.name)
        setDescription(food.description || '')
        setCurrentImageUrl(food.image_url)
      })
      .catch((err) => setError(err.message))
      .finally(() => setPageLoading(false))
  }, [id])

  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />

  function handleImageChange(e) {
    const file = e.target.files?.[0] || null
    setNewImage(file)
    setNewImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
    if (file) setSelectedAiImageId('')
  }

  async function handlePhotoSearch() {
    if (!name.trim()) {
      setPhotosError('Enter a food name first.')
      return
    }

    setLoadingPhotos(true)
    setPhotosError('')
    try {
      const result = await searchFoodImages(name.trim())
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

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')
    try {
      const updated = await updateFoodType(id, {
        name: name.trim(),
        description: description.trim() || null,
        image: newImage,
        ai_image_id: selectedAiImageId.trim() || null,
      })
      setCurrentImageUrl(updated.image_url)
      setNewImage(null)
      setSelectedAiImageId('')
      setSearchPhotos([])
      setNewImagePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      setMessage(`Updated "${updated.name}" successfully.`)
      setTimeout(() => navigate('/manage'), 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <NavBar compact />
      <main className="page-content page-content--narrow">
        <Link to="/manage" className="back-link">← Back to manage</Link>
        <h1>Edit food type</h1>

        {pageLoading && <p className="loading">Loading...</p>}
        {error && !pageLoading && <div className="error-box"><p>{error}</p></div>}

        {!pageLoading && !error && (
          <form className="auth-form contribute-section" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </label>

            <FoodPhotoPicker
              name={name}
              currentImageUrl={currentImageUrl}
              uploadPreview={newImagePreview}
              generatedPhotos={searchPhotos}
              selectedAiImageId={selectedAiImageId}
              onSelectAiPhoto={(imageId) => {
                setSelectedAiImageId(imageId)
                setNewImage(null)
                setNewImagePreview((prev) => {
                  if (prev) URL.revokeObjectURL(prev)
                  return null
                })
              }}
              onUploadChange={handleImageChange}
              onGeneratePhotos={handlePhotoSearch}
              loadingPhotos={loadingPhotos}
              photosError={photosError}
            />

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
