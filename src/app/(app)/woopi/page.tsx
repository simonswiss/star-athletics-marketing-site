import { reader } from '@/app/keystatic/reader'
import { RegionOverview } from '@/components/RegionOverview'

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
  return <RegionOverview data={data} />
}
