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
  return await generatePageStaticParams('generalPages')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug.join('/')
  return await generatePageMetadata('generalPages', slug)
}

export default async function GeneralPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug.join('/')
  const page = await renderPage('generalPages', slug)

  return <DynamicPageComponent page={page} />
}
