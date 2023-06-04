import { reader } from '@/app/keystatic/reader'

import Component from './component'

async function getData() {
  const faqs = await reader.singletons.faqs.readOrThrow({ resolveLinkedFiles: true })
  return faqs.questions
}

export default async function Example() {
  const faqs = await getData()
  return <Component faqs={faqs} />
}
