import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { createFoodType, createRestaurant, listFoodTypes } from '../api/client'
import { useAuth } from '../context/AuthContext'
import NavBar from '../components/NavBar'

export default function Contribute() {
  const { isAuthenticated, loading } = useAuth()
  const [foodTypes, setFoodTypes] = useState([])

  const [foodName, setFoodName] = useState('')
  const [foodDescription, setFoodDescription] = useState('')
  const [foodImage, setFoodImage] = useState(null)
  const [foodImagePreview, setFoodImagePreview] = useState(null)
  const [foodMessage, setFoodMessage] = useState('')
  const [foodError, setFoodError] = useState('')
  const [foodSubmitting, setFoodSubmitting] = useState(false)

  const [restName, setRestName] = useState('')
  const [restArea, setRestArea] = useState('')
  const [restAddress, setRestAddress] = useState('')
  const [restPhone, setRestPhone] = useState('')
  const [restMapsUrl, setRestMapsUrl] = useState('')
  const [selectedFoodIds, setSelectedFoodIds] = useState([])
  const [restMessage, setRestMessage] = useState('')
  const [restError, setRestError] = useState('')
  const [restSubmitting, setRestSubmitting] = useState(false)

  useEffect(() => {
    listFoodTypes().then(setFoodTypes).catch(() => setFoodTypes([]))
  }, [])

  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />

  function toggleFoodType(id) {
    setSelectedFoodIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function handleFoodImageChange(e) {
    const file = e.target.files?.[0] || null
    setFoodImage(file)
    setFoodImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
  }

  async function handleFoodSubmit(e) {
    e.preventDefault()
    setFoodSubmitting(true)
    setFoodError('')
    setFoodMessage('')
    try {
      const created = await createFoodType({
        name: foodName.trim(),
        description: foodDescription.trim() || null,
        image: foodImage,
      })
      setFoodTypes((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
      setFoodName('')
      setFoodDescription('')
      setFoodImage(null)
      setFoodImagePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      setFoodMessage(`Added "${created.name}" successfully.`)
    } catch (err) {
      setFoodError(err.message)
    } finally {
      setFoodSubmitting(false)
    }
  }

  async function handleRestaurantSubmit(e) {
    e.preventDefault()
    setRestSubmitting(true)
    setRestError('')
    setRestMessage('')
    try {
      const created = await createRestaurant({
        name: restName.trim(),
        area: restArea.trim() || null,
        address: restAddress.trim() || null,
        phone: restPhone.trim() || null,
        google_maps_url: restMapsUrl.trim() || null,
        food_type_ids: selectedFoodIds,
      })
      setRestName('')
      setRestArea('')
      setRestAddress('')
      setRestPhone('')
      setRestMapsUrl('')
      setSelectedFoodIds([])
      setRestMessage(`Added "${created.name}" successfully.`)
    } catch (err) {
      setRestError(err.message)
    } finally {
      setRestSubmitting(false)
    }
  }

  return (
    <div className="page">
      <NavBar compact />
      <main className="page-content">
        <h1>Add to Khawon</h1>
        <p className="muted">Help grow the catalogue by submitting food types and restaurants.</p>

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
            <label>
              Photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/*"
                onChange={handleFoodImageChange}
              />
            </label>
            {foodImagePreview && (
              <img
                src={foodImagePreview}
                alt="Preview"
                className="contribute-preview"
              />
            )}
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
                placeholder="https://maps.google.com/..."
              />
            </label>

            <fieldset className="checkbox-group">
              <legend>Food types served</legend>
              {foodTypes.length === 0 ? (
                <p className="muted">
                  No food types yet. <Link to="#" onClick={(e) => e.preventDefault()}>Add one above</Link> first.
                </p>
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
      </main>
    </div>
  )
}
