const IMAGE_BASE = 'https://image.tmdb.org/t/p'

/**
 * Build a TMDB image URL.
 * @param {string} path - poster_path or backdrop_path from TMDB
 * @param {'w185'|'w342'|'w500'|'w780'|'original'} size
 */
export function getImageUrl(path, size = 'w500') {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

/**
 * Build a backdrop URL (usually wider).
 */
export function getBackdropUrl(path, size = 'w1280') {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

/**
 * Format rating to one decimal place.
 */
export function formatRating(rating) {
  if (!rating && rating !== 0) return 'N/A'
  return Number(rating).toFixed(1)
}

/**
 * Extract year from a date string like "2024-03-15".
 */
export function extractYear(dateString) {
  if (!dateString) return ''
  return dateString.split('-')[0]
}

/**
 * Format runtime in hours and minutes.
 */
export function formatRuntime(minutes) {
  if (!minutes) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

/**
 * Simple in-memory cache for TMDB responses.
 */
const cache = new Map()

export function getCached(key) {
  if (cache.has(key)) {
    const entry = cache.get(key)
    // Expire after 10 minutes
    if (Date.now() - entry.ts < 600000) {
      return entry.data
    }
    cache.delete(key)
  }
  return null
}

export function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() })
}
