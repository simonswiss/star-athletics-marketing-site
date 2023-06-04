import { reader } from '@/app/keystatic/reader'
import { RegionOverview } from '@/components/RegionOverview'

export default async function Example() {
  const data = await reader.singletons.sydneyPage.readOrThrow({ resolveLinkedFiles: true })
  return <RegionOverview data={data} />
}
