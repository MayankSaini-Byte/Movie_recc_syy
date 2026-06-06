import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getTrending } from '../lib/api'
import { getImageUrl } from '../lib/tmdb'
import './HeroPage.css'

function HeroPage() {
  const navigate = useNavigate()
  const [bgPosters, setBgPosters] = useState([])

  useEffect(() => {
    getTrending()
      .then((movies) => {
        const posters = movies
          .filter((m) => m.poster_path)
          .slice(0, 18)
          .map((m) => getImageUrl(m.poster_path, 'w342'))
        setBgPosters(posters)
      })
      .catch(() => setBgPosters([]))
  }, [])

  const handleDiscover = () => {
    navigate('/discover')
  }

  return (
    <motion.div
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background collage */}
      <div className="hero__bg">
        {bgPosters.length > 0 && (
          <div className="hero__bg-collage">
            {bgPosters.map((url, i) => (
              <img
                key={i}
                className="hero__bg-poster"
                src={url}
                alt=""
                loading="lazy"
              />
            ))}
          </div>
        )}
        <div className="hero__bg-overlay" />
        <div className="hero__grain" />
      </div>

      {/* Main content */}
      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hero__icon">🎬</div>

        <h1 className="hero__title">
          AI Movie
          <br />
          Recommendation System
        </h1>

        <p className="hero__subtitle">
          Discover your next cinematic masterpiece with AI-powered personalized
          recommendations. Powered by machine learning and real-time TMDB data.
        </p>

        <motion.button
          className="hero__cta"
          onClick={handleDiscover}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          id="discover-btn"
        >
          Discover Movies →
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default HeroPage
