import { Metadata } from 'next'
import { decode } from 'he'

const seoImagePath = '/images/seo-image.png'

export const sharedOpenGraphMetadata: Metadata['openGraph'] = {
  locale: 'en_AU',
  url: 'https://star-athletics.com.au',
  images: [{ url: seoImagePath, width: 1200, height: 630, alt: 'Star Athletics' }],
}

// Extract plain text from Keystatic content for SEO descriptions
type DocumentElement =
  | {
      text?: string
      children?: DocumentElement[]
    }
  | string

// Helper function for extracting text from legacy document elements
function extractTextFromElement(element: DocumentElement): string {
  if (typeof element === 'string') return element

  if (element.text) return element.text

  if (element.children && Array.isArray(element.children)) {
    return element.children.map(extractTextFromElement).join('')
  }

  return ''
}

// Updated to handle both MDX strings and legacy document arrays
export function extractTextFromDocument(
  content: string | DocumentElement[],
  maxLength = 300
): string {
  let fullText: string

  // Handle MDX strings (new format)
  if (typeof content === 'string') {
    fullText = content
      .replace(/[#*_`[\]()]/g, '') // Remove markdown formatting
      .replace(/\n+/g, ' ') // Replace line breaks with spaces
  }
  // Handle legacy document arrays (old format)
  else if (Array.isArray(content)) {
    fullText = content.map(extractTextFromElement).join(' ')
  }
  // Fallback for invalid input
  else {
    return ''
  }

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
