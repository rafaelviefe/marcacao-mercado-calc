import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://rafaelviefe.app',
      lastModified: new Date('2026-05-10'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}