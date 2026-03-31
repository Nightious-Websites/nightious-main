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
    images: z.object({
      img1: z.string().optional(),
      img2: z.string().optional(),
    }).optional(),
    sections: z.object({
      hero: z.object({
        hook: z.string(),
      }).optional(),
      whyItMatters: z.object({
        body: z.string(),
        stats: z.array(z.object({
          value: z.string(),
          unit: z.string(),
          short: z.string().optional(),
          label: z.string(),
        })).length(3),
      }).optional(),
      whatWeDo: z.object({
        wideCard: z.object({
          label: z.string(),
          headline: z.string(),
          description: z.string(),
          chips: z.array(z.string()).optional(),
        }),
        features: z.array(z.object({
          icon: z.string(),
          title: z.string(),
          description: z.string(),
        })).optional(),
      }).optional(),
      whatYouGet: z.object({
        banner: z.object({
          label: z.string(),
          headline: z.string(),
          description: z.string(),
        }),
        outcomes: z.array(z.object({
          icon: z.string(),
          title: z.string(),
          description: z.string(),
        })).length(4),
      }).optional(),
    }).optional(),
  }),
})

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Nightious Team'),
    tags: z.array(z.string()).default([]),
    canonical: z.string().url().optional(),
    image: z.string().optional(),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
})

export const collections = { services, blog }
