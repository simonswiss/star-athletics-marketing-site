import Image from 'next/image'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { DocumentRenderer } from '@keystatic/core/renderer'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'

import { reader } from '@/app/keystatic/reader'

import { sharedOpenGraphMetadata, extractTextFromDocument } from '@/lib/shared-metadata'

export async function generateMetadata() {
  const pageData = await reader.singletons.coachesPage.readOrThrow({
    resolveLinkedFiles: true,
  })

  const metaTitleAndDescription = {
    title: pageData.title,
    description: extractTextFromDocument(pageData.introText),
  }

  return {
    ...metaTitleAndDescription,
    openGraph: {
      ...metaTitleAndDescription,
      ...sharedOpenGraphMetadata,
    },
  }
}

export default async function Example() {
  const coachesPage = await reader.singletons.coachesPage.readOrThrow({ resolveLinkedFiles: true })
  const coaches = await reader.collections.coaches.all({ resolveLinkedFiles: true })
  if (!coaches) throw new Error('No coaches found — please add in CMS')

  return (
    <div className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-20 px-6 lg:px-8 xl:grid-cols-5">
        <div className="max-w-2xl xl:col-span-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {coachesPage.title}
          </h2>
          <div className="prose prose-purple mt-6 text-gray-600">
            <DocumentRenderer document={coachesPage.introText} />
          </div>
        </div>
        <ul role="list" className="-mt-12 space-y-12 divide-y divide-gray-200 xl:col-span-3">
          {coaches.map((coach) => (
            <li
              key={coach.entry.name}
              className="flex flex-col items-start gap-10 pt-12 sm:flex-row"
            >
              {coach.entry.avatar && (
                <Image
                  className="aspect-[4/5] w-52 rounded-2xl object-cover"
                  src={coach.entry.avatar}
                  width={800}
                  height={800}
                  alt=""
                />
              )}
              <div className="max-w-xl flex-auto">
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  <Link className="hover:underline" href={`/coaches/${coach.slug}`}>
                    {coach.entry.name}
                  </Link>
                </h3>
                <p className="text-base leading-7 text-gray-600">{coach.entry.role}</p>

                <ul role="list" className="mt-4 flex flex-wrap gap-2">
                  {coach.entry.qualifications.map((qualification) => (
                    <li key={qualification} className="flex items-center gap-x-3">
                      <span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        <ShieldCheckIcon
                          className="h-5 w-5 flex-none text-green-600"
                          aria-hidden="true"
                        />
                        <span>{qualification}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-base leading-7 text-gray-600">{coach.entry.shortIntro}</p>

                <Link
                  href={`/coaches/${coach.slug}`}
                  className={twMerge(
                    'mt-6 block text-base font-semibold leading-7 hover:underline',
                    coach.entry.region === 'Sydney' ? 'text-sky-600' : 'text-purple-500'
                  )}
                >
                  Read full bio <span aria-hidden="true">→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
