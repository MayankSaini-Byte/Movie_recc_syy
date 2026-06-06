import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMovieDetails, getSimilarMovies } from '../lib/api'
import { getImageUrl, formatRating, extractYear, formatRuntime } from '../lib/tmdb'
import './MovieDetailPanel.css'

function MovieDetailPanel({ movieId, onRecommend, onSimilarClick }) {
  const [movie, setMovie] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!movieId) {
      setMovie(null)
      setSimilar([])
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.all([
      getMovieDetails(movieId),
      getSimilarMovies(movieId),
    ])
      .then(([details, similarData]) => {
        if (cancelled) return
        setMovie(details)
        setSimilar(similarData || [])
      })
      .catch(() => {
        if (!cancelled) {
          setMovie(null)
          setSimilar([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [movieId])

  // Loading skeleton
  if (loading) {
    return (
      <div className="detail-panel__loading">
        <div className="detail-panel__skel-poster skeleton" />
        <div className="detail-panel__skel-title skeleton" />
        <div className="detail-panel__skel-meta skeleton" />
        <div className="detail-panel__skel-text skeleton" />
        <div className="detail-panel__skel-text skeleton" />
      </div>
    )
  }

  // Empty state
  if (!movie) {
    return (
      <div className="detail-panel__empty">
        <div className="detail-panel__empty-icon">🎥</div>
        <p className="detail-panel__empty-text">
          Select a movie to see its details, overview, and similar recommendations
        </p>
      </div>
    )
  }

  const posterUrl = getImageUrl(movie.poster_path, 'w500')
  const year = extractYear(movie.release_date)
  const runtime = formatRuntime(movie.runtime)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={movie.id}
        className="detail-panel"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Poster */}
        <div className="detail-panel__poster-section">
          {posterUrl ? (
            <>
              <img
                className="detail-panel__poster"
                src={posterUrl}
                alt={movie.title}
              />
              <div className="detail-panel__poster-gradient" />
            </>
          ) : (
            <div className="detail-panel__no-poster">No Poster</div>
          )}
        </div>

        {/* Info */}
        <div className="detail-panel__info">
          <h2 className="detail-panel__title">
            {movie.title}
            {year && <span className="detail-panel__year">({year})</span>}
          </h2>

          <div className="detail-panel__meta-row">
            {movie.vote_average > 0 && (
              <div className="detail-panel__rating-badge">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {formatRating(movie.vote_average)}
              </div>
            )}
            {runtime && (
              <span className="detail-panel__runtime">{runtime}</span>
            )}
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="detail-panel__genres">
              {movie.genres.map((g) => (
                <span key={g.id} className="detail-panel__genre-pill">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          {movie.overview && (
            <p className="detail-panel__overview">{movie.overview}</p>
          )}

          {/* Get Similar Recommendations button */}
          <button
            className="detail-panel__similar-btn"
            onClick={() => onRecommend?.(movie.title)}
            id="get-similar-btn"
          >
            🎯 Get Similar Recommendations
          </button>

          {/* Similar movies carousel */}
          {similar.length > 0 && (
            <div className="detail-panel__similar-section">
              <h3 className="detail-panel__similar-title">Similar Movies</h3>
              <div className="detail-panel__carousel">
                {similar.map((sim) => (
                  <div
                    key={sim.id}
                    className="detail-panel__carousel-item"
                    onClick={() => onSimilarClick?.(sim)}
                  >
                    {sim.poster_path ? (
                      <img
                        className="detail-panel__carousel-poster"
                        src={getImageUrl(sim.poster_path, 'w185')}
                        alt={sim.title}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="detail-panel__carousel-poster"
                        style={{
                          background: 'var(--bg-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        N/A
                      </div>
                    )}
                    <p className="detail-panel__carousel-name">{sim.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MovieDetailPanel
