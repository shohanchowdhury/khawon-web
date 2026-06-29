/** Mirrors khawon-api/schemas.py — PlaceSearchResult, PlacePhotoOut */

export interface PlacePhotoOut {
  name: string
  width_px: number | null
  height_px: number | null
  attribution: string | null
}

export interface PlaceSearchResult {
  place_id: string
  name: string
  address: string | null
  area: string | null
  phone: string | null
  google_maps_url: string | null
  website_url: string | null
  photos: PlacePhotoOut[]
  photos_help: string | null
}
