import { MetadataRoute } from 'next'

import { reader } from './keystatic/reader'
import { siteUrl } from '@/lib/shared-metadata'

function url(path = '') {
  return `${siteUrl}${path}`
}

function sitemapEntry(path = ''): MetadataRoute.Sitemap[number] {
  return {
    url: url(path),
    lastModified: new Date(),
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [coaches, generalPages, sydneyPages, woopiPages] = await Promise.all([
    reader.collections.coaches.list(),
    reader.collections.generalPages.list(),
    reader.collections.sydneyPages.list(),
    reader.collections.woopiPages.list(),
  ])

  return [
    sitemapEntry(),
    sitemapEntry('/contact'),
    sitemapEntry('/register'),
    sitemapEntry('/faq'),
    sitemapEntry('/coaches'),
    sitemapEntry('/partnerships'),
    sitemapEntry('/sydney'),
    sitemapEntry('/sydney/sessions'),
    sitemapEntry('/woopi'),
    sitemapEntry('/woopi/sessions'),
    ...coaches.map((coach) => sitemapEntry(`/coaches/${coach}`)),
    ...generalPages.map((slug) => sitemapEntry(`/${slug}`)),
    ...sydneyPages.map((slug) => sitemapEntry(`/sydney/${slug}`)),
    ...woopiPages.map((slug) => sitemapEntry(`/woopi/${slug}`)),
  ]
}
