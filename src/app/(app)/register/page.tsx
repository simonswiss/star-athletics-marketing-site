import { DocumentRenderer } from '@keystatic/core/renderer'

import { reader } from '@/app/keystatic/reader'

export default async function RegisterPage() {
  const data = await reader.singletons.registerPage.readOrThrow({ resolveLinkedFiles: true })
  return (
    <div className="bg-white">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {data.title}
          </h1>
          <div className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            <DocumentRenderer document={data.document} />
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              Register in Sydney
            </a>
            <a
              href="#"
              className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              Register in Woopi
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
