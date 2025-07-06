import { Metadata } from 'next'
import { generatePageStaticParams, generatePageMetadata, renderPage } from '@/lib/page-utils'
import { DynamicPageComponent } from '@/components/pages/DynamicPageComponent'

interface PageParams {
  slug: string[]
}

interface PageProps {
  params: Promise<PageParams>
}

export async function generateStaticParams(): Promise<PageParams[]> {
  return await generatePageStaticParams('sydneyPages')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug.join('/')
  return await generatePageMetadata('sydneyPages', slug)
}

export default async function SydneyPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug.join('/')
  const page = await renderPage('sydneyPages', slug)

  return <DynamicPageComponent page={page} />
}
