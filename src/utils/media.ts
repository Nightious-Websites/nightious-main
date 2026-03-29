export function shouldDisableAutoplay(): boolean {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // saveData is optional in some browsers
  const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  return reducedMotion || saveData
}

export function initManagedAutoplayVideos(): void {
  if (typeof window === 'undefined' || shouldDisableAutoplay()) return

  const video = document.querySelector<HTMLVideoElement>('video[data-autoplay-managed="true"]')
  if (!video) return

  video.play().catch(() => {})
}

export function initVideoUpgrades(): void {
  if (typeof window === 'undefined') return

  const targets = document.querySelectorAll<HTMLVideoElement>('video[data-video-upgrade="true"]')
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
