import { Metadata } from 'next'
import { decode } from 'he'

const seoImagePath = '/images/seo-image.png'

export const sharedOpenGraphMetadata: Metadata['openGraph'] = {
  locale: 'en_AU',
  url: 'https://star-athletics.com.au',
  images: [{ url: seoImagePath, width: 1200, height: 630, alt: 'Star Athletics' }],
}

// Extract plain text from Keystatic document for SEO descriptions
export function extractTextFromDocument(document: any[], maxLength = 300): string {
  if (!document || !Array.isArray(document)) return ''

  function extractTextFromElement(element: any): string {
    if (typeof element === 'string') return element

    if (element.text) return element.text

    if (element.children && Array.isArray(element.children)) {
      return element.children.map(extractTextFromElement).join('')
    }

    return ''
  }

  const fullText = document.map(extractTextFromElement).join(' ')

  // Properly decode HTML entities and normalize whitespace
  const cleanText = decode(fullText)
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()

  // Trim to maxLength, but try to end at a sentence boundary
  if (cleanText.length <= maxLength) return cleanText

  const truncated = cleanText.substring(0, maxLength)
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  )

  // If we found a sentence end within reasonable distance, use it
  if (lastSentenceEnd > maxLength * 0.7) {
    return truncated.substring(0, lastSentenceEnd + 1).trim()
  }

  // Otherwise, find the last space to avoid cutting words
  const lastSpace = truncated.lastIndexOf(' ')
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated).trim() + '...'
}
