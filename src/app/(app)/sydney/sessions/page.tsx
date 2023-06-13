import { reader } from '@/app/keystatic/reader'
import { DocumentRenderer } from '@keystatic/core/renderer'

import { Sessions } from '@/components/sessions'

export default async function SydneySessions() {
  const data = await reader.singletons.sydneySessionsPage.readOrThrow({ resolveLinkedFiles: true })
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mt-12 max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {data.title}
          </h2>
          <div className="prose mt-6 text-lg leading-8 text-gray-600">
            <DocumentRenderer document={data.leadText} />
          </div>
        </div>
        {/* @ts-expect-error Server Component */}
        <Sessions region="sydney" />
      </div>
    </div>
  )
}
