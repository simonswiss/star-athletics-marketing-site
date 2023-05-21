import clsx from 'clsx'
import { ClockIcon, MapIcon } from '@heroicons/react/24/outline'

import { reader } from '@/app/keystatic/reader'

export async function Session({ slug, region }: { slug: string; region: string }) {
  const collection =
    region === 'sydney' ? reader.collections.sydneySessions : reader.collections.woopiSessions

  const session = await collection.readOrThrow(slug)

  const spotsLeft = session.capacity - session.enrolments
  let availabilityClasses = 'bg-green-100 text-green-600'
  if (spotsLeft <= 5) {
    availabilityClasses = 'bg-yellow-100 text-yellow-600'
  }
  if (spotsLeft === 0) {
    availabilityClasses = 'bg-red-100 text-red-600'
  }

  return (
    <div key={session.name} className="flex flex-col">
      <dt className="text-base font-semibold leading-7 text-gray-900">{session.name}</dt>
      <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
        <div className="mt-2 flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-slate-400" />
          <p className="text-sm text-slate-500">
            {session.day}, {session.startTime} – {session.endTime}
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-slate-400" />
          <p className="text-sm text-slate-500">{session.location}</p>
        </div>
        <div className="mt-4">
          <span
            className={clsx(
              'inline-flex items-center gap-1 self-start rounded-full px-2 py-1 text-xs font-medium',
              availabilityClasses
            )}
          >
            <span className="font-semibold">
              {spotsLeft ? `${spotsLeft} spots left` : 'Session Full'}
            </span>{' '}
            <span>({session.capacity} total)</span>
          </span>
        </div>
        <p className="mt-4 flex-auto">{session.description}</p>
        <p className="mt-6">
          {spotsLeft ? (
            <a
              className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              href="#"
            >
              Enroll now
            </a>
          ) : (
            <a href={slug} className="text-sm font-semibold leading-6 text-purple-600">
              {spotsLeft ? 'Join session' : 'Get on waitlist'} <span aria-hidden="true">→</span>
            </a>
          )}
        </p>
      </dd>
    </div>
  )
}
