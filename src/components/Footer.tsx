import { reader } from '@/app/keystatic/reader'
import { FooterClient } from './FooterClient'

export default async function Footer() {
  const contacts = await reader.singletons.contacts.readOrThrow({ resolveLinkedFiles: true })

  return <FooterClient contacts={contacts} />
}
