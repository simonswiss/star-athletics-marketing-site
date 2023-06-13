import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { MapIcon, BanknotesIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

import { reader } from '@/app/keystatic/reader'

export async function NswEvents() {
  const events = await reader.collections.nswEvents.all({ resolveLinkedFiles: true })
  return (
    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
      <dl className="grid max-w-xl grid-cols-1 gap-x-16 gap-y-20 lg:max-w-none lg:grid-cols-3">
        {events.map((event) => {
          const spotsLeft = event.entry.capacity - event.entry.enrolments
          let availabilityClasses = 'bg-green-100 text-green-600'
          if (spotsLeft <= 5) {
            availabilityClasses = 'bg-yellow-100 text-yellow-600'
          }
          if (spotsLeft === 0) {
            availabilityClasses = 'bg-red-100 text-red-600'
          }

          return (
            <div key={event.slug} className="flex flex-col">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                {event.entry.name}
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <div className="mt-2 flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5 text-slate-400" />
                  <p className="text-sm text-slate-500">
                    {format(new Date(event.entry.date), 'dd MMMM yyyy')}, {event.entry.startTime} –{' '}
                    {event.entry.endTime}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-slate-400" />
                  <p className="text-sm text-slate-500">{event.entry.location}</p>
                </div>
                {event.entry.price && (
                  <div className="mt-2 flex items-center gap-2">
                    <BanknotesIcon className="h-5 w-5 text-slate-400" />
                    <p className="text-sm text-slate-500">{event.entry.price}</p>
                  </div>
                )}
                <div className="mt-4">
                  <span
                    className={twMerge(
                      'inline-flex items-center gap-1 self-start rounded-full px-2 py-1 text-xs font-medium',
                      availabilityClasses
                    )}
                  >
                    <span className="font-semibold">
                      {spotsLeft ? `${spotsLeft} spots left` : 'Session Full'}
                    </span>{' '}
                    <span>({event.entry.capacity} total)</span>
                  </span>
                </div>
                <p className="mt-4 flex-auto">{event.entry.description}</p>

                {event.entry.status === 'open' && event.entry.bookingFormUrl && (
                  <p className="mt-6">
                    <a
                      className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                      href={event.entry.bookingFormUrl}
                    >
                      Enroll now
                    </a>
                  </p>
                )}

                {event.entry.status === 'waitlist' && (
                  <p className="mt-6">
                    <a
                      href={`mailto:hello@star-athletics.com.au?subject=Waitlist for ${event.entry.name}`}
                      className="text-sm font-semibold leading-6 text-purple-600"
                    >
                      Get on waitlist <span aria-hidden="true">→</span>
                    </a>
                  </p>
                )}

                {event.entry.status === 'closed' && (
                  <p className="mt-6 text-sm font-semibold text-red-500">Registrations closed</p>
                )}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
