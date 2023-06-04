import { reader } from '@/app/keystatic/reader'
import { PlaceholderPage } from '@/components/PlaceholderPage'

export default async function Example() {
  const data = await reader.singletons.woopiHolidayCamps.readOrThrow({ resolveLinkedFiles: true })
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <PlaceholderPage data={data} />
    </>
  )
}
