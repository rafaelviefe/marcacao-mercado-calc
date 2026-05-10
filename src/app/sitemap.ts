import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://calculadora.rafaelviefe.app',
      lastModified: new Date('2024-05-10'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}