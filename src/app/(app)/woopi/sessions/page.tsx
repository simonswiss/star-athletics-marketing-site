import clsx from 'clsx'
import { MapIcon, ClockIcon } from '@heroicons/react/24/outline'

import { reader } from '@/app/keystatic/reader'
import type { Entry } from '@keystatic/core/reader'
import keystaticConfig from '@/app/keystatic/keystatic.config'

type Session = {
  slug: string
  entry: Entry<(typeof keystaticConfig)['collections']['woopiSessions']>
}

export default async function Example() {
  const sessions = await reader.collections.woopiSessions.all()
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mt-12 max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Woopi sessions
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            This is the placeholder page for the Woopi sessions. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Provident minus deleniti architecto eos hic at soluta
            laudantium aspernatur esse magni laboriosam.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {sessions.map(({ slug, entry: session }: Session) => {
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
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    {session.name}
                  </dt>
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
                          {spotsLeft ? 'Join session' : 'Get on waitlist'}{' '}
                          <span aria-hidden="true">→</span>
                        </a>
                      )}
                    </p>
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </div>
  )
}
