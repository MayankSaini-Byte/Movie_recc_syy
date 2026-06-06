import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HeroPage from './pages/HeroPage'
import DiscoverPage from './pages/DiscoverPage'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HeroPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
