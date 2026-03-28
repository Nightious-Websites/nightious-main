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

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    date: z.coerce.date(),
    author: z.string().default('Nightious Team'),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
})

export const collections = { services, blog }
