import { defineCollection, z } from 'astro:content'

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string().max(160),
    category: z.enum([
      'Website', 'Email', 'Domain', 'AI', 'Marketing',
      'Computers', 'Streaming', 'Privacy', 'Operations',
      'Software', 'Custom', 'Training',
    ]),
    color: z.string(),
    icon: z.string(),
    relatedSlugs: z.array(z.string()).max(3),
  }),
})

export const collections = { services }
