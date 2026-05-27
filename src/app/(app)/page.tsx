import { reader } from '@/app/keystatic/reader'
import { extractTextFromDocument, sharedOpenGraphMetadata } from '@/lib/shared-metadata'

import Hero from './_partials/Hero'
import Introduction from './_partials/Introduction'
import Testimonials from './_partials/Testimonials'

export async function generateMetadata() {
  const pageData = await reader.singletons.homepage.readOrThrow({
    resolveLinkedFiles: true,
  })

  const metaTitleAndDescription = {
    title: 'Star Athletics',
    description: extractTextFromDocument(pageData.introductionText, 160),
  }

  return {
    ...metaTitleAndDescription,
    openGraph: {
      ...metaTitleAndDescription,
      ...sharedOpenGraphMetadata,
    },
  }
}

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <Testimonials />
    </>
  )
}
