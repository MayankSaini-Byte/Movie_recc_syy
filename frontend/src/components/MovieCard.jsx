import { motion } from 'framer-motion'
import { getImageUrl, formatRating } from '../lib/tmdb'
import './MovieCard.css'

function MovieCard({ movie, onClick, isActive, index = 0 }) {
  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path, 'w342')
    : null

  const genres = movie.genres
    ? movie.genres.slice(0, 2)
    : movie.genre_ids
      ? movie.genre_ids.slice(0, 2).map((id) => ({ id, name: '' }))
      : []

  return (
    <motion.div
      className={`movie-card${isActive ? ' active' : ''}`}
      onClick={() => onClick?.(movie)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      layout
    >
      <div className="movie-card__poster-wrap">
        {posterUrl ? (
          <img
            className="movie-card__poster"
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
          />
        ) : (
          <div className="movie-card__no-poster">
            <span>No Poster</span>
          </div>
        )}

        {/* Rating badge */}
        {movie.vote_average != null && movie.vote_average > 0 && (
          <div className="movie-card__rating">
            <svg viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {formatRating(movie.vote_average)}
          </div>
        )}

        {/* Hover overlay */}
        <div className="movie-card__overlay">
          {movie.overview && (
            <p className="movie-card__overview-preview">{movie.overview}</p>
          )}
        </div>
      </div>

      <div className="movie-card__body">
        <h3 className="movie-card__title">{movie.title}</h3>
        {genres.length > 0 && genres[0].name && (
          <div className="movie-card__genres">
            {genres.map((g) => (
              <span key={g.id} className="movie-card__genre-tag">
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MovieCard
