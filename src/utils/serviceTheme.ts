export interface ServiceTheme {
  color: string
  colorLight: string
  colorDark: string
  colorRgb: string
  heroImage: string
  contentImage1: string
  contentImage2: string
}

export const serviceThemes: Record<string, ServiceTheme> = {
  'website-solutions':            { color: '#3b82f6', colorLight: '#93c5fd', colorDark: '#1d4ed8', colorRgb: '59, 130, 246',  heroImage: '/images/photos/service-website-solutions-hero.webp',            contentImage1: '/images/photos/service-website-solutions-1.webp',            contentImage2: '/images/photos/service-website-solutions-2.webp' },
  'email-solutions':              { color: '#10b981', colorLight: '#6ee7b7', colorDark: '#065f46', colorRgb: '16, 185, 129',  heroImage: '/images/photos/service-email-solutions-hero.webp',              contentImage1: '/images/photos/service-email-solutions-1.webp',              contentImage2: '/images/photos/service-email-solutions-2.webp' },
  'domain-solutions':             { color: '#f59e0b', colorLight: '#fcd34d', colorDark: '#92400e', colorRgb: '245, 158, 11',  heroImage: '/images/photos/service-domain-solutions-hero.webp',             contentImage1: '/images/photos/service-domain-solutions-1.webp',             contentImage2: '/images/photos/service-domain-solutions-2.webp' },
  'ai-integration':               { color: '#8b5cf6', colorLight: '#c4b5fd', colorDark: '#4c1d95', colorRgb: '139, 92, 246',  heroImage: '/images/photos/service-ai-integration-hero.webp',               contentImage1: '/images/photos/service-ai-integration-1.webp',               contentImage2: '/images/photos/service-ai-integration-2.webp' },
  'digital-marketing':            { color: '#ec4899', colorLight: '#f9a8d4', colorDark: '#9d174d', colorRgb: '236, 72, 153',  heroImage: '/images/photos/service-digital-marketing-hero.webp',            contentImage1: '/images/photos/service-digital-marketing-1.webp',            contentImage2: '/images/photos/service-digital-marketing-2.webp' },
  'computer-services':            { color: '#06b6d4', colorLight: '#67e8f9', colorDark: '#164e63', colorRgb: '6, 182, 212',   heroImage: '/images/photos/service-computer-services-hero.webp',            contentImage1: '/images/photos/service-computer-services-1.webp',            contentImage2: '/images/photos/service-computer-services-2.webp' },
  'streaming-consultation':       { color: '#f97316', colorLight: '#fdba74', colorDark: '#7c2d12', colorRgb: '249, 115, 22',  heroImage: '/images/photos/service-streaming-consultation-hero.webp',       contentImage1: '/images/photos/service-streaming-consultation-1.webp',       contentImage2: '/images/photos/service-streaming-consultation-2.webp' },
  'online-privacy':               { color: '#22c55e', colorLight: '#86efac', colorDark: '#14532d', colorRgb: '34, 197, 94',   heroImage: '/images/photos/service-online-privacy-hero.webp',               contentImage1: '/images/photos/service-online-privacy-1.webp',               contentImage2: '/images/photos/service-online-privacy-2.webp' },
  'organizational-effectiveness': { color: '#eab308', colorLight: '#fde047', colorDark: '#713f12', colorRgb: '234, 179, 8',   heroImage: '/images/photos/service-organizational-effectiveness-hero.webp', contentImage1: '/images/photos/service-organizational-effectiveness-1.webp', contentImage2: '/images/photos/service-organizational-effectiveness-2.webp' },
  'software-services':            { color: '#6366f1', colorLight: '#a5b4fc', colorDark: '#312e81', colorRgb: '99, 102, 241',  heroImage: '/images/photos/service-software-services-hero.webp',            contentImage1: '/images/photos/service-software-services-1.webp',            contentImage2: '/images/photos/service-software-services-2.webp' },
  'custom-services':              { color: '#f43f5e', colorLight: '#fda4af', colorDark: '#881337', colorRgb: '244, 63, 94',   heroImage: '/images/photos/service-custom-services-hero.webp',              contentImage1: '/images/photos/service-custom-services-1.webp',              contentImage2: '/images/photos/service-custom-services-2.webp' },
  'training-documentation':       { color: '#0ea5e9', colorLight: '#7dd3fc', colorDark: '#0c4a6e', colorRgb: '14, 165, 233',  heroImage: '/images/photos/service-training-documentation-hero.webp',       contentImage1: '/images/photos/service-training-documentation-1.webp',       contentImage2: '/images/photos/service-training-documentation-2.webp' },
}

export function getServiceTheme(slug: string): ServiceTheme {
  return serviceThemes[slug] ?? serviceThemes['website-solutions']
}
