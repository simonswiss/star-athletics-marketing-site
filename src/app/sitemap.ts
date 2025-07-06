import { MetadataRoute } from 'next'

import { reader } from './keystatic/reader'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const coaches = await reader.collections.coaches.list()
  const coachesUrls = coaches.map((coach) => ({
    url: `https://www.star-athletics.com.au/coaches/${coach}`,
    lastModified: new Date(),
  }))

  return [
    // Homepage
    { url: 'https://www.star-athletics.com.au', lastModified: new Date() },
    // Contact
    { url: 'https://www.star-athletics.com.au/contact', lastModified: new Date() },
    // Register
    { url: 'https://www.star-athletics.com.au/register', lastModified: new Date() },
    // FAQ
    { url: 'https://www.star-athletics.com.au/faq', lastModified: new Date() },

    // Coaches
    { url: 'https://www.star-athletics.com.au/coaches', lastModified: new Date() },
    ...coachesUrls,
    // Sydney pages
    { url: 'https://www.star-athletics.com.au/sydney', lastModified: new Date() },
    { url: 'https://www.star-athletics.com.au/sydney/sessions', lastModified: new Date() },
    { url: 'https://www.star-athletics.com.au/sydney/one-on-one', lastModified: new Date() },
    { url: 'https://www.star-athletics.com.au/sydney/holiday-camps', lastModified: new Date() },
    { url: 'https://www.star-athletics.com.au/sydney/popup-clinics', lastModified: new Date() },
    // Woopi pages
    { url: 'https://www.star-athletics.com.au/woopi', lastModified: new Date() },
    { url: 'https://www.star-athletics.com.au/woopi/sessions', lastModified: new Date() },
    { url: 'https://www.star-athletics.com.au/woopi/one-on-one', lastModified: new Date() },
    { url: 'https://www.star-athletics.com.au/woopi/holiday-camps', lastModified: new Date() },
    { url: 'https://www.star-athletics.com.au/woopi/popup-clinics', lastModified: new Date() },
  ]
}
