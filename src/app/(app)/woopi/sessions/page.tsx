import { MdxRenderer } from '@/components/MdxRenderer'
import { Sessions } from '@/components/sessions'
import { reader } from '@/app/keystatic/reader'

import { sharedOpenGraphMetadata, extractTextFromDocument } from '@/lib/shared-metadata'

export async function generateMetadata() {
  const pageData = await reader.singletons.woopiSessionsPage.readOrThrow({
    resolveLinkedFiles: true,
  })

  const metaTitleAndDescription = {
    title: pageData.title,
    description: extractTextFromDocument(pageData.leadText, 160),
  }

  return {
    ...metaTitleAndDescription,
    openGraph: {
      ...metaTitleAndDescription,
      ...sharedOpenGraphMetadata,
    },
  }
}

export default async function WoopiSessions() {
  const data = await reader.singletons.woopiSessionsPage.readOrThrow({
    resolveLinkedFiles: true,
  })

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mt-12 max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {data.title}
          </h2>
          <div className="prose mt-6 text-lg leading-8 text-gray-600">
            <MdxRenderer content={data.leadText} />
          </div>
        </div>
        <Sessions region="woopi" />
      </div>
    </div>
  )
}
