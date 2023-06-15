import { reader } from '@/app/keystatic/reader'
import { PlaceholderPage } from '@/components/PlaceholderPage'

import { sharedOpenGraphMetadata } from '@/lib/shared-metadata'

export async function generateMetadata() {
  const pageData = await reader.singletons.sydneyOneOnOne.readOrThrow({ resolveLinkedFiles: true })

  const metaTitleAndDescription = {
    title: pageData.title,
    description: pageData.document[0].children[0].text,
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
  const data = await reader.singletons.sydneyOneOnOne.readOrThrow({ resolveLinkedFiles: true })
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <PlaceholderPage data={data} />
    </>
  )
}
