import clsx from 'clsx'
import { ClockIcon, MapIcon, BanknotesIcon } from '@heroicons/react/24/outline'

import { reader } from '@/app/keystatic/reader'
import { CalComBooking } from '../cal-com/booking'
import { MdxRenderer } from '../MdxRenderer'

export async function Session({ slug, region }: { slug: string; region: string }) {
  const collection =
    region === 'sydney' ? reader.collections.sydneySessions : reader.collections.woopiSessions

  const session = await collection.readOrThrow(slug, { resolveLinkedFiles: true })

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
        {session.price && (
          <div className="mt-2 flex items-center gap-2">
            <BanknotesIcon className="h-5 w-5 text-slate-400" />
            <p className="text-sm text-slate-500">{session.price}</p>
          </div>
        )}
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
        <div className="mt-4 flex-auto space-y-6">
          <MdxRenderer content={session.description} />
        </div>

        {session.status === 'open' && session.bookingFormUrl && (
          <p className="mt-6">
            <a
              className="text-sm font-semibold leading-6 text-purple-600"
              href={session.bookingFormUrl}
            >
              Enroll now <span aria-hidden="true">→</span>
            </a>
          </p>
        )}

        {session.status === 'waitlist' && (
          <p className="mt-6">
            <a
              href={`mailto:${
                region === 'sydney'
                  ? 'kirsten@star-athletics.com.au'
                  : 'heather@star-athletics.com.au'
              }?subject=Waitlist for ${session.name}`}
              className="text-sm font-semibold leading-6 text-purple-600"
            >
              Get on waitlist <span aria-hidden="true">→</span>
            </a>
          </p>
        )}

        {session.status === 'closed' && (
          <p className="mt-6 text-sm font-semibold leading-6 text-red-500">Registrations closed</p>
        )}

        {/* Cal.com booking widget */}
        {session.calComBooking && (
          <div className="mt-6">
            <CalComBooking
              booking={{
                calComSlug: session.calComBooking,
                label: 'Book via Cal.com',
                display: 'button',
              }}
            />
          </div>
        )}
      </dd>
    </div>
  )
}
