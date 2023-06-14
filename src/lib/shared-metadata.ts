import { Metadata } from 'next'

const seoImagePath = '/images/seo-image.png'

export const sharedOpenGraphMetadata: Metadata['openGraph'] = {
  locale: 'en_AU',
  url: 'https://star-athletics.com.au',
  images: [{ url: seoImagePath, width: 1200, height: 630, alt: 'Star Athletics' }],
}
