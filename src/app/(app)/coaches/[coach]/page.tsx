import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import { reader } from '@/app/keystatic/reader'
import { DocumentRenderer } from '@keystatic/core/renderer'
import { twMerge } from 'tailwind-merge'

const stats = [
  { label: 'Founded', value: '2021' },
  { label: 'Employees', value: '37' },
  { label: 'Countries', value: '12' },
  { label: 'Raised', value: '$25M' },
]

export async function generateStaticParams() {
  const coachSlugs = await reader.collections.coaches.list()

  return coachSlugs.map((slug) => ({
    slug,
  }))
}

export default async function Example({
  params: { coach: coachSlug },
}: {
  params: { coach: string }
}) {
  const coach = await reader.collections.coaches.readOrThrow(coachSlug, {
    resolveLinkedFiles: true,
  })
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div>
            {coach.avatar && (
              <Image
                height={800}
                width={800}
                src={coach.avatar}
                className="rounded-2xl shadow-2xl"
                alt={`Picture of ${coach.name}`}
              />
            )}

            {/* Qualifications */}
            <h2 className="mt-12 text-2xl font-bold tracking-tight text-gray-900">
              Qualifications
            </h2>
            <ul role="list" className="mt-6 flex flex-wrap gap-2">
              {coach.qualifications.map((qualification) => (
                <li key={qualification} className="flex items-center gap-x-3">
                  <span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-700">
                    <ShieldCheckIcon
                      className="h-5 w-5 flex-none text-green-600"
                      aria-hidden="true"
                    />
                    <span>{qualification}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-base leading-7 text-gray-700 lg:max-w-lg">
              <p
                className={twMerge(
                  'text-base font-semibold leading-7',
                  coach.region === 'sydney' ? 'text-purple-600' : 'text-sky-500'
                )}
              >
                {coach.role}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Meet {coach.name}!
              </h1>
              <p className="mt-4 text-xl text-gray-600">{coach.shortIntro}</p>
              <div className="prose mt-6 max-w-xl">
                <DocumentRenderer document={coach.bio} />
              </div>
            </div>
            <div className="mt-10 flex">
              <Link
                href={`/${coach.region.toLowerCase()}/sessions`}
                className={twMerge(
                  'text-base font-semibold leading-7 hover:underline',
                  coach.region === 'Sydney' ? 'text-purple-600' : 'text-sky-500'
                )}
              >
                View {coach.name}&apos;s sessions in {coach.region}{' '}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
