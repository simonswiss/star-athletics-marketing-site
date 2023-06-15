import { reader } from '@/app/keystatic/reader'

import Component from './component'

import { sharedOpenGraphMetadata } from '@/lib/shared-metadata'

export async function generateMetadata() {
  const pageData = await reader.singletons.faqs.readOrThrow({
    resolveLinkedFiles: true,
  })

  const metaTitleAndDescription = {
    title: 'Frequently Asked Questions',
    description:
      pageData.questions
        .slice(0, 3)
        .map((question) => question.question)
        .join(' ') + ' Get answers to those common questions, and more.',
  }

  return {
    ...metaTitleAndDescription,
    openGraph: {
      ...metaTitleAndDescription,
      ...sharedOpenGraphMetadata,
    },
  }
}

async function getData() {
  const faqs = await reader.singletons.faqs.readOrThrow({ resolveLinkedFiles: true })
  return faqs.questions
}

export default async function Example() {
  const faqs = await getData()
  return <Component faqs={faqs} />
}
