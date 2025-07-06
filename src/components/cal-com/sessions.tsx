import { ClockIcon, MapIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import { CalComBooking } from './booking'
import { fetchCalComEventTypes } from '@/lib/calcom'

interface CalComSessionsProps {
  region: 'woopi' | 'sydney'
}

export async function CalComSessions({ region }: CalComSessionsProps) {
  // Fetch Cal.com sessions for the specified region
  const sessions = await fetchCalComEventTypes(region)

  if (sessions.length === 0) {
    return null
  }

  return (
    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
      <h3 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
        Online Booking Sessions
      </h3>
      <dl className="grid max-w-xl grid-cols-1 gap-x-16 gap-y-20 lg:max-w-none lg:grid-cols-3">
        {sessions.map((session) => (
          <div key={session.slug} className="flex flex-col">
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
              <div className="mt-2 flex items-center gap-2">
                <BanknotesIcon className="h-5 w-5 text-slate-400" />
                <p className="text-sm text-slate-500">{session.price}</p>
              </div>
              <p className="mt-4 flex-auto">{session.description}</p>
              <div className="mt-6">
                <CalComBooking
                  booking={{
                    calComSlug: `star-athletics/${session.slug}`,
                    label: 'Book with Cal.com',
                    display: 'button',
                  }}
                />
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
