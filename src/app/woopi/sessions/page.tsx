import clsx from 'clsx'
import { MapIcon, ClockIcon } from '@heroicons/react/24/outline'

type Session = {
  name: string
  slug: string
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  startTime: string
  endTime: string
  capacity: number
  availability: number
  description: string
  location: string
  images?: string[]
}

const sessions: Session[] = [
  {
    name: 'Speed & Agility',
    slug: 'speed-and-agility',
    description:
      'A session focused on speed and agility. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam necessitatibus incidunt ut officiis explicabo inventore.',
    day: 'Monday',
    startTime: '4:00pm',
    endTime: '5:00pm',
    capacity: 20,
    availability: 7,
    location: 'Location goes here',
  },
  {
    name: 'Core Strength',
    slug: 'core-strength',
    description:
      'A session focused on core strength. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam necessitatibus incidunt ut officiis explicabo inventore.',
    day: 'Tuesday',
    startTime: '7:00am',
    endTime: '8:00am',
    capacity: 12,
    availability: 12,
    location: 'Location goes here',
  },
  {
    name: 'Sprints Clinic',
    slug: 'sprints-clinic',
    description:
      'A session focused on top speed. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam necessitatibus incidunt ut officiis explicabo inventore.',
    day: 'Tuesday',
    startTime: '6:00pm',
    endTime: '7:00pm',
    capacity: 25,
    availability: 2,
    location: 'Location goes here',
  },
  {
    name: 'Long Distance',
    slug: 'long-distance',
    description:
      'A session focused on long distance. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam necessitatibus incidunt ut officiis explicabo inventore.',
    day: 'Wednesday',
    startTime: '7:00am',
    endTime: '8:00am',
    capacity: 30,
    availability: 21,
    location: 'Location goes here',
  },
  {
    name: 'Ultra Trail Prep',
    slug: 'ultra-trail-prep',
    description:
      'A session focused on those preparing for the Ultra 100. Yes, some people willingly do that! Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    day: 'Thursday',
    startTime: '6:00pm',
    endTime: '7:00pm',
    capacity: 10,
    availability: 6,
    location: 'Location goes here',
  },
]

export default function Example() {
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
            {sessions.map((session) => {
              const spotsLeft = session.capacity - session.availability
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
                      <a
                        href={session.slug}
                        className="text-sm font-semibold leading-6 text-purple-600"
                      >
                        Learn more <span aria-hidden="true">→</span>
                      </a>
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
