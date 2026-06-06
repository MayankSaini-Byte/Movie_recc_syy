import { AnimatePresence } from 'framer-motion'
import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'
import './MovieGrid.css'

function MovieGrid({
  title,
  movies = [],
  loading = false,
  onMovieClick,
  activeMovieId,
  skeletonCount = 5,
}) {
  return (
    <div className="movie-grid">
      {title && (
        <div className="movie-grid__header">
          <h2 className="movie-grid__title">{title}</h2>
          {!loading && movies.length > 0 && (
            <span className="movie-grid__count">{movies.length} movies</span>
          )}
        </div>
      )}

      <div className="movie-grid__grid">
        {loading ? (
          Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={`skel-${i}`} />
          ))
        ) : movies.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                index={index}
                onClick={onMovieClick}
                isActive={activeMovieId === movie.id}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="movie-grid__empty">
            <div className="movie-grid__empty-icon">🎬</div>
            <p className="movie-grid__empty-text">
              Search for a movie to get personalized recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieGrid
