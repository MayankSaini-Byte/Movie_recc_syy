import { useState, useEffect } from 'react'
import { getGenres } from '../lib/api'
import './FilterPanel.css'

function FilterPanel({ filters, onFilterChange }) {
  const [genres, setGenres] = useState([])

  useEffect(() => {
    getGenres()
      .then((data) => setGenres(data))
      .catch(() => setGenres([]))
  }, [])

  const toggleGenre = (genreId) => {
    const current = filters.genres || []
    const updated = current.includes(genreId)
      ? current.filter((id) => id !== genreId)
      : [...current, genreId]
    onFilterChange({ ...filters, genres: updated })
  }

  const handleRatingChange = (e) => {
    onFilterChange({ ...filters, minRating: parseFloat(e.target.value) })
  }

  const handleYearFromChange = (e) => {
    const val = e.target.value
    onFilterChange({ ...filters, yearFrom: val ? parseInt(val) : '' })
  }

  const handleYearToChange = (e) => {
    const val = e.target.value
    onFilterChange({ ...filters, yearTo: val ? parseInt(val) : '' })
  }

  const handleClear = () => {
    onFilterChange({
      genres: [],
      minRating: 0,
      yearFrom: '',
      yearTo: '',
    })
  }

  const hasActiveFilters =
    (filters.genres && filters.genres.length > 0) ||
    filters.minRating > 0 ||
    filters.yearFrom ||
    filters.yearTo

  return (
    <div className="filter-panel">
      {/* Genre chips */}
      <div className="filter-panel__section">
        <span className="filter-panel__label">Genres</span>
        <div className="filter-panel__genres">
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`filter-panel__genre-chip${
                filters.genres?.includes(genre.id) ? ' active' : ''
              }`}
              onClick={() => toggleGenre(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      <hr className="filter-panel__divider" />

      {/* Rating slider */}
      <div className="filter-panel__section">
        <span className="filter-panel__label">Min Rating</span>
        <div className="filter-panel__range-wrap">
          <input
            type="range"
            className="filter-panel__range"
            min="0"
            max="10"
            step="0.5"
            value={filters.minRating || 0}
            onChange={handleRatingChange}
            id="rating-filter"
          />
          <div className="filter-panel__range-values">
            <span>0</span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
              ⭐ {filters.minRating || 0}+
            </span>
            <span>10</span>
          </div>
        </div>
      </div>

      <hr className="filter-panel__divider" />

      {/* Year range */}
      <div className="filter-panel__section">
        <span className="filter-panel__label">Year Range</span>
        <div className="filter-panel__year-row">
          <input
            type="number"
            className="filter-panel__year-input"
            placeholder="From"
            min="1900"
            max="2026"
            value={filters.yearFrom || ''}
            onChange={handleYearFromChange}
            id="year-from-filter"
          />
          <span className="filter-panel__year-sep">—</span>
          <input
            type="number"
            className="filter-panel__year-input"
            placeholder="To"
            min="1900"
            max="2026"
            value={filters.yearTo || ''}
            onChange={handleYearToChange}
            id="year-to-filter"
          />
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <>
          <hr className="filter-panel__divider" />
          <button className="filter-panel__clear" onClick={handleClear} id="clear-filters-btn">
            ✕ Clear Filters
          </button>
        </>
      )}
    </div>
  )
}

export default FilterPanel
