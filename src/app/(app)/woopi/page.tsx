import { reader } from '@/app/keystatic/reader'
import { RegionOverview } from '@/components/RegionOverview'
import { MdxRenderer } from '@/components/MdxRenderer'

import { sharedOpenGraphMetadata } from '@/lib/shared-metadata'

export async function generateMetadata() {
  const pageData = await reader.singletons.woopiPage.readOrThrow()

  const metaTitleAndDescription = {
    title: pageData.title,
    description: pageData.leadText,
  }

  return {
    ...metaTitleAndDescription,
    openGraph: {
      ...metaTitleAndDescription,
      ...sharedOpenGraphMetadata,
    },
  }
}

export default async function Example() {
  const data = await reader.singletons.woopiPage.readOrThrow({ resolveLinkedFiles: true })
  const renderedContent = <MdxRenderer content={data.introText} />
  return <RegionOverview data={data} renderedContent={renderedContent} />
}
