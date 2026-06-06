import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import MovieGrid from '../components/MovieGrid'
import MovieDetailPanel from '../components/MovieDetailPanel'
import { getRecommendations, getTrending, getMovieDetails } from '../lib/api'
import './DiscoverPage.css'

function DiscoverPage() {
  const navigate = useNavigate()

  // State
  const [recommendations, setRecommendations] = useState([])
  const [trending, setTrending] = useState([])
  const [selectedMovieId, setSelectedMovieId] = useState(null)
  const [loadingRecs, setLoadingRecs] = useState(false)
  const [loadingTrending, setLoadingTrending] = useState(true)
  const [currentSeed, setCurrentSeed] = useState('')
  const [filters, setFilters] = useState({
    genres: [],
    minRating: 0,
    yearFrom: '',
    yearTo: '',
  })

  // Load trending on mount
  useEffect(() => {
    setLoadingTrending(true)
    getTrending()
      .then((data) => setTrending(data))
      .catch(() => setTrending([]))
      .finally(() => setLoadingTrending(false))
  }, [])

  // Fetch recommendations when a movie is selected from search
  const handleMovieSelect = useCallback(async (movie) => {
    setCurrentSeed(movie.title)
    setLoadingRecs(true)
    try {
      const recs = await getRecommendations(movie.title)
      // Enrich each recommendation with TMDB details
      const enriched = await Promise.all(
        recs.map(async (rec) => {
          try {
            const details = await getMovieDetails(rec.id)
            return { ...rec, ...details }
          } catch {
            return rec
          }
        })
      )
      setRecommendations(enriched)
      // Auto-select first recommendation
      if (enriched.length > 0) {
        setSelectedMovieId(enriched[0].id)
      }
    } catch {
      setRecommendations([])
    } finally {
      setLoadingRecs(false)
    }
  }, [])

  // Handle "Get Similar" from detail panel
  const handleRecommendFromDetail = useCallback(async (title) => {
    setCurrentSeed(title)
    setLoadingRecs(true)
    try {
      const recs = await getRecommendations(title)
      const enriched = await Promise.all(
        recs.map(async (rec) => {
          try {
            const details = await getMovieDetails(rec.id)
            return { ...rec, ...details }
          } catch {
            return rec
          }
        })
      )
      setRecommendations(enriched)
      if (enriched.length > 0) {
        setSelectedMovieId(enriched[0].id)
      }
    } catch {
      setRecommendations([])
    } finally {
      setLoadingRecs(false)
    }
  }, [])

  // Handle card click
  const handleMovieClick = useCallback((movie) => {
    setSelectedMovieId(movie.id)
  }, [])

  // Handle click on similar movie in detail panel
  const handleSimilarClick = useCallback((movie) => {
    setSelectedMovieId(movie.id)
  }, [])

  // Apply filters to a movie list
  const applyFilters = useCallback(
    (movies) => {
      return movies.filter((movie) => {
        // Genre filter
        if (filters.genres.length > 0) {
          const movieGenreIds = movie.genres
            ? movie.genres.map((g) => g.id)
            : movie.genre_ids || []
          const hasGenre = filters.genres.some((id) => movieGenreIds.includes(id))
          if (!hasGenre) return false
        }

        // Rating filter
        if (filters.minRating > 0) {
          if ((movie.vote_average || 0) < filters.minRating) return false
        }

        // Year filter
        const year = movie.release_date
          ? parseInt(movie.release_date.split('-')[0])
          : null
        if (filters.yearFrom && year && year < filters.yearFrom) return false
        if (filters.yearTo && year && year > filters.yearTo) return false

        return true
      })
    },
    [filters]
  )

  const filteredRecs = applyFilters(recommendations)
  const filteredTrending = applyFilters(trending)

  return (
    <motion.div
      className="discover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <header className="discover__header">
        <div className="discover__logo" onClick={() => navigate('/')}>
          <span className="discover__logo-icon">🎬</span>
          <span className="discover__logo-text">CineMatch AI</span>
        </div>
        <span className="discover__nav-info">
          {currentSeed ? `Recommendations for "${currentSeed}"` : 'Discover Movies'}
        </span>
      </header>

      {/* 3-panel layout */}
      <div className="discover__layout">
        {/* Left: Search + Filters */}
        <aside className="discover__sidebar">
          <div>
            <h3 className="discover__sidebar-title">Search</h3>
            <SearchBar onSelect={handleMovieSelect} />
          </div>

          <div>
            <h3 className="discover__sidebar-title">Filters</h3>
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </div>
        </aside>

        {/* Center: Movie Grid */}
        <main className="discover__main">
          {/* Recommendations section */}
          {(recommendations.length > 0 || loadingRecs) && (
            <MovieGrid
              title="Recommended For You"
              movies={filteredRecs}
              loading={loadingRecs}
              onMovieClick={handleMovieClick}
              activeMovieId={selectedMovieId}
              skeletonCount={5}
            />
          )}

          {/* Trending section */}
          <MovieGrid
            title={recommendations.length > 0 ? 'Trending Now' : 'Trending Now — Pick a Movie to Start'}
            movies={filteredTrending}
            loading={loadingTrending}
            onMovieClick={handleMovieClick}
            activeMovieId={selectedMovieId}
            skeletonCount={10}
          />
        </main>

        {/* Right: Detail Panel */}
        <aside className="discover__detail">
          <MovieDetailPanel
            movieId={selectedMovieId}
            onRecommend={handleRecommendFromDetail}
            onSimilarClick={handleSimilarClick}
          />
        </aside>
      </div>
    </motion.div>
  )
}

export default DiscoverPage
