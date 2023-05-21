import { reader } from '@/app/keystatic/reader'
import { Session } from './session'

export async function Sessions({ region }: { region: string }) {
  const collection =
    region === 'sydney' ? reader.collections.sydneySessions : reader.collections.woopiSessions
  const sessionSlugs = await collection.list()

  return (
    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
      <dl className="grid max-w-xl grid-cols-1 gap-x-16 gap-y-20 lg:max-w-none lg:grid-cols-3">
        {sessionSlugs.map((slug: string) => (
          <>
            {/* @ts-expect-error Server Component */}
            <Session key={slug} slug={slug} region={region} />
          </>
        ))}
      </dl>
    </div>
  )
}
