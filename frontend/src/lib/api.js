import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
})

/**
 * Get all movie titles from the dataset.
 */
export async function getMovieList() {
  const { data } = await client.get('/movies')
  return data.movies
}

/**
 * Search movie titles within the dataset.
 */
export async function searchMoviesBackend(query) {
  const { data } = await client.get('/search', { params: { q: query } })
  return data.results
}

/**
 * Get 5 content-based recommendations for a movie title.
 */
export async function getRecommendations(title) {
  const { data } = await client.get(`/recommend/${encodeURIComponent(title)}`)
  return data.recommendations
}

/**
 * Get trending movies (TMDB via backend proxy).
 */
export async function getTrending() {
  const { data } = await client.get('/trending')
  return data.results
}

/**
 * Get full movie details (TMDB via backend proxy).
 */
export async function getMovieDetails(movieId) {
  const { data } = await client.get(`/movie/${movieId}`)
  return data
}

/**
 * Get similar movies from TMDB.
 */
export async function getSimilarMovies(movieId) {
  const { data } = await client.get(`/movie/${movieId}/similar`)
  return data.results
}

/**
 * Get genre list from TMDB.
 */
export async function getGenres() {
  const { data } = await client.get('/genres')
  return data.genres
}
