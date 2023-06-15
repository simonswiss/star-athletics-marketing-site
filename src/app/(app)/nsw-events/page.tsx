import Image from 'next/image'
import { reader } from '@/app/keystatic/reader'
import { DocumentRenderer } from '@keystatic/core/renderer'
import { NswEvents } from '@/components/nsw-events'

import { sharedOpenGraphMetadata } from '@/lib/shared-metadata'

export async function generateMetadata() {
  const pageData = await reader.singletons.nswEventsPage.readOrThrow({
    resolveLinkedFiles: true,
  })

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
  const data = await reader.singletons.nswEventsPage.readOrThrow({ resolveLinkedFiles: true })
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {data.image ? (
          <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-4">
              {data.image && (
                <Image
                  src={data.image}
                  alt={data.title}
                  className="rounded-lg shadow-lg"
                  height={800}
                  width={800}
                />
              )}
            </div>
            <div>
              <div className="text-base leading-7 text-gray-700 lg:max-w-lg">
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {data.title}
                </h1>
                <div className="prose mt-6 max-w-xl">
                  <DocumentRenderer document={data.document} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-base leading-7 text-gray-700 lg:max-w-5xl">
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {data.title}
              </h1>
              <div className="prose mt-6 max-w-xl">
                <DocumentRenderer document={data.document} />
              </div>
            </div>
          </div>
        )}
        {/* @ts-expect-error Server Component */}
        <NswEvents />
      </div>
    </div>
  )
}
