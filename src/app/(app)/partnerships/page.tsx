import Image from 'next/image'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { MdxRenderer } from '@/components/MdxRenderer'

import { reader } from '@/app/keystatic/reader'

import { sharedOpenGraphMetadata, extractTextFromDocument } from '@/lib/shared-metadata'

export async function generateMetadata() {
  const pageData = await reader.singletons.partnershipsPage.readOrThrow({
    resolveLinkedFiles: true,
  })

  const metaTitleAndDescription = {
    title: pageData.title,
    description: extractTextFromDocument(pageData.introText, 160),
  }

  return {
    ...metaTitleAndDescription,
    openGraph: {
      ...metaTitleAndDescription,
      ...sharedOpenGraphMetadata,
    },
  }
}

export default async function PartnershipsPage() {
  const partnershipsPage = await reader.singletons.partnershipsPage.readOrThrow({
    resolveLinkedFiles: true,
  })

  // Get the partnership slugs from the relationships
  const partnershipSlugs = partnershipsPage.partnerships
  if (!partnershipSlugs || partnershipSlugs.length === 0) {
    throw new Error('No partnerships found — please add in CMS')
  }

  // Fetch each partnership by slug
  const partnerships = await Promise.all(
    partnershipSlugs.map(async (slug) => {
      const partnership = await reader.collections.partnerships.readOrThrow(slug, {
        resolveLinkedFiles: true,
      })
      return { slug, entry: partnership }
    })
  )

  return (
    <div className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-20 px-6 lg:px-8 xl:grid-cols-5">
        <div className="max-w-2xl xl:col-span-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {partnershipsPage.title}
          </h2>
          <div className="prose prose-purple mt-6 text-gray-600">
            <MdxRenderer content={partnershipsPage.introText} />
          </div>
        </div>
        <ul role="list" className="-mt-12 space-y-12 divide-y divide-gray-200 xl:col-span-3">
          {partnerships.map((partnership) => (
            <li
              key={partnership.slug}
              className="flex flex-col items-start gap-10 pt-12 sm:flex-row"
            >
              {partnership.entry?.logo && (
                <Image
                  className="w-52"
                  src={partnership.entry.logo}
                  width={400}
                  height={400}
                  alt=""
                />
              )}
              <div className="max-w-xl flex-auto">
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  <Link className="hover:underline" href={`/partnerships/${partnership.slug}`}>
                    {partnership.entry?.name}
                  </Link>
                </h3>

                <div className="prose prose-purple mt-4 text-base leading-7 text-gray-600">
                  {partnership.entry?.introText && (
                    <MdxRenderer content={partnership.entry.introText} />
                  )}
                </div>

                {partnership.entry?.perks && partnership.entry.perks.length > 0 && (
                  <div className="prose mt-6">
                    <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                      Member Benefits:
                    </h3>
                    <ul>
                      {partnership.entry.perks.map((perk, index) => (
                        <li key={index} className="list-disc">
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {partnership.entry?.website && (
                  <Link
                    href={partnership.entry.website}
                    className={twMerge(
                      'mt-6 block text-base font-semibold leading-7 hover:underline'
                    )}
                  >
                    {partnership.entry?.name} website <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
