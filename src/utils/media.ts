export function shouldDisableAutoplay(): boolean {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // saveData is optional in some browsers
  const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  return reducedMotion || saveData
}

export function initManagedAutoplayVideos(): void {
  if (typeof window === 'undefined' || shouldDisableAutoplay()) return

  const videos = document.querySelectorAll<HTMLVideoElement>(
    'video[data-hero-video="true"], video[data-autoplay-managed="true"], video[autoplay][muted]'
  )
  if (!videos.length) return

  videos.forEach((video) => {
    if (video.dataset.videoInitialized === 'true' && video.readyState > 0) {
      video.play().catch(() => {})
      return
    }

    video.dataset.videoInitialized = 'true'

    if (video.preload === 'none') {
      video.preload = 'metadata'
    }

    if (video.readyState === 0) {
      video.load()
    }

    video.play().catch(() => {})
  })
}

export function initVideoUpgrades(): void {
  if (typeof window === 'undefined') return

  const targets = document.querySelectorAll<HTMLVideoElement>(
    'video[data-video-upgrade="true"], video[data-hero-video="true"]'
  )
  if (!targets.length) return

  if (shouldDisableAutoplay()) {
    targets.forEach((video) => {
      video.removeAttribute('autoplay')
      video.pause()
    })
    return
  }

  // Fallback for older browsers
  if (!('IntersectionObserver' in window)) {
    targets.forEach((video) => {
      if (video.dataset.videoInitialized === 'true') return
      video.dataset.videoInitialized = 'true'
      video.play().catch(() => {})
    })
    return
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue

        const video = entry.target as HTMLVideoElement
        if (video.dataset.videoInitialized === 'true') {
          obs.unobserve(video)
          continue
        }

        video.dataset.videoInitialized = 'true'
        video.play().catch(() => {})
        obs.unobserve(video)
      }
    },
    { rootMargin: '200px 0px', threshold: 0.1 }
  )

  targets.forEach((video) => observer.observe(video))
}
