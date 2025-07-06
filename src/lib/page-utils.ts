import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { reader } from '@/app/keystatic/reader'
import { extractTextFromDocument, sharedOpenGraphMetadata } from './shared-metadata'

type PageCollection = 'sydneyPages' | 'woopiPages' | 'generalPages'

export async function getPageData(collection: PageCollection, slug: string) {
  return await reader.collections[collection].read(slug, { resolveLinkedFiles: true })
}

export async function generatePageStaticParams(collection: PageCollection) {
  const pages = await reader.collections[collection].all()

  return pages.map((page) => ({
    slug: page.slug.split('/'),
  }))
}

export async function generatePageMetadata(
  collection: PageCollection,
  slug: string
): Promise<Metadata> {
  const page = await getPageData(collection, slug)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  // Extract description from document content
  const description = extractTextFromDocument(page.content)

  return {
    title: page.title,
    description,
    openGraph: {
      title: page.title,
      description,
      ...sharedOpenGraphMetadata,
    },
  }
}

export async function renderPage(collection: PageCollection, slug: string) {
  const page = await getPageData(collection, slug)

  if (!page) {
    notFound()
  }

  return page
}
