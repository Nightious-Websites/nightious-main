import { getCollection, getEntry } from 'astro:content'

/** Strip .md extension from Astro v5 entry.id to get the URL slug */
export function entrySlug(id: string): string {
  return id.replace(/\.md$/, '')
}

export async function getAllServices() {
  const services = await getCollection('services')
  return services.sort((a, b) => a.data.title.localeCompare(b.data.title))
}

export async function getServiceBySlug(slug: string) {
  return getEntry('services', slug)
}
