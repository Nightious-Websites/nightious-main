import type { APIRoute } from 'astro'
import { getAllServices, entrySlug } from '@/utils/services'

export const GET: APIRoute = async () => {
  const services = await getAllServices()

  const serviceLines = services
    .map(s => `- [${s.data.title}](https://nightious.com/services/${entrySlug(s.id)}): ${s.data.description}`)
    .join('\n')

  const content = `# Nightious

> IT and digital solutions for small businesses, content creators, and startups. Based in St. Petersburg, Florida — serving clients remotely.

Nightious (nightious.com) is a technology services company providing practical IT support, web design, AI integration, digital marketing, and more. 4.9/5 rating from 50+ clients. Located at 7901 4th St N, Suite 300, St. Petersburg, FL 33702. Hours: Mon–Fri 2pm–11pm EST · Sat 9am–11pm EST · Sun 12pm–11pm EST.

## Pages

- [Homepage](https://nightious.com): Overview of services, client stats, how-it-works process, testimonials, and primary CTA
- [Services](https://nightious.com/services): Full catalog of all ${services.length} service categories with audience filtering
- [Contact](https://nightious.com/contact): Inquiry form and business details
- [Privacy Policy](https://nightious.com/privacy): How Nightious collects, uses, and protects personal information
- [Terms of Service](https://nightious.com/terms): Terms and conditions governing use of Nightious services and website

## Audience Pages

- [For Businesses](https://nightious.com/for-businesses): Service bundles curated for small businesses
- [For Creators](https://nightious.com/for-creators): Service bundles curated for content creators
- [For Individuals](https://nightious.com/for-individuals): Service bundles curated for individuals

## Services

${serviceLines}
`

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
