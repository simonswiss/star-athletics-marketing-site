import Image from 'next/image'
import { DocumentRenderer } from '@keystatic/core/renderer'

import { reader } from '@/app/keystatic/reader'

export default async function Example() {
  const coaches = await reader.collections.coaches.all({ resolveLinkedFiles: true })
  if (!coaches) throw new Error('No coaches found — please add in CMS')
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Meet the coaches
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We’re a dynamic group of individuals who are passionate about what we do and dedicated
            to delivering the best results for our clients.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:max-w-4xl lg:gap-x-8 xl:max-w-none"
        >
          {coaches.map((coach) => (
            <li key={coach.entry.name} className="flex flex-col gap-6 xl:flex-row">
              {coach.entry.avatar && (
                <Image
                  width={400}
                  height={600}
                  className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover"
                  src={coach.entry.avatar}
                  alt=""
                />
              )}
              <div className="flex-auto">
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  {coach.entry.name}
                </h3>
                <p className="text-base text-gray-600">{coach.entry.role}</p>
                <hr className="mt-4 w-12" />
                <div className="mt-6 text-base leading-7 text-gray-600">
                  <DocumentRenderer document={coach.entry.bio} />
                </div>
                <hr className="mt-6 w-12" />
                <div className="mt-6">
                  <a
                    href={`${coach.entry.region.toLowerCase()}/sessions`}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    {coach.entry.name}&apos;s sessions in {coach.entry.region}{' '}
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
