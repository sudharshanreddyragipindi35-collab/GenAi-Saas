import './ResultSkeleton.css'

function SkeletonBlock({ className = '' }) {
  return <span className={`skeleton-block ${className}`} aria-hidden="true" />
}

function ResultSkeleton() {
  return (
    <div className="result-skeleton" role="status" aria-live="polite">
      <span className="sr-only">Generating website draft</span>

      <div className="skeleton-summary">
        <div>
          <SkeletonBlock className="small" />
          <SkeletonBlock className="title" />
        </div>
        <SkeletonBlock className="pill" />
      </div>

      <div className="skeleton-grid">
        <SkeletonBlock />
        <SkeletonBlock />
        <SkeletonBlock />
        <SkeletonBlock />
      </div>

      <div className="skeleton-preview">
        <SkeletonBlock className="nav" />
        <SkeletonBlock className="hero" />
        <div className="skeleton-preview-grid">
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock />
        </div>
      </div>
    </div>
  )
}

export default ResultSkeleton
