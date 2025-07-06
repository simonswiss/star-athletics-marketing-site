import { reader } from '@/app/keystatic/reader'
import { Contact } from '@/components/Contact'

import { sharedOpenGraphMetadata, extractTextFromDocument } from '@/lib/shared-metadata'

export async function generateMetadata() {
  const pageData = await reader.singletons.contacts.readOrThrow({
    resolveLinkedFiles: true,
  })

  const metaTitleAndDescription = {
    title: pageData.title,
    description: extractTextFromDocument(pageData.document),
  }

  return {
    ...metaTitleAndDescription,
    openGraph: {
      ...metaTitleAndDescription,
      ...sharedOpenGraphMetadata,
    },
  }
}

export default function Example() {
  return (
    <div className="mt-12">
      {/* @ts-expect-error Server Component */}
      <Contact />
    </div>
  )
}
