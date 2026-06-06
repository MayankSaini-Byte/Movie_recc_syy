import './SkeletonCard.css'

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__poster" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__title" />
        <div className="skeleton-card__meta" />
      </div>
    </div>
  )
}

export default SkeletonCard
