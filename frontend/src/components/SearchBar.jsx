import { useState, useEffect, useRef, useCallback } from 'react'
import { searchMoviesBackend } from '../lib/api'
import './SearchBar.css'

function SearchBar({ onSelect, placeholder = 'Search for a movie...' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusIndex, setFocusIndex] = useState(-1)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  const searchMovies = useCallback(async (q) => {
    if (!q || q.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }
    setLoading(true)
    try {
      const data = await searchMoviesBackend(q)
      setResults(data)
      setIsOpen(data.length > 0)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchMovies(query), 300)
    return () => clearTimeout(debounceRef.current)
  }, [query, searchMovies])

  const handleSelect = (movie) => {
    setQuery(movie.title)
    setIsOpen(false)
    setFocusIndex(-1)
    onSelect?.(movie)
  }

  const handleKeyDown = (e) => {
    if (!isOpen) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && focusIndex >= 0) {
      e.preventDefault()
      handleSelect(results[focusIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setFocusIndex(-1)
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className="search-bar">
      <div className="search-bar__input-wrap">
        <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          className="search-bar__input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          id="movie-search-input"
          autoComplete="off"
        />
        {query && (
          <button className="search-bar__clear" onClick={handleClear} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className="search-bar__dropdown">
          {loading ? (
            <div className="search-bar__loading">Searching...</div>
          ) : results.length > 0 ? (
            results.map((movie, idx) => (
              <div
                key={movie.id}
                className={`search-bar__result${idx === focusIndex ? ' focused' : ''}`}
                onMouseDown={() => handleSelect(movie)}
                onMouseEnter={() => setFocusIndex(idx)}
              >
                <span className="search-bar__result-title">{movie.title}</span>
              </div>
            ))
          ) : (
            <div className="search-bar__no-results">No movies found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
